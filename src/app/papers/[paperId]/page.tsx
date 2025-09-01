
'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { paperCache } from '@/lib/paper-cache';
import type { Question, QuestionPaper } from '@/lib/types';
import { SolutionCard } from '@/components/solution-card';
import { AddSolutionForm } from '@/components/add-solution-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { FileText, ChevronDown, CheckCircle2, Download, Bot, Replace, BrainCircuit, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function PaperPage({ params }: { params: { paperId: string } }) {
  const [paper, setPaper] = useState<QuestionPaper | null | undefined>(undefined);

  const refreshPaper = useCallback((id: string) => {
    const currentPaper = paperCache.getPaperById(id);
    if (!currentPaper) {
      setPaper(null); // Paper not found
    } else {
      // Create a deep copy to ensure state updates trigger re-renders
      setPaper(JSON.parse(JSON.stringify(currentPaper)));
    }
  }, []);

  useEffect(() => {
    if (params.paperId) {
        refreshPaper(params.paperId);
    }
  }, [params.paperId, refreshPaper]);

  if (paper === undefined) {
    // Loading state
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
  const progressPercentage = paper.totalQuestions > 0 ? (answeredQuestions / paper.totalQuestions) * 100 : 0;
  // Replace the iframe src to work with Google Drive's preview URL format
  const previewUrl = paper.fileUrl.replace('/view', '/preview');

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">{paper.subject}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
          <span>{paper.year}</span>
          <Badge variant="outline">{paper.branch}</Badge>
          <Badge variant="secondary">{paper.examType}</Badge>
          <Badge variant="outline">{paper.campus}</Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
           <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center"><FileText className="mr-3 h-6 w-6 text-primary"/> Question Paper</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button asChild>
                      <a href={paper.fileUrl} download target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <Link href={`/submit-paper?paperId=${paper.id}`}>
                        <Replace className="mr-2 h-4 w-4" />
                        Replace
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="aspect-[8.5/11] w-full overflow-hidden rounded-md border bg-muted">
                   <iframe src={previewUrl} className="h-full w-full" title={`${paper.subject} ${paper.year} Paper`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><CheckCircle2 className="mr-3 h-6 w-6 text-primary" /> Progress</CardTitle>
                <CardDescription>
                  {answeredQuestions} out of {paper.totalQuestions} questions have at least one solution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                 <Progress value={progressPercentage} className="h-3" />
                 <div className="mt-2 text-right text-sm font-medium text-muted-foreground">
                    {Math.round(progressPercentage)}% Complete
                 </div>
              </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <Card className="bg-gradient-to-br from-primary/10 to-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 font-headline">
                  <Bot className="h-7 w-7 text-primary" />
                  AI Assistant
                </CardTitle>
                 <CardDescription>
                  Stuck on a question? Get private, one-on-one help from our AI tutor.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full font-bold">
                  <Link href="/ai-assistant">Start Chat</Link>
                </Button>
              </CardContent>
            </Card>

          <h2 className="font-headline text-2xl font-semibold">Questions & Solutions</h2>
          {paper.questions.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-4" defaultValue={paper.questions.length > 0 ? paper.questions[0].id : undefined}>
              {paper.questions.map((question: Question) => (
                <AccordionItem value={question.id} key={question.id} className="border-b-0">
                  <Card className="overflow-hidden">
                    <AccordionTrigger className="w-full p-4 text-left font-semibold hover:no-underline data-[state=open]:bg-muted/50">
                       <div className="flex items-center justify-between w-full">
                         <span className="flex-1 text-left pr-2">{question.questionNumber}: {question.text}</span>
                         <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                       </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <div className="border-t -mx-4 mb-4"></div>
                      {question.solutions.length > 0 ? (
                        <div className="space-y-6">
                           <h3 className="font-semibold text-lg mb-2">Community Solutions ({question.solutions.length})</h3>
                          {question.solutions
                            .sort((a, b) => b.upvotes - a.upvotes)
                            .map((solution) => (
                              <SolutionCard key={solution.id} solution={solution} />
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-sm text-muted-foreground py-4">No solutions yet. Be the first to add one!</p>
                      )}
                      <div className="mt-6 border-t pt-6">
                        <h4 className="font-semibold text-lg mb-4">Add Your Solution</h4>
                        <AddSolutionForm question={question} paperId={paper.id} onSolutionAdded={() => refreshPaper(paper.id)} />
                      </div>
                    </AccordionContent>
                   </Card>
                </AccordionItem>
              ))}
            </Accordion>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 py-20 text-center">
                    <h3 className="text-xl font-semibold">No Questions Available</h3>
                    <p className="text-muted-foreground mt-2">Questions for this paper haven't been added yet.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
