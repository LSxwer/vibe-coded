import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  Code2, 
  RotateCcw, 
  Lightbulb, 
  Copy, 
  Check, 
  ChevronRight,
  BookOpen,
  Wand2
} from 'lucide-react';
import { ChatMessage, Exercise } from '../types';
import { askAiMentor, explainCompilerError, generateCustomExercise } from '../services/ai';

interface AiMentorViewProps {
  initialPrompt?: string;
  initialCode?: string;
  onLoadCustomExercise?: (exercise: Exercise) => void;
}

export const AiMentorView: React.FC<AiMentorViewProps> = ({
  initialPrompt,
  initialCode,
  onLoadCustomExercise,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'errorDoctor' | 'generator'>('chat');
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `👋 **Hello! I'm your CppZero AI Mentor.**\n\nI'm here to help you master C++ from the ground up. You can ask me:\n- Conceptual explanations (pointers, references, memory allocation, RAII)\n- Code reviews and best practices\n- Syntax guidance and standard library usage\n\nWhat would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [codeContext, setCodeContext] = useState(initialCode || '');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Error Doctor state
  const [errorInput, setErrorInput] = useState('');
  const [errorDoctorCode, setErrorDoctorCode] = useState('');
  const [errorDiagnosis, setErrorDiagnosis] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);

  // Generator state
  const [genTopic, setGenTopic] = useState('Pointers and References');
  const [genDifficulty, setGenDifficulty] = useState('beginner');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedExercise, setGeneratedExercise] = useState<Exercise | null>(null);

  // Auto-fill prompt if passed from other views
  useEffect(() => {
    if (initialPrompt) {
      setInputQuestion(initialPrompt);
      if (initialCode) setCodeContext(initialCode);
    }
  }, [initialPrompt, initialCode]);

  // Scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputQuestion.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputQuestion,
      codeSnippet: codeContext || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const questionToSend = inputQuestion;
    const codeToSend = codeContext;
    setInputQuestion('');
    setIsLoading(true);

    try {
      const response = await askAiMentor({
        question: questionToSend,
        currentCode: codeToSend,
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputQuestion(promptText);
  };

  const handleRunErrorDoctor = async () => {
    if (!errorInput.trim() || isDiagnosing) return;
    setIsDiagnosing(true);
    setErrorDiagnosis(null);
    try {
      const diag = await explainCompilerError({
        errorText: errorInput,
        code: errorDoctorCode,
      });
      setErrorDiagnosis(diag);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleGenerateCustom = async () => {
    setIsGenerating(true);
    setGeneratedExercise(null);
    try {
      const ex = await generateCustomExercise({
        topic: genTopic,
        difficulty: genDifficulty,
      });
      setGeneratedExercise(ex);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              AI C++ Mentor & Compiler Doctor
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Powered by Google Gemini 3.7 — Get instant concept explanations, compiler error debugging, and dynamic exercises.
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSubTab === 'chat'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Mentor Chat
          </button>
          <button
            onClick={() => setActiveSubTab('errorDoctor')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSubTab === 'errorDoctor'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Compiler Error Doctor
          </button>
          <button
            onClick={() => setActiveSubTab('generator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSubTab === 'generator'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Exercise Generator
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: AI Mentor Chat */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Chat Panel (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col h-[650px] shadow-sm overflow-hidden">
            
            {/* Chat Messages Log */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-indigo-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                        : 'bg-slate-950 border border-slate-800/80 text-slate-200 shadow-sm'
                    }`}
                  >
                    {msg.codeSnippet && (
                      <div className="mb-2 p-2 rounded-lg bg-slate-900 font-mono text-[11px] text-blue-200 overflow-x-auto">
                        <pre>{msg.codeSnippet}</pre>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                      {msg.text}
                    </div>

                    <div className="text-[10px] text-slate-400 mt-2 text-right">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 text-xs text-indigo-400 bg-slate-950 p-4 rounded-2xl border border-slate-800/80 max-w-[70%]">
                  <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>AI Mentor is thinking and composing explanation...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
              <div className="flex items-center gap-2">
                <textarea
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask a question about C++ syntax, pointers, memory, STL, or exercises..."
                  rows={2}
                  className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 resize-none"
                />

                <button
                  id="btn-send-ai-message"
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputQuestion.trim()}
                  className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-md shadow-blue-500/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Quick Starter Prompts & Optional Code Context (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Quick Starters */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>Beginner Discussion Starters</span>
              </h3>

              <div className="space-y-2">
                {[
                  'Explain pointers vs references like I am 10 years old with an analogy',
                  'What is the difference between stack and heap memory in C++?',
                  'Why should I prefer std::unique_ptr over raw new/delete?',
                  'What is undefined behavior in C++ and how do I avoid it?',
                  'Why does std::vector resize in exponential capacity steps?',
                  'What does "const int* const ptr" actually mean?',
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors flex items-center justify-between group"
                  >
                    <span className="line-clamp-2 leading-relaxed">{prompt}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-blue-400 shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Attached Code Context Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Attach Code Context</span>
                </h3>
                {codeContext && (
                  <button
                    onClick={() => setCodeContext('')}
                    className="text-[10px] text-slate-500 hover:text-slate-300"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                value={codeContext}
                onChange={(e) => setCodeContext(e.target.value)}
                placeholder="// Paste relevant C++ snippet to discuss with mentor..."
                rows={6}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 placeholder-slate-600 outline-none resize-none"
              />
            </div>

          </div>

        </div>
      )}

      {/* Sub-Tab 2: Compiler Error Doctor */}
      {activeSubTab === 'errorDoctor' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Compiler Error Diagnostic Clinic</span>
            </h2>
            <p className="text-xs text-slate-400">
              Paste confusing GCC, Clang, or MSVC compiler error messages (e.g. segmentation faults, vtable errors, missing semicolons, type mismatches) and get a plain-English translation with the exact fix.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Compiler / Runtime Error Message:
              </label>
              <textarea
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
                placeholder="Paste compiler output (e.g. 'error: request for member in something not a structure' or 'Segmentation fault (core dumped)')..."
                rows={7}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-red-300 placeholder-slate-600 outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Your C++ Code:
              </label>
              <textarea
                value={errorDoctorCode}
                onChange={(e) => setErrorDoctorCode(e.target.value)}
                placeholder="Paste the C++ source code that generated the error..."
                rows={7}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-200 placeholder-slate-600 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleRunErrorDoctor}
            disabled={isDiagnosing || !errorInput.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isDiagnosing ? 'Analyzing Error...' : 'Diagnose & Fix Error'}</span>
          </button>

          {errorDiagnosis && (
            <div className="p-6 bg-slate-950 border border-indigo-500/30 rounded-2xl animate-fade-in space-y-3">
              <div className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                <Bot className="w-4 h-4" />
                <span>Doctor's Prescription & Fix:</span>
              </div>
              <div className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                {errorDiagnosis}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: AI Exercise Generator */}
      {activeSubTab === 'generator' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-purple-400" />
              <span>Dynamic AI Exercise Generator</span>
            </h2>
            <p className="text-xs text-slate-400">
              Need targeted practice on a specific topic? Gemini can generate a tailored C++ coding problem with starter code, automated test cases, and solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Target Topic / Concept:
              </label>
              <input
                type="text"
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                placeholder="e.g. Recursion, Operator Overloading, Binary Search, Linked Lists..."
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Difficulty Level:
              </label>
              <select
                value={genDifficulty}
                onChange={(e) => setGenDifficulty(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none cursor-pointer"
              >
                <option value="beginner">Beginner</option>
                <option value="easy">Easy</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleGenerateCustom}
            disabled={isGenerating || !genTopic.trim()}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
          >
            <Wand2 className="w-4 h-4" />
            <span>{isGenerating ? 'Generating Exercise...' : 'Generate Interactive Exercise'}</span>
          </button>

          {generatedExercise && (
            <div className="p-6 bg-slate-950 border border-purple-500/30 rounded-2xl animate-fade-in space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Generated Exercise
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  {generatedExercise.difficulty}
                </span>
              </div>

              <h3 className="text-base font-bold text-white">
                {generatedExercise.title}
              </h3>
              <p className="text-xs text-slate-300">
                {generatedExercise.description}
              </p>

              <div className="p-3 bg-slate-900 rounded-xl font-mono text-xs text-blue-200">
                <pre>{generatedExercise.starterCode}</pre>
              </div>

              {onLoadCustomExercise && (
                <button
                  onClick={() => onLoadCustomExercise(generatedExercise)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Open in Interactive Workspace</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
