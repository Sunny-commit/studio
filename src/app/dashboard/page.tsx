
'use client';

import { useState, useEffect } from 'react';
import { PaperSearch } from '@/components/paper-search';
import { PaperCard } from '@/components/paper-card';
import type { QuestionPaper } from '@/lib/types';
import { paperCache } from '@/lib/paper-cache';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [allPapers, setAllPapers] = useState<QuestionPaper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<QuestionPaper[]>([]);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const papers = paperCache.getPapers();
    setAllPapers(papers);
    setFilteredPapers(papers);
  }, []);


  const handleSearch = (filters: { branch: string; year: string; subject: string; yearOfStudy: string; semester: string; campus: string; examType: string; }) => {
    let papers = [...paperCache.getPapers()];
    if (filters.branch && filters.branch !== 'all') {
      papers = papers.filter(p => p.branch === filters.branch);
    }
    if (filters.year && filters.year !== 'all') {
      papers = papers.filter(p => p.year.toString() === filters.year);
    }
    if (filters.examType && filters.examType !== 'all') {
      papers = papers.filter(p => p.examType === filters.examType);
    }
    if (filters.yearOfStudy && filters.yearOfStudy !== 'all') {
      papers = papers.filter(p => p.yearOfStudy === filters.yearOfStudy);
    }
    if (filters.semester && filters.semester !== 'all') {
      papers = papers.filter(p => p.semester.toString() === filters.semester);
    }
    if (filters.campus && filters.campus !== 'all') {
        papers = papers.filter(p => p.campus === filters.campus);
    }
    if (filters.subject) {
      papers = papers.filter(p => p.subject.toLowerCase().includes(filters.subject.toLowerCase()));
    }
    setFilteredPapers(papers);
  };
  
  if (isLoading || !isAuthenticated) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 text-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <section className="mb-12 space-y-4">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Question Paper Dashboard
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Search through a vast library of past papers from your university. Filter by branch, year, and subject to quickly find what you need.
        </p>
      </section>

      <PaperSearch onSearch={handleSearch} />

      <section className="mt-12">
        <h2 className="font-headline text-3xl font-bold tracking-tight mb-6">
          Available Papers ({filteredPapers.length})
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
             <p className="text-muted-foreground mt-2 max-w-sm">Try adjusting your search filters, or be the first to contribute a paper for this category!</p>
             <Button asChild className="mt-4">
                <Link href="/submit-paper">Submit a Paper</Link>
             </Button>
          </div>
        )}
      </section>
    </div>
  );
}
