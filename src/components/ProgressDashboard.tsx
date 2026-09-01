import React from 'react';
import { 
  BarChart3, 
  Flame, 
  Zap, 
  Award, 
  CheckCircle2, 
  BookOpen, 
  Bookmark, 
  Code2, 
  Calendar, 
  Trash2, 
  Download, 
  ArrowRight,
  Sparkles,
  Trophy
} from 'lucide-react';
import { UserProgress, TabType } from '../types';
import { C_EXERCISES } from '../data/exercises';
import { C_PUBLIC_RESOURCES } from '../data/resources';
import { C_SNIPPETS } from '../data/snippets';
import { INITIAL_PROGRESS, saveUserProgress } from '../services/progress';

interface ProgressDashboardProps {
  progress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onSelectTab: (tab: TabType) => void;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onUpdateProgress,
  onSelectTab,
}) => {
  const getLevelInfo = (xp: number) => {
    if (xp < 200) {
      return { title: 'C++ Novice', level: 1, min: 0, next: 200, icon: '🌱' };
    } else if (xp < 500) {
      return { title: 'Syntax Explorer', level: 2, min: 200, next: 500, icon: '⚡' };
    } else if (xp < 1000) {
      return { title: 'Memory Apprentice', level: 3, min: 500, next: 1000, icon: '🧠' };
    } else if (xp < 2000) {
      return { title: 'Pointer Adept', level: 4, min: 1000, next: 2000, icon: '🏹' };
    } else {
      return { title: 'Modern C++ Master', level: 5, min: 2000, next: 5000, icon: '👑' };
    }
  };

  const levelInfo = getLevelInfo(progress.xp);
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round(((progress.xp - levelInfo.min) / (levelInfo.next - levelInfo.min)) * 100))
  );

  // Group exercises by category for Mastery Breakdown
  const categories = Array.from(new Set(C_EXERCISES.map((e) => e.category)));
  const categoryStats = categories.map((cat) => {
    const totalInCat = C_EXERCISES.filter((e) => e.category === cat);
    const completedInCat = totalInCat.filter((e) => progress.completedExerciseIds.includes(e.id));
    return {
      name: cat,
      total: totalInCat.length,
      completed: completedInCat.length,
      percentage: Math.round((completedInCat.length / totalInCat.length) * 100),
    };
  });

  const handleResetAllData = () => {
    if (window.confirm('Are you sure you want to reset all your C++ learning progress? This will clear solved exercises, notes, and XP.')) {
      onUpdateProgress(INITIAL_PROGRESS);
      saveUserProgress(INITIAL_PROGRESS);
    }
  };

  const handleExportData = () => {
    const jsonStr = JSON.stringify(progress, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cppzero_progress_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner: Rank & Level Card */}
      <div className="bg-[#F9F9F7] border-2 border-[#1A1A1A] p-8 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar & Rank */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1A1A1A] text-white flex items-center justify-center text-3xl shrink-0 shadow-md">
              <span>{levelInfo.icon}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase font-black tracking-[0.2em] px-2.5 py-0.5 border border-[#1A1A1A] bg-white text-[#FF6321]">
                  Level {levelInfo.level}
                </span>
                <span className="text-xs text-[#888] font-mono font-bold">
                  {progress.xp} Total XP
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight">
                {levelInfo.title}
              </h1>
              <p className="text-xs text-[#666] mt-1 font-medium">
                Keep solving exercises and mastering C++ memory to advance to the next rank tier.
              </p>
            </div>
          </div>

          {/* XP Progress Bar Widget */}
          <div className="w-full lg:w-80 bg-white border border-[#1A1A1A] p-5 shrink-0 shadow-sm">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#888]">Tier Progress</span>
              <span className="text-[#FF6321] font-mono font-bold text-xs">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#F0F0ED] border border-[#1A1A1A]/20 overflow-hidden mb-2">
              <div
                className="h-full bg-[#1A1A1A] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-[#888] font-mono font-bold">
              <span>{progress.xp} XP</span>
              <span>{levelInfo.next} XP</span>
            </div>
          </div>

        </div>
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Streak */}
        <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Learning Streak</span>
            <Flame className="w-4 h-4 text-[#FF6321]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#1A1A1A]">
            {progress.streakDays} <span className="text-xs font-sans uppercase font-bold text-[#888]">Days</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-[#888] mt-1 font-bold">Active today</p>
        </div>

        {/* Exercises Completed */}
        <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exercises Solved</span>
            <CheckCircle2 className="w-4 h-4 text-[#27C93F]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#1A1A1A]">
            {progress.completedExerciseIds.length} <span className="text-xs font-sans uppercase font-bold text-[#888]">/ {C_EXERCISES.length}</span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-[#888] mt-1 font-bold">
            {Math.round((progress.completedExerciseIds.length / C_EXERCISES.length) * 100)}% Modules finished
          </p>
        </div>

        {/* Quizzes Mastered */}
        <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quizzes Passed</span>
            <Award className="w-4 h-4 text-[#FF6321]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#1A1A1A]">
            {progress.completedQuizIds.length}
          </div>
          <p className="text-[10px] uppercase tracking-wider text-[#888] mt-1 font-bold">Knowledge checkpoints</p>
        </div>

        {/* Saved Items */}
        <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 shadow-sm">
          <div className="flex items-center justify-between text-[#888] mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Saved Items</span>
            <Bookmark className="w-4 h-4 text-[#1A1A1A]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#1A1A1A]">
            {progress.bookmarkedResourceIds.length + progress.bookmarkedSnippetIds.length}
          </div>
          <p className="text-[10px] uppercase tracking-wider text-[#888] mt-1 font-bold">Resources & snippets</p>
        </div>

      </div>

      {/* Curriculum Topic Mastery Grid */}
      <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#1A1A1A] tracking-tight">C++ Topic Mastery Breakdown</h2>
            <p className="text-xs text-[#666] mt-0.5">Track your progress across fundamental computer science and C++ topics.</p>
          </div>
          <button
            onClick={() => onSelectTab('exercises')}
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#FF6321] transition-colors"
          >
            <span>Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryStats.map((cat) => (
            <div
              key={cat.name}
              className="p-5 bg-white border border-[#1A1A1A] space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-[#1A1A1A]">{cat.name}</span>
                <span className="text-xs font-mono font-bold text-[#FF6321]">
                  {cat.completed}/{cat.total} ({cat.percentage}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#F0F0ED] border border-[#1A1A1A]/20 overflow-hidden">
                <div
                  className="h-full bg-[#1A1A1A] transition-all duration-300"
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Notes & Study Organizer */}
      <div className="bg-[#F9F9F7] border border-[#1A1A1A] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2.5 mb-5">
          <BookOpen className="w-5 h-5 text-[#FF6321]" />
          <h2 className="font-serif font-bold text-xl text-[#1A1A1A] tracking-tight">My Saved C++ Notes</h2>
        </div>

        {Object.keys(progress.personalNotes).length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#1A1A1A] text-[#888] text-xs">
            You haven't added notes to any exercises yet. Open any exercise and click the "My Notes" tab to record key takeaways!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(progress.personalNotes).map(([exId, note]) => {
              const ex = C_EXERCISES.find((e) => e.id === exId);
              const noteText = String(note || '');
              if (!noteText.trim()) return null;
              return (
                <div key={exId} className="p-5 bg-white border border-[#1A1A1A] space-y-2">
                  <div className="text-xs font-serif font-bold text-[#FF6321]">
                    {ex ? ex.title : exId}
                  </div>
                  <p className="text-xs text-[#444] whitespace-pre-wrap leading-relaxed">
                    {noteText}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Data Management (Backup / Reset) */}
      <div className="p-6 bg-white border border-[#1A1A1A] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="font-serif font-bold text-base text-[#1A1A1A]">Data & Local Workspace</h3>
          <p className="text-xs text-[#666]">
            Export your learning progress to a JSON archive or reset your practice workspace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#F9F9F7] text-[#1A1A1A] border border-[#1A1A1A] text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Progress JSON</span>
          </button>

          <button
            onClick={handleResetAllData}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#FF5F56] hover:text-white border border-[#FF5F56] text-[#FF5F56] text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>
      </div>

    </div>
  );
};
