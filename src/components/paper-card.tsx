import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { QuestionPaper } from '@/lib/types';
import { BookOpen, ArrowRight } from 'lucide-react';

interface PaperCardProps {
  paper: QuestionPaper;
}

export function PaperCard({ paper }: PaperCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-start justify-between">
            <BookOpen className="h-8 w-8 text-primary" />
            <Badge variant="secondary">{paper.examType}</Badge>
        </div>
        <CardTitle className="font-headline text-lg pt-2">{paper.subject}</CardTitle>
        <CardDescription>{paper.year}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex space-x-2">
            <Badge variant="outline">{paper.branch}</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full font-bold">
          <Link href={`/papers/${paper.id}`}>View Paper <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
