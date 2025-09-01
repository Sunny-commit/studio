'use client';

import { useState, useEffect } from 'react';
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
import { useDebounce } from 'use-debounce';

type Filters = {
    branch: string;
    year: string;
    subject: string;
    yearOfStudy: string;
    semester: string;
    campus: string;
    examType: string;
}

interface PaperSearchProps {
    onSearch: (filters: Filters) => void;
    initialFilters: Filters;
}

export function PaperSearch({ onSearch, initialFilters }: PaperSearchProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [debouncedFilters] = useDebounce(filters, 300);

  useEffect(() => {
    onSearch(debouncedFilters);
  }, [debouncedFilters, onSearch]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const years = ['2024', '2023', '2022', '2021'];
  const branches = ['CSE', 'ECE', 'MECH', 'CIVIL'];
  const campuses = ['RK Valley', 'Nuzvid', 'Srikakulam', 'Ongole'];
  const yearsOfStudy = ['P1', 'P2', 'E1', 'E2', 'E3', 'E4'];
  const semesters = ['1', '2'];
  const examTypes = ['mid1', 'mid2', 'mid3', 'Final Sem Exam'];

  return (
    <div className="rounded-lg border bg-card p-6 shadow-md">
      <div className="flex items-center mb-4">
        <Filter className="mr-2 h-5 w-5 text-primary" />
        <h3 className="font-headline text-xl font-semibold">Filter Papers</h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select value={filters.branch} onValueChange={(value) => handleFilterChange('branch', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            {branches.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        
        <Select value={filters.examType} onValueChange={(value) => handleFilterChange('examType', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Exam Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Exam Types</SelectItem>
            {examTypes.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.yearOfStudy} onValueChange={(value) => handleFilterChange('yearOfStudy', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Year of Study" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years of Study</SelectItem>
            {yearsOfStudy.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.semester} onValueChange={(value) => handleFilterChange('semester', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            {semesters.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={filters.campus} onValueChange={(value) => handleFilterChange('campus', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Campus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campuses</SelectItem>
            {campuses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="relative sm:col-span-2 lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search by subject (e.g., Mathematics-II)"
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="pl-9"
            />
        </div>
      </div>
    </div>
  );
}
