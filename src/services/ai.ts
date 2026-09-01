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

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to get mentor response');
    }
    return data.answer || data.fallbackAnswer || 'No response from mentor.';
  } catch (err: any) {
    console.error('askAiMentor error:', err);
    return `Error connecting to AI Mentor: ${err.message || 'Please check your connection and API key.'}`;
  }
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

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to explain error');
    }
    return data.explanation || 'Unable to generate error diagnosis.';
  } catch (err: any) {
    console.error('explainCompilerError error:', err);
    return `Error diagnosing compiler message: ${err.message}`;
  }
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

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to generate exercise');
    }
    return data.exercise;
  } catch (err: any) {
    console.error('generateCustomExercise error:', err);
    throw err;
  }
}
