
import type { Question, QuestionPaper, Solution, User } from './types';
import { mockPapers, mockUsers } from './mock-data';

/**
 * THIS IS A TEMPORARY IN-MEMORY CACHE.
 * In a real application, this would be replaced with a proper database.
 */

class PaperCache {
  private papers: QuestionPaper[];
  private static instance: PaperCache;

  private constructor() {
    // Deep copy to prevent mutation of the original mock data
    this.papers = JSON.parse(JSON.stringify(mockPapers));
  }

  public static getInstance(): PaperCache {
    if (!PaperCache.instance) {
      PaperCache.instance = new PaperCache();
    }
    return PaperCache.instance;
  }

  public getPapers(): QuestionPaper[] {
    return this.papers;
  }

  public getPaperById(id: string): QuestionPaper | undefined {
    return this.papers.find((p) => p.id === id);
  }

  public addPaper(paper: Omit<QuestionPaper, 'id' | 'questions'>): QuestionPaper {
    const newPaper: QuestionPaper = {
        ...paper,
        id: `paper${this.papers.length + 1}${Date.now()}`, // simple id generation
        questions: [], // New papers don't have questions yet
    };
    this.papers.unshift(newPaper); // Add to the beginning of the list
    return newPaper;
  }
  
  public updatePaper(id: string, updatedData: Partial<Omit<QuestionPaper, 'id' | 'questions' | 'fileUrl'>> & { fileUrl?: string }): QuestionPaper | null {
    const paperIndex = this.papers.findIndex((p) => p.id === id);
    if (paperIndex === -1) {
      return null;
    }
    
    const existingPaper = this.papers[paperIndex];
    
    const updatedPaper: QuestionPaper = {
      ...existingPaper,
      ...updatedData,
      id: existingPaper.id, // Ensure ID is not changed
    };

    this.papers[paperIndex] = updatedPaper;
    return updatedPaper;
  }

  public addSolution(paperId: string, questionId: string, solutionData: Omit<Solution, 'id' | 'timestamp' | 'author' | 'upvotes'>, author: User): Solution | null {
    const paper = this.getPaperById(paperId);
    if (!paper) return null;

    const question = paper.questions.find(q => q.id === questionId);
    if (!question) return null;

    const newSolution: Solution = {
      ...solutionData,
      id: `sol${Date.now()}`,
      timestamp: 'Just now',
      author,
      upvotes: 0
    };

    question.solutions.push(newSolution);
    return newSolution;
  }
}

export const paperCache = PaperCache.getInstance();
