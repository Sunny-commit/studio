
'use server';
/**
 * @fileOverview An AI flow to perform semantic search on question papers.
 *
 * - semanticSearch - Analyzes a user query and returns matching paper IDs.
 * - SemanticSearchInput - The input type for the function.
 * - SemanticSearchOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { QuestionPaper } from '@/lib/types';

// We define the input schema for our flow.
const SemanticSearchInputSchema = z.object({
  query: z.string().describe('The user\'s natural language search query.'),
  // We pass the full paper objects to give the AI maximum context.
  papers: z.custom<QuestionPaper[]>().describe('The list of all available question papers.'),
});
export type SemanticSearchInput = z.infer<typeof SemanticSearchInputSchema>;

// The output will be a simple list of paper IDs that match the query.
const SemanticSearchOutputSchema = z.object({
  matchingPaperIds: z.array(z.string()).describe('An array of paper IDs that best match the user\'s query.'),
});
export type SemanticSearchOutput = z.infer<typeof SemanticSearchOutputSchema>;

// This is the exported function our frontend will call.
export async function semanticSearch(input: SemanticSearchInput): Promise<SemanticSearchOutput> {
  return semanticSearchFlow(input);
}

// Define the prompt for the AI model.
const prompt = ai.definePrompt({
  name: 'semanticSearchPrompt',
  input: { schema: SemanticSearchInputSchema },
  output: { schema: SemanticSearchOutputSchema },
  prompt: `You are an expert search engine for a university question paper database.
Your task is to analyze the user's query and the provided list of papers and identify the ones that best match the query.

User Query: "{{query}}"

Analyze the query for keywords related to subject, year, exam type, branch, campus, year of study, and semester.
Compare this against the list of available papers provided below.

Return a JSON object containing a list of the IDs of the matching papers in the 'matchingPaperIds' field.
If no papers match, return an empty array.

Here is the list of available papers:
\`\`\`json
{{{json papers}}}
\`\`\`
`,
  model: 'googleai/gemini-1.5-flash',
});

// Define the main Genkit flow.
const semanticSearchFlow = ai.defineFlow(
  {
    name: 'semanticSearchFlow',
    inputSchema: SemanticSearchInputSchema,
    outputSchema: SemanticSearchOutputSchema,
  },
  async (input) => {
    // If the query is empty, return no results to avoid unnecessary AI calls.
    if (!input.query.trim()) {
      return { matchingPaperIds: [] };
    }
    
    // Call the AI prompt with the user's input.
    const { output } = await prompt(input);
    
    // Return the AI's output. The "!" asserts that output is not null.
    return output!;
  }
);
