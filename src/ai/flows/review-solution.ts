// This file uses server-side code.
'use server';

/**
 * @fileOverview AI-powered solution reviewer that provides feedback on student submissions.
 *
 * - reviewSolution - Analyzes a submitted solution and returns suggestions for improvement.
 * - ReviewSolutionInput - The input type for the reviewSolution function.
 * - ReviewSolutionOutput - The return type for the reviewSolution function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReviewSolutionInputSchema = z.object({
  solutionText: z.string().describe('The text of the submitted solution.'),
  questionText: z.string().describe('The text of the question being answered.'),
});

export type ReviewSolutionInput = z.infer<typeof ReviewSolutionInputSchema>;

const ReviewSolutionOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('Suggestions for improving the solution.')
  ).describe('List of suggestions for improving the solution.'),
  confidence: z.number().describe('Confidence level in the suggestions (0-1).'),
});

export type ReviewSolutionOutput = z.infer<typeof ReviewSolutionOutputSchema>;

export async function reviewSolution(input: ReviewSolutionInput): Promise<ReviewSolutionOutput> {
  return reviewSolutionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reviewSolutionPrompt',
  input: {schema: ReviewSolutionInputSchema},
  output: {schema: ReviewSolutionOutputSchema},
  prompt: `You are an AI solution reviewer, tasked with providing feedback on student solutions to exam questions.

  Analyze the provided solution for potential errors, areas of improvement, and overall clarity.
  Provide a list of specific, actionable suggestions that the student can use to refine their answer.
  Also provide a confidence score of the suggestions, from 0 to 1. 1 meaning the suggestions are very accurate.

  Question: {{{questionText}}}
  Solution: {{{solutionText}}}

  Format your response as a JSON object with a 'suggestions' field (an array of strings) and a 'confidence' field (a number between 0 and 1).`,
});

const reviewSolutionFlow = ai.defineFlow(
  {
    name: 'reviewSolutionFlow',
    inputSchema: ReviewSolutionInputSchema,
    outputSchema: ReviewSolutionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
