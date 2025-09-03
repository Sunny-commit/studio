
'use client';

import { useState, useEffect, useCallback } from 'react';
import { runFlow } from '@genkit-ai/next/client';
import { PaperSearch } from '@/components/paper-search';
import { PaperCard } from '@/components/paper-card';
import type { QuestionPaper } from '@/lib/types';
import { paperCache } from '@/lib/paper-cache';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { semanticSearch } from '@/ai/flows/semantic-search-flow';
import { useDebounce } from 'use-debounce';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [allPapers, setAllPapers] = useState<QuestionPaper[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
  const [filteredPaperIds, setFilteredPaperIds] = useState<string[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Memoize all papers into a map for quick lookups
  const paperMap = new Map(allPapers.map(p => [p.id, p]));

  useEffect(() => {
    const papers = paperCache.getPapers();
    setAllPapers(papers);
    // Initially, show all papers
    setFilteredPaperIds(papers.map(p => p.id));
  }, []);
  
  const performSearch = useCallback(async (query: string) => {
    if (!query) {
      // If query is empty, show all papers
      setFilteredPaperIds(allPapers.map(p => p.id));
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const result = await runFlow(semanticSearch, {
        query: query,
        papers: allPapers,
      });
      setFilteredPaperIds(result.matchingPaperIds);
    } catch (error) {
      console.error("AI Search failed:", error);
      // Fallback to showing no results on error
      setFilteredPaperIds([]);
    } finally {
      setIsSearching(false);
    }
  }, [allPapers]);
  
  useEffect(() => {
    // This is a temporary filter based on the search query.
    // A more robust solution would involve multiple filter criteria.
    if (searchQuery) {
        const filtered = allPapers.filter(paper => 
            paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.examType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.year.toString().includes(searchQuery.toLowerCase())
        );
        setFilteredPaperIds(filtered.map(p => p.id));
    } else {
        setFilteredPaperIds(allPapers.map(p => p.id));
    }
  }, [searchQuery, allPapers]);

  const displayedPapers = filteredPaperIds ? filteredPaperIds.map(id => paperMap.get(id)).filter((p): p is QuestionPaper => !!p) : allPapers;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <section className="mb-12 space-y-4">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
          Question Paper Dashboard
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Use our new AI-powered search to find exactly what you need. Just ask a question like "final exams for CSE from last year".
        </p>
      </section>

      <PaperSearch onSearch={setSearchQuery} isSearching={isSearching} />

      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline text-3xl font-bold tracking-tight">
            Available Papers ({displayedPapers.length})
          </h2>
           {isSearching && <Loader2 className="h-6 w-6 animate-spin text-primary" />}
        </div>
        
        {displayedPapers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedPapers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        ) : !isSearching ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
             <h3 className="text-xl font-semibold">No Papers Found</h3>
             <p className="text-muted-foreground mt-2 max-w-sm">Try adjusting your search query, or be the first to contribute a paper!</p>
             <Button asChild className="mt-4">
                <Link href="/submit-paper">Submit a Paper</Link>
             </Button>
          </div>
        ) : (
          // Don't show the "No Papers Found" message while searching
          <div /> 
        )}
      </section>
    </div>
  );
}
