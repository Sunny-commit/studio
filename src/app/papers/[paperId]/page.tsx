import { notFound } from 'next/navigation';
import { mockPapers, mockUsers } from '@/lib/mock-data';
import type { Question } from '@/lib/types';
import { SolutionCard } from '@/components/solution-card';
import { AddSolutionForm } from '@/components/add-solution-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

export default function PaperPage({ params }: { params: { paperId: string } }) {
  const paper = mockPapers.find((p) => p.id === params.paperId);

  if (!paper) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4">
      <div className="mb-8">
        <h1 className="font-headline text-4xl font-bold tracking-tight">{paper.subject}</h1>
        <div className="mt-2 flex items-center gap-4 text-muted-foreground">
          <span>{paper.year}</span>
          <Badge variant="outline">{paper.branch}</Badge>
          <Badge variant="secondary">{paper.examType}</Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
           <div className="mb-8 rounded-lg border bg-card p-4">
              <h2 className="font-headline text-2xl font-semibold mb-4 flex items-center"><FileText className="mr-2 h-6 w-6 text-primary"/> Question Paper</h2>
              <div className="aspect-[8.5/11] w-full overflow-hidden rounded-md border">
                 <iframe src={paper.fileUrl} className="h-full w-full" title={`${paper.subject} ${paper.year} Paper`} />
              </div>
            </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="font-headline text-2xl font-semibold mb-4">Questions & Solutions</h2>
          <Accordion type="single" collapsible className="w-full">
            {paper.questions.length > 0 ? (
                paper.questions.map((question: Question) => (
              <AccordionItem value={question.id} key={question.id}>
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {question.questionNumber}: {question.text}
                </AccordionTrigger>
                <AccordionContent className="bg-background/80 p-4 rounded-b-md">
                  {question.solutions.length > 0 ? (
                    <div className="space-y-6">
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
                     <h4 className="font-semibold mb-4">Add Your Solution</h4>
                     <AddSolutionForm question={question} currentUser={mockUsers[0]} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))) : (
                <p className="text-center text-sm text-muted-foreground py-8">No questions available for this paper yet.</p>
            )}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
