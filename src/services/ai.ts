export async function askAiMentor(params: {
  question: string;
  currentCode?: string;
  topic?: string;
  userLevel?: string;
}): Promise<string> {
  try {
    const res = await fetch('/api/gemini/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      return data.answer || data.fallbackAnswer || 'No response from mentor.';
    }

    console.warn(`[AI Mentor] /api/gemini/tutor returned ${res.status}. Providing offline academic guidance.`);
  } catch (err: any) {
    console.warn('[AI Mentor] Server unreachable. Providing offline academic guidance.', err);
  }

  // Client-side pedagogical guidance fallback
  const q = (params.question || '').toLowerCase();
  if (q.includes('pointer') || q.includes('reference') || q.includes('&') || q.includes('*')) {
    return `### Pointers vs References in C++\n\n- **Pointers (\`int*\`):** Variables holding the memory address of another entity. They can point to \`nullptr\` and can be reassigned to different addresses.\n- **References (\`int&\`):** Direct aliases to an already existing object. They cannot be null and cannot be rebound after initialization.\n\n\`\`\`cpp\nint score = 42;\nint* ptr = &score; // Stores address\nint& ref = score;  // Alias to score\n\n*ptr = 50; // Updates score\nref = 100; // Also updates score\n\`\`\``;
  }
  if (q.includes('memory') || q.includes('heap') || q.includes('stack') || q.includes('raii')) {
    return `### C++ Memory Model & RAII\n\n- **Stack Allocation:** Fast, automatic lifetime governed by scope (LIFO). Ideal for local variables and fixed-size primitives.\n- **Heap Allocation:** Managed lifetime via dynamic allocation. In modern C++, always manage heap resources via smart pointers (\`std::unique_ptr\`, \`std::shared_ptr\`) to enforce **RAII** (Resource Acquisition Is Initialization) and prevent memory leaks.`;
  }
  return `### C++ Academic Mentor Guidance\n\n**Core Principle:** C++ provides zero-overhead abstractions and direct hardware access.\n\n- **Best Practices:**\n  - Always initialize your variables before reading them.\n  - Pass large objects and strings by \`const std::string&\` to prevent expensive deep copies.\n  - Favor Standard Library containers (\`std::vector\`, \`std::array\`, \`std::string\`) over raw C-style arrays.`;
}

export async function explainCompilerError(params: {
  errorText: string;
  code?: string;
}): Promise<string> {
  try {
    const res = await fetch('/api/gemini/explain-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      return data.explanation || 'Unable to generate error diagnosis.';
    }

    console.warn(`[Error Doctor] /api/gemini/explain-error returned ${res.status}. Providing offline diagnostic.`);
  } catch (err: any) {
    console.warn('[Error Doctor] Server unreachable. Providing offline diagnostic.', err);
  }

  const err = (params.errorText || '').toLowerCase();
  let fix = 'Check that all headers are included and syntax is standard C++20.';
  if (err.includes('expected') && err.includes(';')) {
    fix = 'A statement is missing a closing semicolon `;` at the end of the line or class definition.';
  } else if (err.includes('was not declared in this scope') || err.includes('undeclared identifier')) {
    fix = 'You are referencing a variable or function before declaring it, or missing an `#include` header (e.g. `<iostream>`, `<vector>`, `<string>`).';
  } else if (err.includes('segmentation fault') || err.includes('sigsegv')) {
    fix = 'A null or out-of-bounds pointer was dereferenced. Verify array indices and pointer validity before accessing memory.';
  }

  return `### Diagnostic Prescription\n\n**Issue Breakdown:** The compiler or runtime reported an issue with symbol resolution or syntax.\n\n**Recommended Fix:**\n${fix}\n\n**Tip:** Compile with \`-Wall -Wextra -Wpedantic\` to catch potential undefined behavior early.`;
}

export async function generateCustomExercise(params: {
  topic: string;
  difficulty?: string;
}): Promise<any> {
  try {
    const res = await fetch('/api/gemini/generate-exercise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data = await res.json();
      return data.exercise;
    }
  } catch (err: any) {
    console.warn('[Exercise Generator] Server unreachable. Using fallback challenge template.', err);
  }

  const topic = params.topic || 'C++ Basics';
  const difficulty = params.difficulty || 'beginner';

  return {
    id: `custom-${Date.now()}`,
    title: `Mastering ${topic}`,
    topic,
    difficulty,
    description: `Write a modern C++ program demonstrating core concepts of ${topic}. Output the calculated message to standard output.`,
    learningObjectives: [`Understand ${topic} fundamentals`, 'Write clean standard C++'],
    starterCode: `#include <iostream>\n\nint main() {\n    // Solve challenge for: ${topic}\n    std::cout << "Solving ${topic} challenge!" << std::endl;\n    return 0;\n}`,
    solutionCode: `#include <iostream>\n\nint main() {\n    std::cout << "Solving ${topic} challenge!" << std::endl;\n    return 0;\n}`,
    expectedOutput: `Solving ${topic} challenge!`,
    hints: ['Include <iostream> for standard streams', 'Make sure main() returns 0'],
    testCases: [{ input: '', expectedOutput: `Solving ${topic} challenge!` }],
  };
}

