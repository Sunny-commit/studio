
'use server';
/**
 * @fileOverview A private AI assistant for helping students with their questions.
 *
 * - privateChat - Handles a single turn in a private chat conversation.
 * - PrivateChatInput - The input type for the privateChat function.
 * - PrivateChatOutput - The return type for the privateChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { extractQuestionsFromPaper, ExtractQuestionsOutputSchema } from './extract-questions-flow';

const PrivateChatInputSchema = z.object({
  questionText: z.string().describe('The user\'s question or message.'),
  mediaDataUri: z
    .string()
    .optional()
    .describe(
      "An optional file (image or PDF) of a question paper, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type PrivateChatInput = z.infer<typeof PrivateChatInputSchema>;

const PrivateChatOutputSchema = z.object({
  answer: z.string().describe('The AI\'s response to the user\'s question.'),
});
export type PrivateChatOutput = z.infer<typeof PrivateChatOutputSchema>;

// This is the exported function our frontend will call.
export async function privateChat(input: PrivateChatInput): Promise<PrivateChatOutput> {
  return privateChatFlow(input);
}


const privateChatFlow = ai.defineFlow(
  {
    name: 'privateChatFlow',
    inputSchema: PrivateChatInputSchema,
    outputSchema: PrivateChatOutputSchema,
  },
  async (input) => {

    let extractedQuestions: z.infer<typeof ExtractQuestionsOutputSchema> | null = null;
    if (input.mediaDataUri) {
      try {
        extractedQuestions = await extractQuestionsFromPaper({ paperDataUri: input.mediaDataUri });
      } catch (e) {
        console.error('Failed to extract questions from paper', e);
        // Don't fail the whole flow, just proceed without extracted questions
      }
    }
    
    // We define the prompt inside the flow so we can dynamically add context.
    const prompt = ai.definePrompt({
      name: 'privateChatPrompt',
      input: { schema: PrivateChatInputSchema },
      output: { schema: PrivateChatOutputSchema },
      prompt: `You are a friendly and expert AI tutor for university students. Your goal is to help students understand concepts and solve problems, not just give them the final answer. Guide them step-by-step.

The user has asked a question. 

User's Question: {{{questionText}}}

{{#if mediaDataUri}}
The user has also uploaded a file for context. 
File: {{media url=mediaDataUri}}
{{/if}}

${extractedQuestions ? `I have analyzed the document and extracted the following questions from it. Use this information as the primary context for answering the user's question:
\`\`\`json
${JSON.stringify(extractedQuestions.questions, null, 2)}
\`\`\`` : ''}


Please provide a helpful and encouraging response to the user. If their question is about a specific question from the document, use the extracted text to give a precise answer. If the question is complex, break it down.`,
      model: 'googleai/gemini-1.5-flash',
    });


    const { output } = await prompt(input);
    return output!;
  }
);
