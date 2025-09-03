
'use client';

import { useState, useEffect, useMemo } from 'react';
import { PaperSearch } from '@/components/paper-search';
import type { PaperSearchFilters } from '@/components/paper-search';
import { PaperCard } from '@/components/paper-card';
import type { QuestionPaper } from '@/lib/types';
import { paperCache } from '@/lib/paper-cache';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [allPapers, setAllPapers] = useState<QuestionPaper[]>([]);
  const [filters, setFilters] = useState<PaperSearchFilters>({
    query: '',
    year: 'all',
    examType: 'all',
    branch: 'all',
    campus: 'all',
    yearOfStudy: 'all',
    semester: 'all',
  });

  useEffect(() => {
    // In a real app, you'd fetch this from an API
    const papers = paperCache.getPapers();
    setAllPapers(papers);
  }, []);

  const filteredPapers = useMemo(() => {
    return allPapers.filter((paper) => {
      const queryLower = filters.query.toLowerCase();
      
      const subjectMatch = paper.subject.toLowerCase().includes(queryLower);
      const yearMatch = filters.year === 'all' || paper.year.toString() === filters.year;
      const examTypeMatch = filters.examType === 'all' || paper.examType === filters.examType;
      const branchMatch = filters.branch === 'all' || paper.branch === filters.branch;
      const campusMatch = filters.campus === 'all' || paper.campus === filters.campus;
      const yearOfStudyMatch = filters.yearOfStudy === 'all' || paper.yearOfStudy === filters.yearOfStudy;
      const semesterMatch = filters.semester === 'all' || paper.semester.toString() === filters.semester;

      return subjectMatch && yearMatch && examTypeMatch && branchMatch && campusMatch && yearOfStudyMatch && semesterMatch;
    });
  }, [allPapers, filters]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <section className="mb-12 space-y-4">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Question Paper Dashboard
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Find the papers you need by filtering by subject, year, branch, and more.
        </p>
      </section>

      <PaperSearch onFiltersChange={setFilters} />

      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Available Papers ({filteredPapers.length})
          </h2>
        </div>
        
        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
             <h3 className="text-xl font-semibold">No Papers Found</h3>
             <p className="text-muted-foreground mt-2 max-w-sm">Try adjusting your filters, or be the first to contribute a paper!</p>
             <Button asChild className="mt-4">
                <Link href="/submit-paper">Submit a Paper</Link>
             </Button>
          </div>
        )}
      </section>
    </div>
  );
}
