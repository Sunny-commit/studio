import type { QuestionPaper, User } from './types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Anusha', avatarUrl: 'https://picsum.photos/seed/anusha/40/40', reputation: 125 },
  { id: 'u2', name: 'Ravi Kumar', avatarUrl: 'https://picsum.photos/seed/ravi/40/40', reputation: 80 },
  { id: 'u3', name: 'Priya Sharma', avatarUrl: 'https://picsum.photos/seed/priya/40/40', reputation: 210 },
];

export const mockPapers: QuestionPaper[] = [
  {
    id: 'paper1',
    subject: 'Mathematics-II',
    year: 2024,
    examType: 'mid1',
    branch: 'CSE',
    yearOfStudy: 'E1',
    semester: 2,
    fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
    questions: [
      {
        id: 'q1a',
        questionNumber: '1(a)',
        text: 'Solve the differential equation (D² - 4D + 4)y = e²ˣ sin(3x).',
        solutions: [
          {
            id: 's1',
            author: mockUsers[1],
            content_type: 'text',
            content: 'The auxiliary equation is m² - 4m + 4 = 0, which gives (m-2)² = 0, so m=2, 2. Complementary Function (C.F) is (c₁+c₂x)e²ˣ. Particular Integral (P.I) is ...',
            upvotes: 23,
            timestamp: '2 days ago',
          },
          {
            id: 's2',
            author: mockUsers[2],
            content_type: 'image',
            content: 'https://picsum.photos/seed/sol1/600/800',
            upvotes: 45,
            timestamp: '3 days ago',
          },
        ],
      },
      {
        id: 'q2b',
        questionNumber: '2(b)',
        text: 'Find the rank of the matrix A = [[1, 2, 3], [2, 4, 6], [3, 6, 9]].',
        solutions: [],
      },
      {
        id: 'q4b',
        questionNumber: '4(b)',
        text: 'Verify Cayley-Hamilton theorem for the matrix A = [[1, 4], [2, 3]] and find its inverse.',
        solutions: [
           {
            id: 's3',
            author: mockUsers[0],
            content_type: 'text',
            content: 'The characteristic equation is |A - λI| = 0. This gives (1-λ)(3-λ) - 8 = 0, which simplifies to λ² - 4λ - 5 = 0. By Cayley-Hamilton theorem, A² - 4A - 5I = 0...',
            upvotes: 12,
            timestamp: '1 week ago',
          },
        ],
      },
    ],
  },
  {
    id: 'paper2',
    subject: 'Data Structures',
    year: 2023,
    examType: 'Final Sem Exam',
    branch: 'CSE',
    yearOfStudy: 'E2',
    semester: 1,
    fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
    questions: [],
  },
  {
    id: 'paper3',
    subject: 'Thermodynamics',
    year: 2024,
    examType: 'mid1',
    branch: 'MECH',
    yearOfStudy: 'E2',
    semester: 2,
    fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
    questions: [],
  },
  {
    id: 'paper4',
    subject: 'Digital Logic Design',
    year: 2023,
    examType: 'mid2',
    branch: 'ECE',
    yearOfStudy: 'E1',
    semester: 2,
    fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
    questions: [],
  },
];
