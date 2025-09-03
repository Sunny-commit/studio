
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Button } from './ui/button';

const years = ['all', '2024', '2023', '2022', '2021', '2020'];
const examTypes = ['all', 'mid1', 'mid2', 'mid3', 'Final Sem Exam'];
const branches = ['all', 'CSE', 'ECE', 'MECH', 'CIVIL', 'common'];
const campuses = ['all', 'RK Valley', 'Nuzvid', 'Srikakulam', 'Ongole'];
const yearsOfStudy = ['all', 'P1', 'P2', 'E1', 'E2', 'E3', 'E4'];
const semesters = ['all', '1', '2'];

export interface PaperSearchFilters {
  query: string;
  year: string;
  examType: string;
  branch: string;
  campus: string;
  yearOfStudy: string;
  semester: string;
}

interface PaperSearchProps {
  onFiltersChange: (filters: PaperSearchFilters) => void;
}

export function PaperSearch({ onFiltersChange }: PaperSearchProps) {
  const [filters, setFilters] = useState<PaperSearchFilters>({
    query: '',
    year: 'all',
    examType: 'all',
    branch: 'all',
    campus: 'all',
    yearOfStudy: 'all',
    semester: 'all',
  });

  const handleFilterChange = <K extends keyof PaperSearchFilters>(key: K, value: PaperSearchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);
  
  const resetFilters = () => {
    setFilters({
      query: '',
      year: 'all',
      examType: 'all',
      branch: 'all',
      campus: 'all',
      yearOfStudy: 'all',
      semester: 'all',
    });
  }

  const isP1OrP2 = ['P1', 'P2'].includes(filters.yearOfStudy);

  useEffect(() => {
    if (isP1OrP2) {
        handleFilterChange('branch', 'common');
    } else {
        // Optional: Reset to 'all' if user switches away from P1/P2
        // and branch was 'common'
        if(filters.branch === 'common'){
            handleFilterChange('branch', 'all');
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isP1OrP2]);

  return (
    <div className="rounded-lg border bg-card p-6 shadow-md">
      <div className="flex items-center mb-4">
        <Search className="mr-2 h-5 w-5 text-primary" />
        <h3 className="font-headline text-xl font-semibold">Search & Filter Papers</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative col-span-1 md:col-span-2 lg:col-span-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by subject name..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
          <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
          <SelectContent>
            {years.map(y => <SelectItem key={y} value={y}>{y === 'all' ? 'All Years' : y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.examType} onValueChange={(value) => handleFilterChange('examType', value)}>
          <SelectTrigger><SelectValue placeholder="Select exam type" /></SelectTrigger>
          <SelectContent>
            {examTypes.map(e => <SelectItem key={e} value={e}>{e === 'all' ? 'All Exam Types' : e}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.yearOfStudy} onValueChange={(value) => handleFilterChange('yearOfStudy', value)}>
          <SelectTrigger><SelectValue placeholder="Select year of study" /></SelectTrigger>
          <SelectContent>
            {yearsOfStudy.map(y => <SelectItem key={y} value={y}>{y === 'all' ? 'All Years of Study' : y}</SelectItem>)}
          </SelectContent>
        </Select>
         {!isP1OrP2 && (
            <Select value={filters.branch} onValueChange={(value) => handleFilterChange('branch', value)}>
              <SelectTrigger><SelectValue placeholder="Select branch" /></SelectTrigger>
              <SelectContent>
                {branches.map(b => <SelectItem key={b} value={b}>{b === 'all' ? 'All Branches' : b}</SelectItem>)}
              </SelectContent>
            </Select>
         )}
        <Select value={filters.campus} onValueChange={(value) => handleFilterChange('campus', value)}>
          <SelectTrigger><SelectValue placeholder="Select campus" /></SelectTrigger>
          <SelectContent>
            {campuses.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Campuses' : c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filters.semester} onValueChange={(value) => handleFilterChange('semester', value)}>
          <SelectTrigger><SelectValue placeholder="Select semester" /></SelectTrigger>
          <SelectContent>
            {semesters.map(s => <SelectItem key={s} value={s}>{s === 'all' ? 'All Semesters' : `Sem ${s}`}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex items-center justify-end md:col-start-2 lg:col-start-4">
            <Button onClick={resetFilters} variant="outline">Reset Filters</Button>
        </div>
      </div>
    </div>
  );
}
