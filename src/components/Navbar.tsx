import React from 'react';
import { 
  Code2, 
  Terminal, 
  Layers, 
  Globe, 
  HelpCircle, 
  Bot, 
  BarChart3, 
  Flame, 
  Zap, 
  Bookmark,
  Sparkles
} from 'lucide-react';
import { TabType, UserProgress } from '../types';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  progress: UserProgress;
  onOpenAiTutor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  progress,
  onOpenAiTutor,
}) => {
  const getLevelInfo = (xp: number) => {
    if (xp < 200) return { title: 'C++ Novice', level: 1, next: 200 };
    if (xp < 500) return { title: 'Syntax Explorer', level: 2, next: 500 };
    if (xp < 1000) return { title: 'Memory Apprentice', level: 3, next: 1000 };
    if (xp < 2000) return { title: 'Pointer Adept', level: 4, next: 2000 };
    return { title: 'Modern C++ Master', level: 5, next: 5000 };
  };

  const levelInfo = getLevelInfo(progress.xp);

  const navItems = [
    { id: 'exercises' as TabType, label: 'Exercises', icon: Terminal, badge: progress.completedExerciseIds.length },
    { id: 'snippets' as TabType, label: 'Snippets', icon: Code2, badge: null },
    { id: 'visualizer' as TabType, label: 'Memory Visualizer', icon: Layers, badge: 'Interactive' },
    { id: 'resources' as TabType, label: 'Public Resources', icon: Globe, badge: progress.bookmarkedResourceIds.length > 0 ? progress.bookmarkedResourceIds.length : null },
    { id: 'quizzes' as TabType, label: 'Quizzes', icon: HelpCircle, badge: progress.completedQuizIds.length },
    { id: 'mentor' as TabType, label: 'AI Mentor', icon: Bot, badge: 'AI' },
    { id: 'progress' as TabType, label: 'My Progress', icon: BarChart3, badge: null },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFDFB]/95 backdrop-blur-md border-b border-[#1A1A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            id="brand-logo"
            onClick={() => onSelectTab('exercises')}
            className="flex items-center gap-3.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 bg-[#1A1A1A] text-white flex items-center justify-center border border-[#1A1A1A] group-hover:bg-[#FF6321] transition-colors duration-200">
              <span className="font-serif italic font-black text-xl">C++</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl text-[#1A1A1A] tracking-tight">CppZero</span>
                <span className="text-[9px] uppercase font-black tracking-[0.2em] px-1.5 py-0.5 border border-[#1A1A1A] text-[#1A1A1A] bg-[#F9F9F7]">
                  Sequence 2026
                </span>
              </div>
              <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#888] hidden sm:block">
                Interactive Foundations
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-[11px] font-black uppercase tracking-[0.18em] transition-all whitespace-nowrap border ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'border-transparent text-[#666] hover:text-[#1A1A1A] hover:border-[#1A1A1A]/20 hover:bg-[#F9F9F7]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF6321]' : 'text-[#888]'}`} />
                  <span>{item.label}</span>
                  {item.badge !== null && (
                    <span className={`text-[9px] px-1.5 py-0.2 font-mono ${
                      isActive
                        ? 'bg-[#FF6321] text-white font-bold'
                        : 'bg-[#EAEAE6] text-[#1A1A1A] border border-[#1A1A1A]/20'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Widgets (Streak, XP, AI Quick Button) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Daily Streak */}
            <div 
              id="streak-badge"
              title={`${progress.streakDays} Day Learning Streak`}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#1A1A1A] bg-white text-[#1A1A1A] text-xs font-bold"
            >
              <Flame className="w-4 h-4 text-[#FF6321] animate-pulse" />
              <span className="font-mono tracking-wider">{progress.streakDays}D</span>
            </div>

            {/* XP & Level */}
            <div 
              id="xp-badge"
              onClick={() => onSelectTab('progress')}
              title={`Level ${levelInfo.level}: ${levelInfo.title} (${progress.xp} XP)`}
              className="cursor-pointer flex items-center gap-2.5 px-3 py-1.5 border border-[#1A1A1A] bg-white hover:bg-[#F9F9F7] transition-colors"
            >
              <div className="w-5 h-5 bg-[#1A1A1A] text-[#FF6321] flex items-center justify-center">
                <Zap className="w-3 h-3 fill-[#FF6321]" />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[9px] uppercase font-black tracking-widest text-[#888] leading-none">
                  {levelInfo.title}
                </div>
                <div className="text-xs font-serif font-bold text-[#1A1A1A] leading-tight">
                  <span className="italic">{progress.xp}</span> <span className="text-[10px] font-sans font-black text-[#888]">XP</span>
                </div>
              </div>
            </div>

            {/* AI Mentor Quick Button */}
            <button
              id="quick-ai-btn"
              onClick={onOpenAiTutor}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] hover:bg-[#FF6321] text-white text-[11px] font-black tracking-[0.2em] uppercase transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6321] group-hover:text-white" />
              <span className="hidden sm:inline">Ask AI</span>
              <span className="sm:hidden">AI</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto py-2.5 border-t border-[#1A1A1A] scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-colors border ${
                  isActive
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'text-[#666] hover:text-[#1A1A1A] bg-white border-[#1A1A1A]/20'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
