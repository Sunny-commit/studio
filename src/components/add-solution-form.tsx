
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { runFlow } from '@genkit-ai/next/client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Bot, Upload, Loader2, Sparkles } from 'lucide-react';
import type { Question } from '@/lib/types';
import { reviewSolution, type ReviewSolutionOutput } from '@/ai/flows/review-solution';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from './ui/alert-dialog';
import { paperCache } from '@/lib/paper-cache';
import { mockUsers } from '@/lib/mock-data';

const solutionSchema = z.object({
  solutionText: z.string().optional(),
  solutionImageFile: z.any().optional(),
}).refine(data => data.solutionText || (data.solutionImageFile && data.solutionImageFile.length > 0), {
  message: 'Please provide either text or an image for your solution.',
  path: ['solutionText'],
});

interface AddSolutionFormProps {
  question: Question;
  paperId: string;
  onSolutionAdded: () => void;
}

export function AddSolutionForm({ question, paperId, onSolutionAdded }: AddSolutionFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewSolutionOutput | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof solutionSchema>>({
    resolver: zodResolver(solutionSchema),
    defaultValues: {
      solutionText: '',
      solutionImageFile: undefined,
    }
  });

  const onSubmit = async (values: z.infer<typeof solutionSchema>) => {
    setIsSubmitting(true);
    
    try {
      let content = '';
      let contentType: 'text' | 'image' = 'text';

      if (values.solutionImageFile && values.solutionImageFile.length > 0) {
        contentType = 'image';
        // In a real app, you would upload this file and get a URL
        content = URL.createObjectURL(values.solutionImageFile[0]);
        toast({ title: 'Image Uploading...', description: 'Your image is being prepared.' });
      } else {
        contentType = 'text';
        content = values.solutionText || '';
      }
      
      const author = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      
      paperCache.addSolution(paperId, question.id, { content, content_type: contentType }, author);
      
      toast({
        title: 'Solution Submitted!',
        description: 'Thank you for your contribution.',
      });
      
      form.reset({ solutionText: '', solutionImageFile: undefined });
      onSolutionAdded(); // Notify parent to re-render
    } catch (error) {
      console.error("Failed to add solution", error);
      toast({ variant: 'destructive', title: 'Submission Failed', description: 'Could not add your solution.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAiReview = async () => {
    const solutionText = form.getValues('solutionText');
    if (!solutionText) {
      toast({
        variant: 'destructive',
        title: 'No text to review',
        description: 'Please type your solution in the text area to use the AI review.',
      });
      return;
    }

    setIsReviewing(true);
    try {
      const result = await runFlow(reviewSolution, {
        questionText: question.text,
        solutionText: solutionText,
      });
      setReviewResult(result);
      setIsReviewDialogOpen(true);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI Review Failed',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="solutionText"
            render={({ field }) => (
              <FormItem>
                 <FormLabel>Type your solution</FormLabel>
                <FormControl>
                  <Textarea placeholder="Explain your answer here..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <div className="flex-1 border-t"></div>
            <span className="px-2">OR</span>
            <div className="flex-1 border-t"></div>
          </div>
          <FormField
            control={form.control}
            name="solutionImageFile"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>Upload an image of your solution</FormLabel>
                 <FormControl>
                    <div className="relative">
                        <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="file" className="pl-9" accept="image/*" onChange={(e) => onChange(e.target.files)} />
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleAiReview} disabled={isReviewing}>
              {isReviewing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Bot className="mr-2 h-4 w-4" />
              )}
              AI Review
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Solution
            </Button>
          </div>
        </form>
      </Form>
      <AlertDialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-headline text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              AI Solution Review
            </AlertDialogTitle>
            <AlertDialogDescription>
              Here are some AI-generated suggestions to improve your solution. Confidence: {reviewResult && Math.round(reviewResult.confidence * 100)}%
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="max-h-60 overflow-y-auto pr-2">
             {reviewResult?.suggestions?.length ? (
                <ul className="space-y-3 list-disc list-inside text-sm">
                {reviewResult.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                ))}
                </ul>
             ): (
                <p className="text-sm text-muted-foreground">The AI didn't have any specific suggestions. Your solution looks good!</p>
             )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
