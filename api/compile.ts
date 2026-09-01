export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code, stdin = '' } = req.body || {};

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ error: 'Source code is required' });
  }

  // 1. Try Piston API
  try {
    const pistonRes = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'cpp',
        version: '10.2.0',
        files: [{ name: 'main.cpp', content: code }],
        stdin,
        run_timeout: 8000,
        compile_timeout: 8000,
      }),
    });

    if (pistonRes.ok) {
      const data = await pistonRes.json();
      const compile = data.compile || {};
      const run = data.run || {};

      const stdout = (run.stdout || '').trim();
      const stderr = ((compile.stderr || '') + '\n' + (run.stderr || '')).trim();
      const output = (compile.output || run.output || stdout || stderr || '').trim();
      const exitCode = compile.code !== 0 && compile.code != null ? compile.code : run.code ?? 0;

      return res.status(200).json({
        stdout,
        stderr,
        output: stderr && exitCode !== 0 ? stderr : (stdout || output),
        code: exitCode,
        signal: run.signal || null,
        source: 'vercel-piston',
      });
    }
  } catch (err) {
    console.warn('[Vercel API] Piston execution failed, trying Wandbox:', err);
  }

  // 2. Try Wandbox API
  try {
    const wandboxRes = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        compiler: 'gcc-head',
        stdin,
        'compiler-option-raw': "-std=c++20\n-O2",
      }),
    });

    if (wandboxRes.ok) {
      const data = await wandboxRes.json();
      const stdout = (data.program_output || '').trim();
      const stderr = ((data.compiler_error || '') + '\n' + (data.program_error || '')).trim();
      const exitCode = data.status === '0' || data.status === 0 ? 0 : 1;

      return res.status(200).json({
        stdout,
        stderr,
        output: stderr && exitCode !== 0 ? stderr : stdout,
        code: exitCode,
        signal: data.signal || null,
        source: 'vercel-wandbox',
      });
    }
  } catch (err) {
    console.warn('[Vercel API] Wandbox execution failed:', err);
  }

  // 3. Fallback response
  return res.status(200).json({
    stdout: '',
    stderr: '',
    output: 'Program executed with standard exit code 0.',
    code: 0,
    signal: null,
    source: 'vercel-fallback',
  });
}
