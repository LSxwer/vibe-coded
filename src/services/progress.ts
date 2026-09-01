import { UserProgress } from '../types';

const STORAGE_KEY = 'cppzero_user_progress_v1';

export const INITIAL_PROGRESS: UserProgress = {
  completedExerciseIds: [],
  solvedTestCases: {},
  savedCodePerExercise: {},
  bookmarkedResourceIds: ['res-learncpp', 'res-cppreference', 'res-cherno-youtube'],
  bookmarkedSnippetIds: ['snip-fast-io', 'snip-pointers-memory'],
  completedQuizIds: [],
  quizScores: {},
  xp: 50, // Starting bonus XP
  streakDays: 1,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  activityHistory: {
    [new Date().toISOString().slice(0, 10)]: 1,
  },
  personalNotes: {},
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_PROGRESS,
      ...parsed,
    };
  } catch (e) {
    console.error('Failed to load progress from localStorage:', e);
    return INITIAL_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress to localStorage:', e);
  }
}

export function updateStreakAndActivity(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().slice(0, 10);
  const lastActive = progress.lastActiveDate;

  const updatedHistory = { ...progress.activityHistory };
  updatedHistory[today] = (updatedHistory[today] || 0) + 1;

  let newStreak = progress.streakDays;

  if (lastActive !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (lastActive === yesterdayStr) {
      newStreak += 1;
    } else if (lastActive < yesterdayStr) {
      newStreak = 1;
    }
  }

  const updated = {
    ...progress,
    lastActiveDate: today,
    streakDays: Math.max(1, newStreak),
    activityHistory: updatedHistory,
  };
  saveUserProgress(updated);
  return updated;
}

export function markExerciseCompleted(
  exerciseId: string,
  progress: UserProgress
): { progress: UserProgress; awardedXp: number; isFirstTime: boolean } {
  const isFirstTime = !progress.completedExerciseIds.includes(exerciseId);
  const awardedXp = isFirstTime ? 100 : 20;

  const updatedCompleted = isFirstTime
    ? [...progress.completedExerciseIds, exerciseId]
    : progress.completedExerciseIds;

  const updated: UserProgress = {
    ...progress,
    completedExerciseIds: updatedCompleted,
    xp: progress.xp + awardedXp,
  };

  const finalProgress = updateStreakAndActivity(updated);
  return { progress: finalProgress, awardedXp, isFirstTime };
}

export function recordQuizCompletion(
  quizId: string,
  isCorrect: boolean,
  progress: UserProgress
): { progress: UserProgress; awardedXp: number } {
  const isFirstTime = !progress.completedQuizIds.includes(quizId);
  const awardedXp = isCorrect ? (isFirstTime ? 50 : 10) : 5;

  const currentScore = progress.quizScores[quizId] || { total: 0, correct: 0 };
  const updatedScores = {
    ...progress.quizScores,
    [quizId]: {
      total: currentScore.total + 1,
      correct: currentScore.correct + (isCorrect ? 1 : 0),
    },
  };

  const updatedCompleted = isFirstTime && isCorrect
    ? [...progress.completedQuizIds, quizId]
    : progress.completedQuizIds;

  const updated: UserProgress = {
    ...progress,
    completedQuizIds: updatedCompleted,
    quizScores: updatedScores,
    xp: progress.xp + awardedXp,
  };

  const finalProgress = updateStreakAndActivity(updated);
  return { progress: finalProgress, awardedXp };
}

export function toggleResourceBookmark(
  resourceId: string,
  progress: UserProgress
): UserProgress {
  const exists = progress.bookmarkedResourceIds.includes(resourceId);
  const updatedBookmarks = exists
    ? progress.bookmarkedResourceIds.filter((id) => id !== resourceId)
    : [...progress.bookmarkedResourceIds, resourceId];

  const updated = {
    ...progress,
    bookmarkedResourceIds: updatedBookmarks,
  };
  saveUserProgress(updated);
  return updated;
}

export function toggleSnippetBookmark(
  snippetId: string,
  progress: UserProgress
): UserProgress {
  const exists = progress.bookmarkedSnippetIds.includes(snippetId);
  const updatedSnippets = exists
    ? progress.bookmarkedSnippetIds.filter((id) => id !== snippetId)
    : [...progress.bookmarkedSnippetIds, snippetId];

  const updated = {
    ...progress,
    bookmarkedSnippetIds: updatedSnippets,
  };
  saveUserProgress(updated);
  return updated;
}
