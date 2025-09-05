'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { paperCache } from '@/lib/paper-cache';
import type { Question, QuestionPaper } from '@/lib/types';
import { SolutionCard } from '@/components/solution-card';
import { AddSolutionForm } from '@/components/add-solution-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { FileText, ChevronDown, CheckCircle2, Download, Bot, Replace } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import * as React from 'react';

export default function PaperPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  // ✅ unwrap params properly
  const { paperId } = React.use(params);

  const [paper, setPaper] = useState<QuestionPaper | null | undefined>(undefined);

  const refreshPaper = useCallback((id: string) => {
    const currentPaper = paperCache.getPaperById(id);
    if (!currentPaper) {
      setPaper(null); // Paper not found
    } else {
      // Deep copy ensures re-render
      setPaper(JSON.parse(JSON.stringify(currentPaper)));
    }
  }, []);

  useEffect(() => {
    if (paperId) {
      refreshPaper(paperId);
    }
  }, [paperId, refreshPaper]);

  if (paper === undefined) {
    // Loading skeletons
    return (
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <div className="mb-8">
          <Skeleton className="h-10 w-3/4" />
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[600px] w-full" />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!paper) {
    notFound();
  }

  const answeredQuestions = paper.questions.filter(q => q.solutions.length > 0).length;
  const progressPercentage =
    paper.totalQuestions > 0 ? (answeredQuestions / paper.totalQuestions) * 100 : 0;

  // Adjust Google Drive preview link
  const previewUrl = paper.fileUrl.replace('/view', '/preview');

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      {/* ... keep your JSX exactly the same ... */}
    </div>
  );
}
