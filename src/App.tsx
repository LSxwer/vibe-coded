/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ExerciseWorkspace } from './components/ExerciseWorkspace';
import { SnippetsLibrary } from './components/SnippetsLibrary';
import { MemoryVisualizer } from './components/MemoryVisualizer';
import { PublicResources } from './components/PublicResources';
import { QuizzesSection } from './components/QuizzesSection';
import { AiMentorView } from './components/AiMentorView';
import { ProgressDashboard } from './components/ProgressDashboard';
import { AiMentorModal } from './components/AiMentorModal';
import { TabType, UserProgress, Exercise } from './types';
import { loadUserProgress, saveUserProgress, updateStreakAndActivity } from './services/progress';
import { C_EXERCISES } from './data/exercises';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('exercises');
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress());
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');
  const [aiInitialCode, setAiInitialCode] = useState<string>('');
  const [activeExerciseId, setActiveExerciseId] = useState<string>(C_EXERCISES[0].id);

  // Initialize streak on load
  useEffect(() => {
    const updated = updateStreakAndActivity(progress);
    setProgress(updated);
  }, []);

  const handleUpdateProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    saveUserProgress(newProgress);
  };

  const handleAskAi = (prompt: string, code: string = '') => {
    setAiInitialPrompt(prompt);
    setAiInitialCode(code);
    setCurrentTab('mentor');
  };

  const handleRunSnippetInPlayground = (code: string) => {
    // Inject snippet code into first exercise or active exercise and jump to workspace
    const updatedSaved = {
      ...progress.savedCodePerExercise,
      [activeExerciseId]: code,
    };
    const updated = {
      ...progress,
      savedCodePerExercise: updatedSaved,
    };
    handleUpdateProgress(updated);
    setCurrentTab('exercises');
  };

  const handleLoadCustomExercise = (exercise: Exercise) => {
    // Add custom exercise to saved code and jump to workspace
    const updatedSaved = {
      ...progress.savedCodePerExercise,
      [exercise.id]: exercise.starterCode,
    };
    const updated = {
      ...progress,
      savedCodePerExercise: updatedSaved,
    };
    handleUpdateProgress(updated);
    setActiveExerciseId(exercise.id);
    setCurrentTab('exercises');
  };

  return (
    <div className="min-h-screen bg-[#FDFDFB] text-[#1A1A1A] flex flex-col font-sans selection:bg-[#FF6321] selection:text-white">
      {/* Top Main Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        progress={progress}
        onOpenAiTutor={() => setIsAiModalOpen(true)}
      />

      {/* Main App Content Views */}
      <main className="flex-1 bg-[#FDFDFB]">
        {currentTab === 'exercises' && (
          <ExerciseWorkspace
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onAskAi={handleAskAi}
            initialExerciseId={activeExerciseId}
          />
        )}

        {currentTab === 'snippets' && (
          <SnippetsLibrary
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onRunSnippetInPlayground={handleRunSnippetInPlayground}
          />
        )}

        {currentTab === 'visualizer' && <MemoryVisualizer />}

        {currentTab === 'resources' && (
          <PublicResources
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
          />
        )}

        {currentTab === 'quizzes' && (
          <QuizzesSection
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onAskAi={(q) => handleAskAi(q)}
          />
        )}

        {currentTab === 'mentor' && (
          <AiMentorView
            initialPrompt={aiInitialPrompt}
            initialCode={aiInitialCode}
            onLoadCustomExercise={handleLoadCustomExercise}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressDashboard
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onSelectTab={setCurrentTab}
          />
        )}
      </main>

      {/* Global Quick AI Mentor Modal */}
      <AiMentorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Editorial Footer */}
      <footer className="mt-16 border-t border-[#1A1A1A] bg-[#F9F9F7] py-8 text-xs text-[#666]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold text-[#1A1A1A]">CppZero</span>
            <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#888]">
              Interactive C++ Learning Platform — 2026 Edition
            </span>
          </div>
          <div className="flex items-center gap-6 text-[11px] font-bold tracking-wider uppercase text-[#444]">
            <button onClick={() => setCurrentTab('exercises')} className="hover:text-[#FF6321] transition-colors">Exercises</button>
            <button onClick={() => setCurrentTab('snippets')} className="hover:text-[#FF6321] transition-colors">Snippets</button>
            <button onClick={() => setCurrentTab('visualizer')} className="hover:text-[#FF6321] transition-colors">Memory</button>
            <button onClick={() => setCurrentTab('resources')} className="hover:text-[#FF6321] transition-colors">Resources</button>
            <button onClick={() => setCurrentTab('progress')} className="hover:text-[#FF6321] transition-colors">Progress</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
