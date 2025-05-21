export enum ExamStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  GRADED = 'GRADED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  totalPoints: number;
  passingScore: number;
  timeLimit: number; // en minutos
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  points: number;
  options: Option[];
}

export interface Option {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface ExamAttempt {
  id: number;
  student: {
    id: number;
    username: string;
  };
  exam: Exam;
  startTime: string; // ISO string
  submissionTime?: string; // ISO string, opcional
  score: number;
  maxScore: number;
  status: ExamStatus;
  answers: StudentAnswer[];
  feedback?: string;
}

export interface StudentAnswer {
  id: number;
  questionId: number;
  selectedOptionId?: number;
  textResponse?: string;
  isCorrect?: boolean;
  points?: number;
}

export interface StartExamRequest {
  examId: number;
  userId: number;
}

export interface ExamSubmissionDTO {
  answers: StudentAnswer[];
}

export interface ExamResultDTO {
  examId: number;
  userId: number;
  score: number;
  maxScore: number;
  isPassed: boolean;
  submissionTime: string;
  feedback?: string;
  answers: StudentAnswer[];
}
