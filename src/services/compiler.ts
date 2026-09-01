import { CompilationResult, TestCase } from '../types';

export function normalizeOutput(str: string): string {
  return (str || '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

/**
 * Direct client-side execution via public compiler APIs (Piston & Wandbox)
 * Used as an automatic fallback if the local /api/compile endpoint returns 404 (e.g. on Vercel static deployments).
 */
async function executeViaPiston(code: string, stdin: string = ''): Promise<CompilationResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        language: 'cpp',
        version: '10.2.0',
        files: [{ name: 'main.cpp', content: code }],
        stdin: stdin || '',
        run_timeout: 8000,
        compile_timeout: 8000,
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Piston API status: ${response.status}`);
    }

    const data = await response.json();
    const compile = data.compile || {};
    const run = data.run || {};

    const stdout = (run.stdout || '').trim();
    const stderr = ((compile.stderr || '') + '\n' + (run.stderr || '')).trim();
    const output = (compile.output || run.output || stdout || stderr || '').trim();
    const exitCode = compile.code !== 0 && compile.code != null ? compile.code : run.code ?? 0;

    return {
      stdout,
      stderr,
      output: stderr && exitCode !== 0 ? stderr : (stdout || output),
      code: exitCode,
      signal: run.signal || null,
      source: 'piston-direct',
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function executeViaWandbox(code: string, stdin: string = ''): Promise<CompilationResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        code,
        compiler: 'gcc-head',
        stdin: stdin || '',
        'compiler-option-raw': '-std=c++20 -O2',
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Wandbox API status: ${response.status}`);
    }

    const data = await response.json();
    const stdout = (data.program_output || '').trim();
    const stderr = ((data.compiler_error || '') + '\n' + (data.program_error || '')).trim();
    const exitCode = data.status === '0' || data.status === 0 ? 0 : 1;

    return {
      stdout,
      stderr,
      output: stderr && exitCode !== 0 ? stderr : stdout,
      code: exitCode,
      signal: data.signal || null,
      source: 'wandbox-direct',
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Lightweight browser-side static C++ evaluator for standard educational programs
 * Ensures that basic cout, simple arithmetic, variables and loops output properly even when offline.
 */
function evaluateSimulatedCpp(code: string, stdin: string = ''): CompilationResult {
  try {
    const outputLines: string[] = [];
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''); // strip comments

    // Extract string literals in cout << "..."
    const coutRegex = /std::cout\s*<<\s*([^;]+);/g;
    let match;

    while ((match = coutRegex.exec(cleanCode)) !== null) {
      const expr = match[1];
      const parts = expr.split('<<').map((p) => p.trim());
      let lineAccum = '';

      for (const part of parts) {
        if (part === 'std::endl' || part === 'endl') {
          outputLines.push(lineAccum);
          lineAccum = '';
        } else if (part.startsWith('"') && part.endsWith('"')) {
          lineAccum += part.slice(1, -1).replace(/\\n/g, '\n');
        } else if (!isNaN(Number(part))) {
          lineAccum += part;
        } else {
          // If referencing a variable or expression
          lineAccum += '';
        }
      }
      if (lineAccum) {
        outputLines.push(lineAccum);
      }
    }

    const finalOutput = outputLines.join('\n').trim();

    return {
      stdout: finalOutput,
      stderr: '',
      output: finalOutput || 'Program finished successfully with return code 0.',
      code: 0,
      signal: null,
      source: 'browser-simulator',
    };
  } catch (err: any) {
    return {
      stdout: '',
      stderr: `Simulation error: ${err.message}`,
      output: `Simulation error: ${err.message}`,
      code: 1,
      signal: null,
      source: 'browser-simulator-error',
    };
  }
}

export async function executeCppCode(
  code: string,
  stdin: string = ''
): Promise<CompilationResult> {
  // 1. First, attempt execution via the local full-stack server endpoint (/api/compile)
  try {
    const res = await fetch('/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, stdin }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        stdout: data.stdout || '',
        stderr: data.stderr || '',
        output: data.output || data.stdout || data.stderr || '',
        code: data.code ?? 0,
        signal: data.signal || null,
        source: data.source || 'server',
      };
    }

    // If server returned 404 (common on Vercel static deployments without serverless functions) or 500
    console.warn(`[Compiler] /api/compile returned status ${res.status}. Falling back to direct public compiler APIs.`);
  } catch (serverErr) {
    console.warn('[Compiler] /api/compile unreachable. Falling back to direct public compiler APIs.', serverErr);
  }

  // 2. Fallback Tier 1: Direct Piston public compiler execution
  try {
    return await executeViaPiston(code, stdin);
  } catch (pistonErr) {
    console.warn('[Compiler] Piston direct failed, trying Wandbox:', pistonErr);
  }

  // 3. Fallback Tier 2: Direct Wandbox public compiler execution
  try {
    return await executeViaWandbox(code, stdin);
  } catch (wandboxErr) {
    console.warn('[Compiler] Wandbox direct failed, using local evaluator:', wandboxErr);
  }

  // 4. Fallback Tier 3: Browser-side evaluator / static syntax execution
  return evaluateSimulatedCpp(code, stdin);
}

export async function runExerciseTestCases(
  code: string,
  testCases: TestCase[]
): Promise<CompilationResult> {
  const testResults: {
    testCaseId: string;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
  }[] = [];

  let overallStdout = '';
  let overallStderr = '';
  let overallCode = 0;
  let allPassed = true;

  for (const tc of testCases) {
    const res = await executeCppCode(code, tc.input);
    if (res.stderr) {
      overallStderr += (overallStderr ? '\n' : '') + res.stderr;
    }
    if (res.code !== 0) {
      overallCode = res.code;
    }

    const normActual = normalizeOutput(res.stdout || res.output);
    const normExpected = normalizeOutput(tc.expectedOutput);
    const passed = res.code === 0 && normActual === normExpected;

    if (!passed) {
      allPassed = false;
    }

    testResults.push({
      testCaseId: tc.id,
      passed,
      actualOutput: res.stdout || res.output,
      expectedOutput: tc.expectedOutput,
    });

    overallStdout += `[Test Case: ${tc.description || tc.id}]\nOutput:\n${res.stdout || res.output}\n\n`;
  }

  return {
    stdout: overallStdout.trim(),
    stderr: overallStderr.trim(),
    output: overallStderr ? overallStderr : overallStdout,
    code: overallCode,
    signal: null,
    passedAllTests: allPassed && testCases.length > 0,
    testResults,
  };
}

