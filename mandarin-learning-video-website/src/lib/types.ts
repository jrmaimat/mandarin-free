import type { TutorReply } from "@/lib/tutor";

export type ProgressResponse = {
  completed: string[];
  inProgress: string[];
  totalLessons: number;
  wordsSeen: number;
  quizzes: number;
};

export type ReviewCardView = {
  itemId: string;
  box: number;
  dueAt: string;
  correctCount: number;
  lapses: number;
  zh: string;
  pinyin: string;
  en: string;
  category: string;
  note?: string;
};

export type ReviewResponse = {
  due: ReviewCardView[];
  upcoming: ReviewCardView[];
  stats: {
    total: number;
    due: number;
    learned: number;
    mastered: number;
    attempts: number;
    accuracy: number | null;
    streak: number;
  };
};

export type ChatMessage = {
  id: number | string;
  role: "user" | "assistant";
  content: string;
  pinyin: string | null;
  translation: string | null;
  tips: string[] | null;
  createdAt: string;
  coach?: string | null;
  suggestions?: string[];
  vocab?: { zh: string; pinyin: string; en: string }[];
  engine?: string;
};

export type TutorResponse = {
  reply: TutorReply;
  turn: number;
  messages: ChatMessage[];
};

export type QuizResponse = {
  correct: number;
  total: number;
  attempts: number;
  best: number;
  average: number | null;
};
