'use client';

import { useState } from 'react';
import { PaperSearch } from '@/components/paper-search';
import { PaperCard } from '@/components/paper-card';
import { mockPapers } from '@/lib/mock-data';
import type { QuestionPaper } from '@/lib/types';

export default function DashboardPage() {
  const [filteredPapers, setFilteredPapers] = useState<QuestionPaper[]>(mockPapers);

  const handleSearch = (filters: { branch: string; year: string; subject: string }) => {
    let papers = mockPapers;
    if (filters.branch && filters.branch !== 'all') {
      papers = papers.filter(p => p.branch === filters.branch);
    }
    if (filters.year && filters.year !== 'all') {
      papers = papers.filter(p => p.year.toString() === filters.year);
    }
    if (filters.subject) {
      papers = papers.filter(p => p.subject.toLowerCase().includes(filters.subject.toLowerCase()));
    }
    setFilteredPapers(papers);
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <section className="mb-12 space-y-4 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Find Your Question Papers
        </h1>
        <p className="mx-auto max-w-[700px] text-lg text-muted-foreground">
          Search through a vast library of past papers from your university. Filter by branch, year, and subject to quickly find what you need.
        </p>
      </section>

      <PaperSearch onSearch={handleSearch} />

      <section className="mt-12">
        <h2 className="font-headline text-3xl font-bold tracking-tight mb-6">
          Available Papers
        </h2>
        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
             <h3 className="text-xl font-semibold">No Papers Found</h3>
             <p className="text-muted-foreground mt-2">Try adjusting your search filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
