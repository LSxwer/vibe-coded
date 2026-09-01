import React, { useState } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { askAiMentor } from '../services/ai';

interface AiMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiMentorModal: React.FC<AiMentorModalProps> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async () => {
    if (!question.trim() || isLoading) return;
    setIsLoading(true);
    try {
      const ans = await askAiMentor({ question });
      setAnswer(ans);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#FDFDFB] border-2 border-[#1A1A1A] p-6 max-w-lg w-full shadow-2xl relative flex flex-col max-h-[85vh] text-[#1A1A1A]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A1A1A] text-[#FF6321] flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#1A1A1A]">AI C++ Academic Mentor</h3>
              <p className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#888]">Powered by Gemini 2.5</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#888] hover:text-[#1A1A1A] hover:bg-[#F0F0ED] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 flex-1 overflow-y-auto space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#666]">
              Query or Diagnostic Topic
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                placeholder="e.g. Why do we need virtual destructors?"
                className="flex-1 px-3.5 py-2.5 bg-white border border-[#1A1A1A] text-xs font-mono text-[#1A1A1A] outline-none placeholder-[#999]"
              />
              <button
                onClick={handleAsk}
                disabled={isLoading || !question.trim()}
                className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#FF6321] disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors shrink-0"
              >
                {isLoading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Consult</span>
              </button>
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[
              'Explain pointers in 2 sentences',
              'Difference between struct and class',
              'What is RAII in C++?',
              'Why std::cout << endl vs \\n?',
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => setQuestion(p)}
                className="px-2.5 py-1 bg-white hover:bg-[#F0F0ED] border border-[#1A1A1A]/30 text-[10px] font-mono text-[#555] hover:text-[#1A1A1A] transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Answer Box */}
          {answer && (
            <div className="p-5 bg-white border-2 border-[#1A1A1A] text-xs text-[#2A2A2A] leading-relaxed whitespace-pre-wrap shadow-sm">
              <div className="font-serif font-bold text-sm text-[#FF6321] mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6321]" />
                <span>Mentor Synthesis:</span>
              </div>
              {answer}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
