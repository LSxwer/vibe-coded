import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '5mb' }));

// Lazy initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 2. C++ Code Execution Endpoint
app.post('/api/compile', async (req, res) => {
  try {
    const { code, stdin = '' } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Valid C++ code is required.' });
    }

    // Try Piston Public Execution API first
    let executionSuccess = false;
    let result: {
      stdout?: string;
      stderr?: string;
      output?: string;
      code?: number;
      signal?: string | null;
      source?: string;
    } = {};

    try {
      const pistonRes = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'cpp',
          version: '10.2.0',
          files: [
            {
              name: 'main.cpp',
              content: code,
            },
          ],
          stdin: stdin,
          run_timeout: 5000,
        }),
      });

      if (pistonRes.ok) {
        const data = await pistonRes.json();
        if (data.run) {
          result = {
            stdout: data.run.stdout || '',
            stderr: data.run.stderr || '',
            output: data.run.output || (data.run.stdout + (data.run.stderr ? '\n' + data.run.stderr : '')),
            code: data.run.code,
            signal: data.run.signal,
            source: 'piston-gcc',
          };
          executionSuccess = true;
        }
      }
    } catch (e) {
      console.warn('Piston API execution attempt failed:', e);
    }

    // Fallback: Wandbox API
    if (!executionSuccess) {
      try {
        const wandboxRes = await fetch('https://wandbox.org/api/compile.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            compiler: 'gcc-head',
            code: code,
            stdin: stdin,
          }),
        });

        if (wandboxRes.ok) {
          const wandboxData = await wandboxRes.json();
          result = {
            stdout: wandboxData.program_output || '',
            stderr: (wandboxData.compiler_error || '') + (wandboxData.program_error || ''),
            output: wandboxData.program_output || wandboxData.compiler_error || wandboxData.program_error || '',
            code: wandboxData.status === '0' ? 0 : 1,
            signal: null,
            source: 'wandbox',
          };
          executionSuccess = true;
        }
      } catch (e) {
        console.warn('Wandbox API execution attempt failed:', e);
      }
    }

    // If both compiler APIs fail or timeout, use intelligent Gemini C++ Compiler & Simulator
    if (!executionSuccess) {
      try {
        const ai = getAiClient();
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: `You are an exact, standard-compliant C++20 compiler (GCC/Clang) and runtime emulator.
Simulate compiling and running the following C++ code.
Input to stdin:
"${stdin}"

C++ Code:
\`\`\`cpp
${code}
\`\`\`

Return a JSON object with:
1. "compilationSuccess": boolean (true if valid C++, false if syntax/type errors)
2. "stdout": string (exact output of std::cout / printf, or empty if error)
3. "stderr": string (compiler error or runtime warning if any)
4. "output": string (combined output)
5. "code": number (0 for success, 1 for compilation/runtime error)
6. "explanation": string (brief diagnostic notes for beginner)

Only return valid JSON.`,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsed = JSON.parse(response.text?.trim() || '{}');
        result = {
          stdout: parsed.stdout || '',
          stderr: parsed.stderr || '',
          output: parsed.output || parsed.stdout || parsed.stderr || '',
          code: parsed.code ?? (parsed.compilationSuccess ? 0 : 1),
          signal: null,
          source: 'gemini-c++-engine',
        };
        executionSuccess = true;
      } catch (geminiErr: any) {
        console.error('Gemini compilation fallback error:', geminiErr);
        result = {
          stdout: '',
          stderr: 'Compiler service temporarily unavailable. Please try again.',
          output: 'Compiler service temporarily unavailable. Check your internet connection.',
          code: 1,
          signal: null,
          source: 'local-fallback',
        };
      }
    }

    return res.json(result);
  } catch (error: any) {
    console.error('Compilation route error:', error);
    res.status(500).json({ error: error.message || 'Execution failed' });
  }
});

// 3. AI C++ Tutor Endpoint
app.post('/api/gemini/tutor', async (req, res) => {
  try {
    const { question, currentCode, topic, userLevel = 'beginner' } = req.body;
    const ai = getAiClient();

    const prompt = `You are "CppZero AI Mentor", a friendly, crystal-clear, pedagogically brilliant C++ tutor for beginners.
Target Audience: ${userLevel} learner.
Current Topic: ${topic || 'General C++'}

Current Code Context:
${currentCode ? `\`\`\`cpp\n${currentCode}\n\`\`\`` : '(No code provided)'}

Learner Question / Query:
${question}

Instructions:
1. Explain in simple, intuitive terms using real-world analogies where helpful (e.g. pointers as memory mailboxes/addresses, variables as labeled boxes, references as nicknames/aliases).
2. Highlight syntax nuances (e.g. why we need semicolons, what #include does, the difference between value vs pointer).
3. If providing code, keep it modern, clean C++ (C++17/20), adhering to best practices (e.g. pass by const reference, avoiding raw memory leaks).
4. Keep the tone enthusiastic, encouraging, and structured with clear bold headers, bullet points, and code snippets.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error('AI Tutor error:', error);
    res.status(500).json({
      error: error.message || 'Failed to communicate with AI Tutor',
      fallbackAnswer: 'An error occurred while contacting the AI Mentor. Please check your Gemini API key or try again.',
    });
  }
});

// 4. AI Compiler Error Explainer Endpoint
app.post('/api/gemini/explain-error', async (req, res) => {
  try {
    const { errorText, code } = req.body;
    const ai = getAiClient();

    const prompt = `You are a C++ Compiler Error Doctor specializing in helping beginners understand cryptic compiler errors.
Code:
\`\`\`cpp
${code || '// no code provided'}
\`\`\`

Compiler / Runtime Error Message:
\`\`\`
${errorText}
\`\`\`

Provide a structured breakdown:
1. "What went wrong": Plain-English 1-2 sentence translation of the error.
2. "Why it happens": The underlying C++ rule violated (e.g. missing semicolon, dereferencing null pointer, wrong type conversion).
3. "The Fix": Exact corrected code snippet.
4. "Pro-tip / Best Practice": A tip to avoid this bug in the future.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
    });

    res.json({ explanation: response.text });
  } catch (error: any) {
    console.error('Explain Error route error:', error);
    res.status(500).json({ error: error.message || 'Failed to explain error' });
  }
});

// 5. AI Dynamic Exercise Generator
app.post('/api/gemini/generate-exercise', async (req, res) => {
  try {
    const { topic, difficulty = 'beginner' } = req.body;
    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: `Generate an engaging interactive C++ coding exercise for a ${difficulty} on the topic: "${topic}".
Output must be a valid JSON object matching this schema:
{
  "id": "custom-exercise-1",
  "title": "Exercise Title",
  "topic": "${topic}",
  "difficulty": "${difficulty}",
  "description": "Clear step-by-step instructions of what the code must achieve.",
  "learningObjectives": ["Objective 1", "Objective 2"],
  "starterCode": "#include <iostream>\\n\\nint main() {\\n    // TODO\\n    return 0;\\n}",
  "solutionCode": "#include <iostream>\\n\\nint main() {\\n    // Complete solution\\n    return 0;\\n}",
  "expectedOutput": "Expected standard output string",
  "hints": ["Hint 1", "Hint 2"],
  "testCases": [
    { "input": "", "expectedOutput": "Expected string" }
  ]
}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({ exercise: parsed });
  } catch (error: any) {
    console.error('Generate exercise error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate exercise' });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CppZero server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
