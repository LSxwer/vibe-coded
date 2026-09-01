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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#1A1A1A]">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-[#1A1A1A] text-[#FF6321] flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#1A1A1A] tracking-tight">
              AI Academic Mentor & Compiler Doctor
            </h1>
          </div>
          <p className="text-xs text-[#666] font-medium mt-1">
            Powered by Google Gemini — Multi-model intelligence for concept mastery, compiler diagnostics, and dynamic C++ exercises.
          </p>
        </div>

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-1 p-1 bg-[#F0F0ED] border border-[#1A1A1A] shrink-0">
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider transition-colors ${
              activeSubTab === 'chat'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#666] hover:text-[#1A1A1A]'
            }`}
          >
            Academic Mentor
          </button>
          <button
            onClick={() => setActiveSubTab('errorDoctor')}
            className={`px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider transition-colors ${
              activeSubTab === 'errorDoctor'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#666] hover:text-[#1A1A1A]'
            }`}
          >
            Error Clinic
          </button>
          <button
            onClick={() => setActiveSubTab('generator')}
            className={`px-3.5 py-1.5 text-[11px] font-black uppercase tracking-wider transition-colors ${
              activeSubTab === 'generator'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-[#666] hover:text-[#1A1A1A]'
            }`}
          >
            Exercise Forge
          </button>
        </div>
      </div>

      {/* Sub-Tab 1: AI Mentor Chat */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Chat Panel (8 Cols) */}
          <div className="lg:col-span-8 bg-white border-2 border-[#1A1A1A] flex flex-col h-[650px] shadow-sm overflow-hidden">
            
            {/* Chat Messages Log */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#FAF9F5]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-8 h-8 bg-[#1A1A1A] text-[#FF6321] flex items-center justify-center shrink-0 border border-[#1A1A1A]">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-4 text-xs leading-relaxed border ${
                      msg.sender === 'user'
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                        : 'bg-white border-[#1A1A1A] text-[#222] shadow-xs'
                    }`}
                  >
                    {msg.codeSnippet && (
                      <div className="mb-2 p-2 bg-[#F0F0ED] border border-[#1A1A1A]/30 font-mono text-[11px] text-[#1A1A1A] overflow-x-auto">
                        <pre>{msg.codeSnippet}</pre>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                      {msg.text}
                    </div>

                    <div className={`text-[9px] font-mono uppercase tracking-widest mt-2 text-right ${
                      msg.sender === 'user' ? 'text-white/60' : 'text-[#888]'
                    }`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 text-xs text-[#1A1A1A] bg-white p-4 border border-[#1A1A1A] max-w-[75%] shadow-xs">
                  <Sparkles className="w-4 h-4 animate-spin text-[#FF6321]" />
                  <span className="font-medium">Academic mentor is analyzing topic and compiling guidance...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-[#1A1A1A] space-y-2">
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
                  placeholder="Ask a question about C++ syntax, pointers, memory model, STL, or debugging..."
                  rows={2}
                  className="flex-1 p-2.5 bg-[#FAF9F5] border border-[#1A1A1A] text-xs font-mono text-[#1A1A1A] placeholder-[#888] outline-none resize-none focus:bg-white"
                />

                <button
                  id="btn-send-ai-message"
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputQuestion.trim()}
                  className="p-3 bg-[#1A1A1A] hover:bg-[#FF6321] disabled:opacity-50 text-white transition-colors self-stretch flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Quick Starter Prompts & Optional Code Context (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Quick Starters */}
            <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-5 shadow-xs">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#444] mb-3 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#FF6321]" />
                <span>Foundational Inquiries</span>
              </h3>

              <div className="space-y-2">
                {[
                  'Explain pointers vs references with an intuitive memory analogy',
                  'What is the difference between stack and heap memory in C++?',
                  'Why should I prefer std::unique_ptr over raw new and delete?',
                  'What is undefined behavior in C++ and how do I prevent it?',
                  'Why does std::vector allocate memory in exponential capacity steps?',
                  'What is RAII (Resource Acquisition Is Initialization) in modern C++?',
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="w-full text-left p-2.5 bg-white hover:bg-[#F0F0ED] border border-[#1A1A1A]/30 text-xs text-[#2A2A2A] transition-colors flex items-center justify-between group"
                  >
                    <span className="line-clamp-2 leading-relaxed font-sans">{prompt}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#888] group-hover:text-[#FF6321] shrink-0 ml-1" />
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Attached Code Context Box */}
            <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-[#444] flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-[#FF6321]" />
                  <span>Attach Code Context</span>
                </h3>
                {codeContext && (
                  <button
                    onClick={() => setCodeContext('')}
                    className="text-[10px] uppercase font-bold text-[#888] hover:text-[#FF6321]"
                  >
                    Clear
                  </button>
                )}
              </div>
              <textarea
                value={codeContext}
                onChange={(e) => setCodeContext(e.target.value)}
                placeholder="// Paste C++ snippet for the mentor to review..."
                rows={6}
                className="w-full p-2.5 bg-white border border-[#1A1A1A]/40 text-xs font-mono text-[#1A1A1A] placeholder-[#999] outline-none resize-none"
              />
            </div>

          </div>

        </div>
      )}

      {/* Sub-Tab 2: Compiler Error Doctor */}
      {activeSubTab === 'errorDoctor' && (
        <div className="bg-[#F9F9F7] border-2 border-[#1A1A1A] p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A] mb-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#FF6321]" />
              <span>Compiler Error Diagnostic Clinic</span>
            </h2>
            <p className="text-xs text-[#666]">
              Paste cryptic GCC, Clang, or MSVC error logs (segmentation faults, vtable mismatches, unresolved externals) to receive structured plain-English translations and verified fixes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-[#444] uppercase tracking-widest block mb-2">
                Compiler / Runtime Error Message:
              </label>
              <textarea
                value={errorInput}
                onChange={(e) => setErrorInput(e.target.value)}
                placeholder="Paste compiler output (e.g. 'error: request for member in something not a structure' or 'Segmentation fault')..."
                rows={7}
                className="w-full p-3 bg-white border border-[#1A1A1A] font-mono text-xs text-[#C53030] placeholder-[#999] outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-[#444] uppercase tracking-widest block mb-2">
                Your C++ Code:
              </label>
              <textarea
                value={errorDoctorCode}
                onChange={(e) => setErrorDoctorCode(e.target.value)}
                placeholder="Paste the C++ source code that generated the error..."
                rows={7}
                className="w-full p-3 bg-white border border-[#1A1A1A] font-mono text-xs text-[#1A1A1A] placeholder-[#999] outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleRunErrorDoctor}
            disabled={isDiagnosing || !errorInput.trim()}
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#FF6321] disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isDiagnosing ? 'Diagnosing Error Log...' : 'Diagnose & Generate Fix'}</span>
          </button>

          {errorDiagnosis && (
            <div className="p-6 bg-white border-2 border-[#1A1A1A] animate-fade-in space-y-3 shadow-xs">
              <div className="font-serif text-sm font-bold text-[#FF6321] flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#FF6321]" />
                <span>Diagnostic Prescription & Solution:</span>
              </div>
              <div className="text-xs text-[#2A2A2A] whitespace-pre-wrap leading-relaxed">
                {errorDiagnosis}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: AI Exercise Generator */}
      {activeSubTab === 'generator' && (
        <div className="bg-[#F9F9F7] border-2 border-[#1A1A1A] p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1A1A1A] mb-1 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-[#FF6321]" />
              <span>Dynamic C++ Exercise Forge</span>
            </h2>
            <p className="text-xs text-[#666]">
              Request bespoke interactive C++ challenges on any concept complete with starter templates, test suites, and expected outputs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-[#444] uppercase tracking-widest block mb-2">
                Target Topic / Concept:
              </label>
              <input
                type="text"
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                placeholder="e.g. Recursion, Operator Overloading, Binary Search, Linked Lists..."
                className="w-full p-2.5 bg-white border border-[#1A1A1A] text-xs font-mono text-[#1A1A1A] outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-[#444] uppercase tracking-widest block mb-2">
                Difficulty Level:
              </label>
              <select
                value={genDifficulty}
                onChange={(e) => setGenDifficulty(e.target.value)}
                className="w-full p-2.5 bg-white border border-[#1A1A1A] text-xs font-mono text-[#1A1A1A] outline-none cursor-pointer"
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
            className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#FF6321] disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <Wand2 className="w-4 h-4" />
            <span>{isGenerating ? 'Forging Interactive Exercise...' : 'Forge Interactive Challenge'}</span>
          </button>

          {generatedExercise && (
            <div className="p-6 bg-white border-2 border-[#1A1A1A] animate-fade-in space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF6321]">
                  Generated Problem
                </span>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 border border-[#1A1A1A] bg-[#FAF9F5] text-[#1A1A1A]">
                  {generatedExercise.difficulty}
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                {generatedExercise.title}
              </h3>
              <p className="text-xs text-[#444] leading-relaxed">
                {generatedExercise.description}
              </p>

              <div className="p-3 bg-[#FAF9F5] border border-[#1A1A1A]/40 font-mono text-xs text-[#1A1A1A] overflow-x-auto">
                <pre>{generatedExercise.starterCode}</pre>
              </div>

              {onLoadCustomExercise && (
                <button
                  onClick={() => onLoadCustomExercise(generatedExercise)}
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#FF6321] text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Load into Interactive Workspace</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
