export type TabType = 
  | 'exercises' 
  | 'snippets' 
  | 'visualizer' 
  | 'resources' 
  | 'quizzes' 
  | 'mentor' 
  | 'progress';

export type DifficultyLevel = 'beginner' | 'easy' | 'intermediate' | 'advanced';

export type ResourceCategory = 
  | 'all'
  | 'tutorial' 
  | 'reference' 
  | 'interactive' 
  | 'video' 
  | 'tool' 
  | 'book' 
  | 'roadmap';

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description?: string;
  isCustom?: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  shortDescription: string;
  instructions: string[];
  learningPoints: string[];
  starterCode: string;
  solutionCode: string;
  explanation: string;
  hints: string[];
  testCases: TestCase[];
  defaultStdin?: string;
  relatedTopicId?: string;
}

export interface CodeSnippet {
  id: string;
  title: string;
  category: string;
  difficulty: DifficultyLevel;
  tags: string[];
  description: string;
  code: string;
  explanation: string[];
  outputSample?: string;
  bestPractices?: string[];
  commonGotchas?: string[];
}

export interface PublicResource {
  id: string;
  title: string;
  provider: string;
  category: ResourceCategory;
  level: DifficultyLevel | 'all-levels';
  description: string;
  url: string;
  freeStatus: '100% Free' | 'Free with optional premium' | 'Open Source';
  features: string[];
  rating: number; // out of 5
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  topic: string;
  difficulty: DifficultyLevel;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  referenceUrl?: string;
}

export interface MemoryVariable {
  name: string;
  type: string;
  value: string;
  address: string;
  isPointer?: boolean;
  pointsToAddress?: string;
  isReference?: boolean;
  refersToName?: string;
  isHeapAllocated?: boolean;
}

export interface MemoryFrame {
  id: string;
  title: string;
  description: string;
  codeHighlightLine: number;
  stack: MemoryVariable[];
  heap: MemoryVariable[];
  terminalOutput?: string;
}

export interface MemoryScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  code: string;
  frames: MemoryFrame[];
}

export interface UserProgress {
  completedExerciseIds: string[];
  solvedTestCases: Record<string, number>; // exerciseId -> count
  savedCodePerExercise: Record<string, string>;
  bookmarkedResourceIds: string[];
  bookmarkedSnippetIds: string[];
  completedQuizIds: string[];
  quizScores: Record<string, { total: number; correct: number }>;
  xp: number;
  streakDays: number;
  lastActiveDate: string;
  activityHistory: Record<string, number>; // YYYY-MM-DD -> count
  personalNotes: Record<string, string>; // topic/exerciseId -> note
}

export interface CompilationResult {
  stdout: string;
  stderr: string;
  output: string;
  code: number;
  signal: string | null;
  source?: string;
  passedAllTests?: boolean;
  testResults?: {
    testCaseId: string;
    passed: boolean;
    actualOutput: string;
    expectedOutput: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  codeSnippet?: string;
  timestamp: string;
}
