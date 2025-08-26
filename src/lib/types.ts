export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  reputation: number;
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
  examType: 'Mid-1' | 'Mid-2' | 'Final';
  branch: 'CSE' | 'ECE' | 'MECH' | 'CIVIL';
  fileUrl: string;
  questions: Question[];
  yearOfStudy: 'P1' | 'P2' | 'E1' | 'E2' | 'E3' | 'E4';
  semester: 1 | 2;
}
