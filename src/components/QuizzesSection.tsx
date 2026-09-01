import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Info,
  Check
} from 'lucide-react';
import { QuizQuestion, UserProgress } from '../types';
import { C_QUIZZES } from '../data/quizzes';
import { recordQuizCompletion } from '../services/progress';

interface QuizzesSectionProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onAskAi: (question: string) => void;
}

export const QuizzesSection: React.FC<QuizzesSectionProps> = ({
  progress,
  onUpdateProgress,
  onAskAi,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  const handleSelectAnswer = (quiz: QuizQuestion, optionIndex: number) => {
    if (selectedAnswers[quiz.id] !== undefined) return; // Prevent changing after selection

    const isCorrect = optionIndex === quiz.correctAnswerIndex;
    setSelectedAnswers((prev) => ({ ...prev, [quiz.id]: optionIndex }));
    setRevealedExplanations((prev) => ({ ...prev, [quiz.id]: true }));

    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    const { progress: updated } = recordQuizCompletion(quiz.id, isCorrect, progress);
    onUpdateProgress(updated);
  };

  const handleResetQuiz = (quizId: string) => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[quizId];
      return copy;
    });
    setRevealedExplanations((prev) => {
      const copy = { ...prev };
      delete copy[quizId];
      return copy;
    });
  };

  const totalAnswered = Object.keys(selectedAnswers).length;
  const totalCorrect = Object.entries(selectedAnswers).filter(([id, ansIndex]) => {
    const q = C_QUIZZES.find((item) => item.id === id);
    return q && ansIndex === q.correctAnswerIndex;
  }).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-[#1A1A1A] text-[#FF6321] flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight">
              C++ Knowledge Checkpoint
            </h1>
          </div>
          <p className="text-xs uppercase font-bold tracking-[0.2em] text-[#888]">
            Rigorous evaluation on memory layout, pointer mechanics, references, and RAII.
          </p>
        </div>

        {/* Score Card Banner */}
        <div className="flex items-center gap-4 p-4 bg-[#F9F9F7] border border-[#1A1A1A] shrink-0 shadow-sm">
          <div className="text-right">
            <div className="text-[10px] uppercase font-black tracking-widest text-[#888]">Score & Record</div>
            <div className="text-base font-serif font-bold text-[#1A1A1A]">
              {totalCorrect} / {C_QUIZZES.length} Correct
            </div>
          </div>
          <div className="w-10 h-10 bg-[#1A1A1A] text-[#FF6321] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quiz List Cards */}
      <div className="space-y-6">
        {C_QUIZZES.map((quiz, index) => {
          const selectedAnswer = selectedAnswers[quiz.id];
          const hasAnswered = selectedAnswer !== undefined;
          const isCorrect = selectedAnswer === quiz.correctAnswerIndex;

          return (
            <div
              key={quiz.id}
              id={`quiz-card-${quiz.id}`}
              className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 sm:p-8 shadow-sm"
            >
              {/* Question metadata row */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 bg-[#1A1A1A] text-white text-xs font-mono font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF6321]">
                    {quiz.topic}
                  </span>
                </div>

                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border border-[#1A1A1A]/20 bg-white text-[#555]">
                  {quiz.difficulty}
                </span>
              </div>

              {/* Question Text */}
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A] mb-4 leading-snug">
                {quiz.question}
              </h3>

              {/* Optional Code Snippet */}
              {quiz.codeSnippet && (
                <div className="mb-4 bg-[#1A1A1A] border border-[#1A1A1A] p-4 overflow-x-auto">
                  <pre className="font-mono text-xs text-white leading-relaxed whitespace-pre">
                    {quiz.codeSnippet}
                  </pre>
                </div>
              )}

              {/* Options list */}
              <div className="space-y-2 mb-4">
                {quiz.options.map((option, optIdx) => {
                  const isThisOptionSelected = selectedAnswer === optIdx;
                  const isThisCorrect = quiz.correctAnswerIndex === optIdx;

                  let optionStyle = 'bg-white border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white';

                  if (hasAnswered) {
                    if (isThisCorrect) {
                      optionStyle = 'bg-white border-2 border-[#27C93F] text-[#1A1A1A] font-bold shadow-xs';
                    } else if (isThisOptionSelected && !isThisCorrect) {
                      optionStyle = 'bg-white border-2 border-[#FF5F56] text-[#FF5F56] font-bold';
                    } else {
                      optionStyle = 'bg-white/40 border-[#1A1A1A]/20 text-[#888] opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={hasAnswered}
                      onClick={() => handleSelectAnswer(quiz, optIdx)}
                      className={`w-full p-3.5 border text-left text-xs transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 bg-[#1A1A1A] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="font-medium">{option}</span>
                      </div>

                      {hasAnswered && (
                        <div>
                          {isThisCorrect && <CheckCircle2 className="w-4 h-4 text-[#27C93F]" />}
                          {isThisOptionSelected && !isThisCorrect && <XCircle className="w-4 h-4 text-[#FF5F56]" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Feedback Card */}
              {hasAnswered && (
                <div className={`p-5 border-2 animate-fade-in text-xs space-y-3 bg-white ${
                  isCorrect
                    ? 'border-[#27C93F]'
                    : 'border-[#FF5F56]'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-2">
                      {isCorrect ? <CheckCircle2 className="w-4 h-4 text-[#27C93F]" /> : <XCircle className="w-4 h-4 text-[#FF5F56]" />}
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isCorrect ? 'text-[#27C93F]' : 'text-[#FF5F56]'}`}>
                        {isCorrect ? 'Correct! +50 XP Awarded' : 'Incorrect Assessment'}
                      </span>
                    </span>

                    <button
                      onClick={() => handleResetQuiz(quiz.id)}
                      className="text-[10px] font-black uppercase tracking-wider text-[#888] hover:text-[#1A1A1A] flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retake</span>
                    </button>
                  </div>

                  <p className="text-[#444] leading-relaxed">
                    {quiz.explanation}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => onAskAi(`Explain in detail the concept behind this C++ question: "${quiz.question}". Why is the correct answer "${quiz.options[quiz.correctAnswerIndex]}"?`)}
                      className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[#FF6321] hover:text-[#1A1A1A] transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask AI Mentor for deep dive</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
