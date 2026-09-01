import React, { useRef, useState, useEffect } from 'react';
import { Copy, Check, RotateCcw, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onRun?: () => void;
  onReset?: () => void;
  readOnly?: boolean;
  language?: string;
  minHeight?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  onRun,
  onReset,
  readOnly = false,
  language = 'cpp',
  minHeight = '360px',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<number>(14);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const lines = code.split('\n');
  const lineCount = lines.length;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;

    // Ctrl+Enter or Cmd+Enter to Run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (onRun) onRun();
      return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const indent = '    '; // 4 spaces
      const newCode = code.substring(0, start) + indent + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + indent.length;
      }, 0);
      return;
    }

    // Auto-close brackets & quotes
    const autoPairs: Record<string, string> = {
      '{': '}',
      '(': ')',
      '[': ']',
      '"': '"',
      "'": "'",
    };

    if (autoPairs[e.key] && start === end) {
      const closing = autoPairs[e.key];
      // Only auto-pair quotes if not preceded by backslash
      if (e.key === '"' || e.key === "'") {
        if (code[start - 1] === '\\') return;
      }
      e.preventDefault();
      const newCode = code.substring(0, start) + e.key + closing + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
      return;
    }

    // Handle Enter auto-indent
    if (e.key === 'Enter') {
      const currentLine = lines[code.substring(0, start).split('\n').length - 1] || '';
      const match = currentLine.match(/^\s*/);
      let indent = match ? match[0] : '';
      if (currentLine.trim().endsWith('{')) {
        indent += '    ';
      }
      e.preventDefault();
      const newCode = code.substring(0, start) + '\n' + indent + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
      }, 0);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`relative flex flex-col border border-[#1A1A1A] bg-[#1A1A1A] text-white overflow-hidden font-mono shadow-xl ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl bg-[#1A1A1A]' : ''
      }`}
      style={{ minHeight: isFullscreen ? 'auto' : minHeight }}
    >
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-white/10 text-xs text-white/60 select-none">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
          </div>
          <span className="font-mono font-bold text-white text-[11px] uppercase tracking-widest">Main.cpp — Exercise</span>
          <span className="text-[9px] text-[#FF6321] font-mono uppercase tracking-widest font-black px-1.5 py-0.2 border border-[#FF6321]/40">
            C++20 ISO
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <button
            id="editor-zoom-out"
            onClick={() => setFontSize((f) => Math.max(11, f - 1))}
            title="Decrease font size"
            className="p-1 text-white/50 hover:text-white"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-white/40 font-mono px-1">{fontSize}px</span>
          <button
            id="editor-zoom-in"
            onClick={() => setFontSize((f) => Math.min(20, f + 1))}
            title="Increase font size"
            className="p-1 text-white/50 hover:text-white"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="h-3 w-px bg-white/20 mx-1" />

          {/* Reset button */}
          {onReset && !readOnly && (
            <button
              id="editor-reset-code"
              onClick={onReset}
              title="Reset to starter code"
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-[#FF6321] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          {/* Copy button */}
          <button
            id="editor-copy-code"
            onClick={handleCopy}
            title="Copy code"
            className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-[#27C93F]" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          {/* Fullscreen toggle */}
          <button
            id="editor-fullscreen-toggle"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            className="p-1 text-white/50 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body with Line Numbers */}
      <div className="relative flex-1 flex overflow-auto bg-[#1A1A1A] text-white">
        {/* Line Numbers Column */}
        <div 
          className="select-none py-3 px-3.5 bg-[#141414] border-r border-white/10 text-right text-white/30 font-mono text-xs shrink-0"
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.65' }}
        >
          {Array.from({ length: Math.max(lineCount, 12) }).map((_, i) => (
            <div key={i} className="leading-[1.65]">{i + 1}</div>
          ))}
        </div>

        {/* Text Area Input */}
        <textarea
          id="cpp-code-textarea"
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          className="flex-1 w-full bg-transparent resize-none p-3.5 font-mono outline-none text-white placeholder-white/20 leading-[1.65] overflow-x-auto whitespace-pre tab-4 selection:bg-[#FF6321]/40"
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.65' }}
          placeholder="// Type your C++ code here..."
        />
      </div>

      {/* Footer shortcut bar */}
      <div className="px-4 py-2 bg-[#141414] border-t border-white/10 text-[10px] font-mono text-white/40 flex items-center justify-between uppercase tracking-widest">
        <div className="flex items-center gap-4">
          <span><kbd className="px-1.5 py-0.5 bg-white/10 text-white/80 font-mono text-[9px]">Tab</kbd> Indent</span>
          <span><kbd className="px-1.5 py-0.5 bg-white/10 text-white/80 font-mono text-[9px]">Ctrl/⌘+Enter</kbd> Run</span>
        </div>
        <div>
          <span>{lineCount} lines</span>
        </div>
      </div>
    </div>
  );
};
