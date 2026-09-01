import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Lightbulb, 
  Eye, 
  Sparkles, 
  RotateCcw, 
  FileText, 
  Terminal as TerminalIcon, 
  ArrowRight, 
  ChevronRight,
  ChevronDown,
  Award,
  AlertTriangle,
  Send,
  BookOpen,
  Filter,
  Check
} from 'lucide-react';
import { Exercise, CompilationResult, UserProgress } from '../types';
import { C_EXERCISES } from '../data/exercises';
import { CodeEditor } from './CodeEditor';
import { executeCppCode, runExerciseTestCases, normalizeOutput } from '../services/compiler';
import { markExerciseCompleted, saveUserProgress } from '../services/progress';
import { explainCompilerError } from '../services/ai';

interface ExerciseWorkspaceProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onAskAi: (prompt: string, code: string) => void;
  initialExerciseId?: string;
}

export const ExerciseWorkspace: React.FC<ExerciseWorkspaceProps> = ({
  progress,
  onUpdateProgress,
  onAskAi,
  initialExerciseId,
}) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(
    initialExerciseId || C_EXERCISES[0].id
  );
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [code, setCode] = useState<string>('');
  const [stdin, setStdin] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [compilationResult, setCompilationResult] = useState<CompilationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'instructions' | 'testcases' | 'hints' | 'notes'>('instructions');
  const [unlockedHints, setUnlockedHints] = useState<number[]>([]);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>('');
  const [explainingError, setExplainingError] = useState<boolean>(false);
  const [aiErrorExplanation, setAiErrorExplanation] = useState<string | null>(null);
  const [congratsModal, setCongratsModal] = useState<{ show: boolean; xp: number; isFirstTime: boolean } | null>(null);

  const currentExercise = C_EXERCISES.find((e) => e.id === selectedExerciseId) || C_EXERCISES[0];

  // Sync state when exercise changes
  useEffect(() => {
    const saved = progress.savedCodePerExercise[currentExercise.id];
    setCode(saved || currentExercise.starterCode);
    setStdin(currentExercise.defaultStdin || '');
    setCompilationResult(null);
    setUnlockedHints([]);
    setShowSolution(false);
    setAiErrorExplanation(null);
    setNoteText(progress.personalNotes[currentExercise.id] || '');
  }, [currentExercise.id]);

  const categories = ['All', ...Array.from(new Set(C_EXERCISES.map((e) => e.category)))];

  const filteredExercises = C_EXERCISES.filter(
    (e) => categoryFilter === 'All' || e.category === categoryFilter
  );

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    const updatedSaved = {
      ...progress.savedCodePerExercise,
      [currentExercise.id]: newCode,
    };
    const updated = {
      ...progress,
      savedCodePerExercise: updatedSaved,
    };
    onUpdateProgress(updated);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to starter template? Your unsaved edits will be discarded.')) {
      setCode(currentExercise.starterCode);
      const updatedSaved = {
        ...progress.savedCodePerExercise,
        [currentExercise.id]: currentExercise.starterCode,
      };
      onUpdateProgress({ ...progress, savedCodePerExercise: updatedSaved });
    }
  };

  const handleRunSingle = async () => {
    setIsRunning(true);
    setAiErrorExplanation(null);
    try {
      const res = await executeCppCode(code, stdin);
      setCompilationResult(res);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunAllTests = async () => {
    setIsRunning(true);
    setAiErrorExplanation(null);
    try {
      const res = await runExerciseTestCases(code, currentExercise.testCases);
      setCompilationResult(res);

      if (res.passedAllTests) {
        // Trigger celebration confetti!
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        const { progress: updatedProgress, awardedXp, isFirstTime } = markExerciseCompleted(
          currentExercise.id,
          progress
        );
        onUpdateProgress(updatedProgress);
        setCongratsModal({ show: true, xp: awardedXp, isFirstTime });
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveNote = () => {
    const updatedNotes = {
      ...progress.personalNotes,
      [currentExercise.id]: noteText,
    };
    const updated = {
      ...progress,
      personalNotes: updatedNotes,
    };
    onUpdateProgress(updated);
  };

  const handleExplainError = async () => {
    if (!compilationResult?.stderr) return;
    setExplainingError(true);
    try {
      const explanation = await explainCompilerError({
        errorText: compilationResult.stderr,
        code: code,
      });
      setAiErrorExplanation(explanation);
    } catch (e) {
      console.error(e);
    } finally {
      setExplainingError(false);
    }
  };

  const handleNextExercise = () => {
    const currentIndex = C_EXERCISES.findIndex((e) => e.id === currentExercise.id);
    if (currentIndex < C_EXERCISES.length - 1) {
      setSelectedExerciseId(C_EXERCISES[currentIndex + 1].id);
      setCongratsModal(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Exercise Selection Carousel / Filter Bar */}
      <div className="mb-8 bg-[#F9F9F7] border border-[#1A1A1A] p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1A1A1A] text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#FF6321]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-[#1A1A1A]">Curriculum Sequence</h2>
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#888]">
                {progress.completedExerciseIds.length} of {C_EXERCISES.length} Modules Completed
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-colors border ${
                  categoryFilter === cat
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white text-[#666] border-[#1A1A1A]/30 hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises Grid / List Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 max-h-44 overflow-y-auto pr-1">
          {filteredExercises.map((ex) => {
            const isCompleted = progress.completedExerciseIds.includes(ex.id);
            const isSelected = ex.id === currentExercise.id;
            return (
              <button
                key={ex.id}
                id={`exercise-card-${ex.id}`}
                onClick={() => setSelectedExerciseId(ex.id)}
                className={`flex items-center justify-between p-3 border text-left transition-all ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md'
                    : isCompleted
                    ? 'bg-white border-[#1A1A1A]/40 text-[#1A1A1A] hover:border-[#1A1A1A]'
                    : 'bg-white border-[#1A1A1A]/20 text-[#555] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#1A1A1A]'}`}>
                    {ex.title}
                  </div>
                  <div className={`text-[9px] uppercase tracking-wider font-bold mt-0.5 ${isSelected ? 'text-[#FF6321]' : 'text-[#888]'}`}>
                    {ex.difficulty} • {ex.category}
                  </div>
                </div>

                {isCompleted ? (
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#27C93F]' : 'text-[#27C93F]'}`} />
                ) : (
                  <div className={`w-3.5 h-3.5 border shrink-0 ${isSelected ? 'border-white/40' : 'border-[#1A1A1A]/30'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Coding Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Problem Briefing, Instructions, Test Cases, Hints (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Card: Exercise Header & Info */}
          <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 sm:p-8 shadow-sm relative overflow-hidden">
            {/* Background Big Number */}
            <div className="absolute top-4 right-6 text-8xl font-serif font-black text-black/[0.04] leading-none select-none pointer-events-none">
              01
            </div>

            <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#FF6321]">
                Module: {currentExercise.category}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-[#1A1A1A] bg-white text-[#1A1A1A]">
                {currentExercise.difficulty}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight mb-3 relative z-10">
              {currentExercise.title}
            </h1>
            <p className="text-sm text-[#444] font-medium leading-relaxed mb-6 relative z-10">
              {currentExercise.shortDescription}
            </p>

            {/* Navigation Tabs on Left Pane */}
            <div className="flex items-center gap-2 border-b border-[#1A1A1A] pt-2 relative z-10">
              {[
                { id: 'instructions', label: 'Instructions', icon: FileText },
                { id: 'testcases', label: `Tests (${currentExercise.testCases.length})`, icon: TerminalIcon },
                { id: 'hints', label: `Hints (${currentExercise.hints.length})`, icon: Lightbulb },
                { id: 'notes', label: 'My Notes', icon: BookOpen },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-wider border-b-2 transition-colors ${
                      active
                        ? 'border-[#FF6321] text-[#1A1A1A] bg-white/50'
                        : 'border-transparent text-[#888] hover:text-[#1A1A1A]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#FF6321]' : 'text-[#888]'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="mt-6 text-sm relative z-10">
              
              {/* Instructions Tab */}
              {activeTab === 'instructions' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888] mb-3">
                      Tasks to Complete:
                    </h3>
                    <ul className="space-y-3">
                      {currentExercise.instructions.map((inst, i) => (
                        <li key={i} className="flex items-start gap-3 text-xs text-[#2A2A2A] leading-relaxed">
                          <span className="w-5 h-5 bg-[#1A1A1A] text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-[#1A1A1A]/10">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#888] mb-3">
                      Core C++ Concepts:
                    </h3>
                    <ul className="space-y-2">
                      {currentExercise.learningPoints.map((lp, i) => (
                        <li key={i} className="text-xs text-[#555] flex items-start gap-2">
                          <span className="text-[#FF6321] font-bold font-mono">/</span>
                          <span>{lp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Test Cases Tab */}
              {activeTab === 'testcases' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#666]">
                    Your code will be evaluated against the following test inputs:
                  </p>
                  {currentExercise.testCases.map((tc, idx) => {
                    const testResult = compilationResult?.testResults?.find((r) => r.testCaseId === tc.id);
                    return (
                      <div 
                        key={tc.id}
                        className={`p-3.5 border font-mono text-xs ${
                          testResult
                            ? testResult.passed
                              ? 'bg-white border-[#27C93F]'
                              : 'bg-white border-[#FF5F56]'
                            : 'bg-white border-[#1A1A1A]/20'
                        }`}
                      >
                        <div className="flex items-center justify-between font-sans mb-2">
                          <span className="font-bold text-xs text-[#1A1A1A]">
                            Test Case #{idx + 1} {tc.description && `(${tc.description})`}
                          </span>
                          {testResult && (
                            <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 text-white ${
                              testResult.passed
                                ? 'bg-[#27C93F]'
                                : 'bg-[#FF5F56]'
                            }`}>
                              {testResult.passed ? 'PASSED' : 'FAILED'}
                            </span>
                          )}
                        </div>

                        {tc.input && (
                          <div className="mb-1 text-[#666]">
                            <span className="font-bold text-[#888]">Input: </span>
                            <span className="text-[#1A1A1A] font-semibold">{tc.input}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[#888] font-bold">Expected Output: </span>
                          <pre className="text-[#1A1A1A] font-semibold whitespace-pre-wrap mt-1 bg-[#F9F9F7] p-2 border border-[#1A1A1A]/10">
                            {tc.expectedOutput}
                          </pre>
                        </div>

                        {testResult && !testResult.passed && (
                          <div className="mt-2 pt-2 border-t border-[#FF5F56]/20">
                            <span className="text-[#FF5F56] font-sans font-bold">Your Output: </span>
                            <pre className="text-[#FF5F56] whitespace-pre-wrap mt-1 bg-[#FDF0EE] p-2 border border-[#FF5F56]/30">
                              {testResult.actualOutput || '(empty output)'}
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Hints Tab */}
              {activeTab === 'hints' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#666]">
                    Stuck? Reveal progressive hints one by one without spoiling the solution.
                  </p>
                  {currentExercise.hints.map((hint, idx) => {
                    const isUnlocked = unlockedHints.includes(idx);
                    return (
                      <div key={idx} className="border border-[#1A1A1A] overflow-hidden bg-white">
                        {isUnlocked ? (
                          <div className="p-4 bg-white text-xs text-[#2A2A2A] leading-relaxed">
                            <div className="font-black text-[10px] uppercase tracking-widest text-[#FF6321] mb-1.5 flex items-center gap-1.5">
                              <Lightbulb className="w-3.5 h-3.5 text-[#FF6321]" />
                              Hint #{idx + 1}
                            </div>
                            {hint}
                          </div>
                        ) : (
                          <button
                            onClick={() => setUnlockedHints([...unlockedHints, idx])}
                            className="w-full p-3.5 bg-white hover:bg-[#F9F9F7] text-left text-xs font-bold text-[#1A1A1A] flex items-center justify-between transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-[#FF6321]" />
                              Reveal Hint #{idx + 1}
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#888]" />
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {/* Reveal Solution Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showSolution ? 'Hide Reference Solution' : 'Reveal Reference Solution'}</span>
                    </button>
                  </div>

                  {showSolution && (
                    <div className="p-5 bg-white border-2 border-[#1A1A1A]">
                      <div className="text-[10px] font-black uppercase tracking-widest text-[#FF6321] mb-2">
                        Reference Solution & Explanation:
                      </div>
                      <p className="text-xs text-[#444] mb-3 leading-relaxed">
                        {currentExercise.explanation}
                      </p>
                      <pre className="p-4 bg-[#1A1A1A] font-mono text-xs text-white overflow-x-auto whitespace-pre border border-[#1A1A1A]">
                        {currentExercise.solutionCode}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Personal Notes Tab */}
              {activeTab === 'notes' && (
                <div className="space-y-3">
                  <p className="text-xs text-[#666]">
                    Save personal takeaways, C++ syntax gotchas, or notes for this exercise.
                  </p>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write your notes here (e.g. Remember that std::endl flushes buffer, while \n is faster)..."
                    className="w-full h-36 p-3 bg-white border border-[#1A1A1A] text-xs text-[#1A1A1A] font-mono outline-none focus:border-[#FF6321] resize-none"
                  />
                  <button
                    onClick={handleSaveNote}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] hover:bg-[#FF6321] text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* AI Mentor Quick Prompt Box */}
          <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6321]" />
                <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]">AI C++ Mentor</span>
              </div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#888]">Gemini 3.7</span>
            </div>
            <p className="text-xs text-[#666] mb-4">
              Need personalized guidance or instant code review on this module?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => onAskAi(`I need a conceptual explanation of: ${currentExercise.title}. How does C++ handle this?`, code)}
                className="text-left p-3 bg-white hover:bg-[#1A1A1A] hover:text-white text-xs font-bold text-[#1A1A1A] border border-[#1A1A1A] transition-colors"
              >
                💡 Explain Concept
              </button>
              <button
                onClick={() => onAskAi(`Review my current code for ${currentExercise.title} and give me hints on how to improve it without giving away the full solution.`, code)}
                className="text-left p-3 bg-white hover:bg-[#1A1A1A] hover:text-white text-xs font-bold text-[#1A1A1A] border border-[#1A1A1A] transition-colors"
              >
                🔍 Review My Code
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Code Editor & Execution Terminal (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Top Editor Container */}
          <div className="flex flex-col gap-3">
            <CodeEditor
              code={code}
              onChange={handleCodeChange}
              onRun={handleRunSingle}
              onReset={handleResetCode}
              minHeight="380px"
            />

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#F9F9F7] border border-[#1A1A1A] p-4">
              
              {/* Custom Stdin toggle / Input */}
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#666] shrink-0">Stdin:</span>
                <input
                  type="text"
                  value={stdin}
                  onChange={(e) => setStdin(e.target.value)}
                  placeholder="Input stream (e.g. 10 20)..."
                  className="flex-1 px-3 py-2 bg-white border border-[#1A1A1A] text-xs font-mono text-[#1A1A1A] outline-none focus:border-[#FF6321]"
                />
              </div>

              {/* Main Execution Controls */}
              <div className="flex items-center gap-3 shrink-0">
                
                {/* Run Single */}
                <button
                  id="btn-run-code"
                  onClick={handleRunSingle}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-[#1A1A1A] hover:text-white disabled:opacity-50 text-[#1A1A1A] text-[11px] font-black uppercase tracking-[0.2em] border border-[#1A1A1A] transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>

                {/* Submit / Test All */}
                <button
                  id="btn-submit-exercise"
                  onClick={handleRunAllTests}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#FF6321] disabled:opacity-50 text-white text-[11px] font-black uppercase tracking-[0.2em] transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isRunning ? 'Testing...' : 'Submit & Test'}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Bottom Terminal / Output Console */}
          <div className="bg-[#1A1A1A] border border-[#1A1A1A] overflow-hidden font-mono shadow-lg text-white">
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-white/10 text-xs">
              <div className="flex items-center gap-2.5">
                <TerminalIcon className="w-4 h-4 text-white/60" />
                <span className="font-bold text-white text-[11px] uppercase tracking-widest font-mono">Execution Console</span>
                {compilationResult && (
                  <span className={`text-[9px] px-2 py-0.5 font-mono uppercase font-black ${
                    compilationResult.code === 0 && (!compilationResult.testResults || compilationResult.passedAllTests)
                      ? 'bg-[#27C93F]/20 text-[#27C93F] border border-[#27C93F]/40'
                      : 'bg-[#FF5F56]/20 text-[#FF5F56] border border-[#FF5F56]/40'
                  }`}>
                    {compilationResult.code === 0 ? 'EXIT 0: SUCCESS' : `EXIT ${compilationResult.code}: ERROR`}
                  </span>
                )}
              </div>

              {/* Explain Error with AI button if error exists */}
              {compilationResult?.stderr && (
                <button
                  onClick={handleExplainError}
                  disabled={explainingError}
                  className="flex items-center gap-1.5 px-3 py-1 bg-[#FF5F56] hover:bg-[#FF6321] text-white text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{explainingError ? 'Diagnosing...' : 'Explain Error AI'}</span>
                </button>
              )}
            </div>

            {/* AI Error Explanation Box */}
            {aiErrorExplanation && (
              <div className="p-4 bg-[#231A14] border-b border-[#FF6321]/40 text-xs font-sans">
                <div className="flex items-center gap-2 text-[#FF6321] font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Compiler Diagnostic & Fix:</span>
                </div>
                <div className="text-white/90 whitespace-pre-wrap leading-relaxed">
                  {aiErrorExplanation}
                </div>
              </div>
            )}

            {/* Terminal Body */}
            <div className="p-4 min-h-[160px] max-h-[280px] overflow-y-auto text-xs space-y-2">
              {isRunning ? (
                <div className="flex items-center gap-2 text-[#FF6321] font-mono">
                  <div className="w-2 h-2 bg-[#FF6321] animate-ping" />
                  <span>Compiling C++ code with GCC / C++20...</span>
                </div>
              ) : compilationResult ? (
                <>
                  {/* Stderr if present */}
                  {compilationResult.stderr && (
                    <div className="text-[#FF5F56] bg-black/40 p-3 border border-[#FF5F56]/40 whitespace-pre-wrap">
                      <div className="font-bold text-[#FF5F56] mb-1 flex items-center gap-1 font-mono uppercase tracking-wider text-[10px]">
                        <AlertTriangle className="w-3.5 h-3.5" /> Compiler Diagnostic Output:
                      </div>
                      {compilationResult.stderr}
                    </div>
                  )}

                  {/* Stdout */}
                  {compilationResult.stdout ? (
                    <div>
                      <div className="text-white/40 text-[9px] uppercase tracking-widest mb-1 font-mono font-bold">
                        Program Standard Output:
                      </div>
                      <pre className="text-[#27C93F] whitespace-pre-wrap leading-relaxed">
                        {compilationResult.stdout}
                      </pre>
                    </div>
                  ) : !compilationResult.stderr ? (
                    <div className="text-white/40 italic">
                      Program finished with no output.
                    </div>
                  ) : null}

                  {/* Summary of test results if tested all */}
                  {compilationResult.testResults && (
                    <div className="mt-3 pt-3 border-t border-white/10 font-mono">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white/60 uppercase tracking-widest text-[10px]">Test Suite Summary:</span>
                        <span className={`font-bold ${
                          compilationResult.passedAllTests ? 'text-[#27C93F]' : 'text-[#FFBD2E]'
                        }`}>
                          {compilationResult.testResults.filter(t => t.passed).length} / {compilationResult.testResults.length} Tests Passed
                        </span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-white/40 text-xs font-mono leading-relaxed">
                  Click <span className="text-white font-bold">Run Code</span> to test single execution or <span className="text-[#FF6321] font-bold">Submit & Test</span> to validate against all test cases.
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Celebration Modal on Exercise Passed */}
      {congratsModal?.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FDFDFB] border-2 border-[#1A1A1A] p-8 max-w-md w-full text-center shadow-2xl relative text-[#1A1A1A]">
            <div className="w-14 h-14 bg-[#1A1A1A] text-[#FF6321] mx-auto flex items-center justify-center mb-4">
              <Award className="w-7 h-7" />
            </div>

            <h3 className="text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight mb-2">
              Exercise Solved!
            </h3>
            <p className="text-sm text-[#555] mb-6 leading-relaxed">
              All test cases passed successfully for <span className="font-bold text-[#1A1A1A]">{currentExercise.title}</span>.
            </p>

            <div className="p-4 bg-[#F9F9F7] border border-[#1A1A1A] mb-6">
              <span className="text-xs font-serif italic font-bold text-[#FF6321] text-base block">
                +{congratsModal.xp} XP Awarded
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest text-[#888]">
                {congratsModal.isFirstTime ? 'Mastery Checkpoint Achieved' : 'Practice Solution Verified'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCongratsModal(null)}
                className="flex-1 py-3 px-4 bg-white hover:bg-[#F9F9F7] text-[#1A1A1A] border border-[#1A1A1A] text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Review Code
              </button>
              <button
                onClick={handleNextExercise}
                className="flex-1 py-3 px-4 bg-[#1A1A1A] hover:bg-[#FF6321] text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Next Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
