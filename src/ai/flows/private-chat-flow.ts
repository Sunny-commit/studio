
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

const PrivateChatInputSchema = z.object({
  questionText: z.string().describe('The user\'s question or message.'),
  mediaDataUri: z
    .string()
    .optional()
    .describe(
      "An optional file (image or PDF) of a question paper, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type PrivateChatInput = z.infer<typeof PrivateChatInputSchema>;

const PrivateChatOutputSchema = z.object({
  answer: z.string().describe('The AI\'s response to the user\'s question.'),
});
export type PrivateChatOutput = z.infer<typeof PrivateChatOutputSchema>;

export async function privateChat(input: PrivateChatInput): Promise<PrivateChatOutput> {
  return privateChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'privateChatPrompt',
  input: { schema: PrivateChatInputSchema },
  output: { schema: PrivateChatOutputSchema },
  prompt: `You are a friendly and expert AI tutor for university students. Your goal is to help students understand concepts and solve problems, not just give them the final answer. Guide them step-by-step.

The user has asked a question. They may have also provided a file (image or PDF) for context.

User's Question: {{{questionText}}}

{{#if mediaDataUri}}
The user has also uploaded this file for context. Analyze it to help answer their question.
File: {{media url=mediaDataUri}}
{{/if}}

Please provide a helpful and encouraging response to the user. If the question is complex, break it down.`,
  model: 'googleai/gemini-1.5-flash',
});

const privateChatFlow = ai.defineFlow(
  {
    name: 'privateChatFlow',
    inputSchema: PrivateChatInputSchema,
    outputSchema: PrivateChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
