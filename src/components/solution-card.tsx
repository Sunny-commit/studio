'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Solution } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SolutionCardProps {
  solution: Solution;
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const [votes, setVotes] = useState(solution.upvotes);
  const [voteType, setVoteType] = useState<'up' | 'down' | null>(null);

  const handleUpvote = () => {
    if (voteType === 'up') {
      setVotes(votes - 1);
      setVoteType(null);
    } else if (voteType === 'down') {
      setVotes(votes + 2);
      setVoteType('up');
    } else {
      setVotes(votes + 1);
      setVoteType('up');
    }
  };

  const handleDownvote = () => {
    if (voteType === 'down') {
      setVotes(votes + 1);
      setVoteType(null);
    } else if (voteType === 'up') {
      setVotes(votes - 2);
      setVoteType('down');
    } else {
      setVotes(votes - 1);
      setVoteType('down');
    }
  };


  return (
    <Card className="overflow-hidden bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={solution.author.avatarUrl} alt={solution.author.name} />
            <AvatarFallback>{solution.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold">{solution.author.name}</p>
            <p className="text-xs text-muted-foreground">{solution.timestamp}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        {solution.content_type === 'text' ? (
          <p className="text-sm">{solution.content}</p>
        ) : (
          <div className="relative mt-2 aspect-[4/3] w-full overflow-hidden rounded-md border">
            <Image
              src={solution.content}
              alt="Handwritten solution"
              fill
              className="object-cover"
              data-ai-hint="handwritten solution"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center gap-2 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUpvote}
          className={cn('flex items-center gap-1', voteType === 'up' && 'text-primary bg-accent')}
        >
          <ArrowUp className="h-4 w-4" />
          <span>Upvote</span>
        </Button>
        <span className="text-sm font-bold w-6 text-center">{votes}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownvote}
          className={cn('flex items-center gap-1', voteType === 'down' && 'text-destructive bg-destructive/10')}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
