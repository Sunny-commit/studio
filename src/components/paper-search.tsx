
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, BrainCircuit } from 'lucide-react';

interface PaperSearchProps {
    onSearch: (query: string) => void;
    isSearching: boolean;
}

export function PaperSearch({ onSearch }: PaperSearchProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  return (
    <div className="rounded-lg border bg-card p-6 shadow-md">
      <div className="flex items-center mb-4">
        <BrainCircuit className="mr-2 h-5 w-5 text-primary" />
        <h3 className="font-headline text-xl font-semibold">AI Powered Search</h3>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search papers with natural language..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 text-base"
        />
      </div>
    </div>
  );
}
