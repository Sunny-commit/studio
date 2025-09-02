'use server';
/**
 * @fileOverview An AI flow to extract questions from a question paper file.
 *
 * - extractQuestionsFromPaper - Analyzes a paper and returns a list of questions.
 * - ExtractQuestionsInput - The input type for the function.
 * - ExtractQuestionsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuestionSchema = z.object({
  questionNumber: z.string().describe('The number of the question, e.g., "1(a)" or "2".'),
  text: z.string().describe('The full text of the question.'),
});

export const ExtractQuestionsInputSchema = z.object({
  paperDataUri: z
    .string()
    .describe(
      "The question paper file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractQuestionsInput = z.infer<typeof ExtractQuestionsInputSchema>;

export const ExtractQuestionsOutputSchema = z.object({
  questions: z.array(QuestionSchema).describe('The list of questions extracted from the paper.'),
});
export type ExtractQuestionsOutput = z.infer<typeof ExtractQuestionsOutputSchema>;


export async function extractQuestionsFromPaper(input: ExtractQuestionsInput): Promise<ExtractQuestionsOutput> {
  return extractQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractQuestionsPrompt',
  input: { schema: ExtractQuestionsInputSchema },
  output: { schema: ExtractQuestionsOutputSchema },
  prompt: `You are an expert data entry assistant. Your task is to analyze the provided document (a university question paper) and extract all the questions from it.

Pay close attention to question numbers, including sub-parts (e.g., 1(a), 1(b), 2, 3(a)(i)).
Extract the full text of each question accurately.

Document: {{media url=paperDataUri}}

Return the result as a structured JSON object containing a list of all questions.`,
  model: 'googleai/gemini-1.5-flash',
});

const extractQuestionsFlow = ai.defineFlow(
  {
    name: 'extractQuestionsFlow',
    inputSchema: ExtractQuestionsInputSchema,
    outputSchema: ExtractQuestionsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
