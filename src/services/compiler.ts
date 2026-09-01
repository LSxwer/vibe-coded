import { CompilationResult, TestCase } from '../types';

export function normalizeOutput(str: string): string {
  return str
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

export async function executeCppCode(
  code: string,
  stdin: string = ''
): Promise<CompilationResult> {
  try {
    const res = await fetch('/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, stdin }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server returned ${res.status}`);
    }

    const data = await res.json();
    return {
      stdout: data.stdout || '',
      stderr: data.stderr || '',
      output: data.output || data.stdout || data.stderr || '',
      code: data.code ?? 0,
      signal: data.signal || null,
      source: data.source,
    };
  } catch (error: any) {
    console.error('Execution error:', error);
    return {
      stdout: '',
      stderr: error.message || 'Failed to execute code.',
      output: `Execution Error: ${error.message || 'Could not connect to compiler service.'}`,
      code: 1,
      signal: null,
      source: 'client-error-handler',
    };
  }
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
