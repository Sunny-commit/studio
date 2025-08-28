
import type { QuestionPaper } from './types';
import { mockPapers } from './mock-data';

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

  public addPaper(paper: Omit<QuestionPaper, 'id'>): QuestionPaper {
    const newPaper: QuestionPaper = {
        ...paper,
        id: `paper${this.papers.length + 1}`, // simple id generation
        questions: [], // New papers don't have questions yet
    };
    this.papers.push(newPaper);
    return newPaper;
  }
  
  public updatePaper(id: string, updatedData: Partial<Omit<QuestionPaper, 'id'>>): QuestionPaper | null {
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
}

export const paperCache = PaperCache.getInstance();
