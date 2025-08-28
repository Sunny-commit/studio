
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { QuestionPaper } from '@/lib/types';
import { BookOpen, ArrowRight, MapPin } from 'lucide-react';

interface PaperCardProps {
  paper: QuestionPaper;
}

export function PaperCard({ paper }: PaperCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
            <BookOpen className="h-8 w-8 text-primary" />
            <Badge variant="secondary">{paper.examType}</Badge>
        </div>
        <CardTitle className="font-headline text-lg pt-2 line-clamp-2">{paper.subject}</CardTitle>
        <CardDescription>{paper.year}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{paper.branch}</Badge>
            <Badge variant="outline">Sem {paper.semester}</Badge>
            <Badge variant="outline">{paper.yearOfStudy}</Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground pt-1">
            <MapPin className="h-4 w-4 mr-1.5" />
            <span>{paper.campus}</span>
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
