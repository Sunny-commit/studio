import { notFound } from 'next/navigation';
import { mockPapers, mockUsers } from '@/lib/mock-data';
import type { Question } from '@/lib/types';
import { SolutionCard } from '@/components/solution-card';
import { AddSolutionForm } from '@/components/add-solution-form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { FileText, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function PaperPage({ params }: { params: { paperId: string } }) {
  const paper = mockPapers.find((p) => p.id === params.paperId);

  if (!paper) {
    notFound();
  }
  
  const answeredQuestions = paper.questions.filter(q => q.solutions.length > 0).length;
  const progressPercentage = paper.totalQuestions > 0 ? (answeredQuestions / paper.totalQuestions) * 100 : 0;

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
                <CardTitle className="flex items-center"><FileText className="mr-3 h-6 w-6 text-primary"/> Question Paper</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[8.5/11] w-full overflow-hidden rounded-md border">
                   <iframe src={paper.fileUrl} className="h-full w-full" title={`${paper.subject} ${paper.year} Paper`} />
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

        <div className="lg:col-span-1">
          <h2 className="font-headline text-2xl font-semibold mb-4">Questions & Solutions</h2>
          {paper.questions.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {paper.questions.map((question: Question) => (
                <AccordionItem value={question.id} key={question.id} className="border-b-0">
                  <Card className="overflow-hidden">
                    <AccordionTrigger className="w-full p-4 text-left font-semibold hover:no-underline data-[state=open]:bg-muted/50">
                       <div className="flex items-center justify-between w-full">
                         <span>{question.questionNumber}: {question.text}</span>
                         <ChevronDown className="h-5 w-5 shrink-0 transition-transform duration-200" />
                       </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <div className="border-t -mx-4 mb-4"></div>
                      {question.solutions.length > 0 ? (
                        <div className="space-y-6">
                           <h3 className="font-semibold text-lg mb-2">Community Solutions</h3>
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
                         <AddSolutionForm question={question} currentUser={mockUsers[0]} />
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
