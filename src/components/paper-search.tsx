'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';

interface PaperSearchProps {
    onSearch: (filters: { branch: string; year: string; subject: string }) => void;
}

export function PaperSearch({ onSearch }: PaperSearchProps) {
  const [branch, setBranch] = useState('all');
  const [year, setYear] = useState('all');
  const [subject, setSubject] = useState('');

  const handleSearchClick = () => {
    onSearch({ branch, year, subject });
  };
  
  const years = ['2024', '2023', '2022', '2021'];
  const branches = ['CSE', 'ECE', 'MECH', 'CIVIL'];

  return (
    <div className="rounded-lg border bg-card p-6 shadow-md">
      <div className="flex items-center mb-4">
        <Filter className="mr-2 h-5 w-5 text-primary" />
        <h3 className="font-headline text-xl font-semibold">Filter Papers</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger>
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="md:col-span-2">
            <div className="relative">
                <Input
                    placeholder="Search by subject (e.g., Mathematics-II)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="pr-10"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                />
                <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={handleSearchClick}>
                    <Search className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}
