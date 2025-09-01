
export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  reputation: number;
}

export interface AuthenticatedUser {
  id?: string;
  name: string;
  email: string;
  picture: string;
}

export interface Solution {
  id: string;
  author: User;
  content_type: 'text' | 'image';
  content: string;
  upvotes: number;
  timestamp: string;
}

export interface Question {
  id: string;
  questionNumber: string;
  text: string;
  solutions: Solution[];
}

export interface QuestionPaper {
  id: string;
  subject: string;
  year: number;
  examType: 'mid1' | 'mid2' | 'mid3' | 'Final Sem Exam';
  branch: 'CSE' | 'ECE' | 'MECH' | 'CIVIL' | 'common';
  campus: 'RK Valley' | 'Nuzvid' | 'Srikakulam' | 'Ongole';
  fileUrl: string;
  questions: Question[];
  yearOfStudy: 'P1' | 'P2' | 'E1' | 'E2' | 'E3' | 'E4';
  semester: 1 | 2;
  totalQuestions: number;
}
