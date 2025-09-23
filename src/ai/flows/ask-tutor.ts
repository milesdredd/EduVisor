'use server';

/**
 * @fileOverview An AI tutor that can answer complex questions for a given career path.
 *
 * - askTutor - A function that provides an expert answer to a user's question.
 * - AskTutorInput - The input type for the askTutor function.
 * - AskTutorOutput - The return type for the askTutor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskTutorInputSchema = z.object({
  career: z.string().describe('The career path the user is preparing for.'),
  question: z.string().describe('The user\'s specific question.'),
});
export type AskTutorInput = z.infer<typeof AskTutorInputSchema>;

const AskTutorOutputSchema = z.object({
  answer: z
    .string()
    .describe('A detailed and helpful answer to the user\'s question.'),
});
export type AskTutorOutput = z.infer<typeof AskTutorOutputSchema>;

export async function askTutor(input: AskTutorInput): Promise<AskTutorOutput> {
  return askTutorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askTutorPrompt',
  input: {schema: AskTutorInputSchema},
  output: {schema: AskTutorOutputSchema},
  prompt: `You are an expert tutor for students in India preparing for entrance exams for a career in {{{career}}}.

The user has the following question:
"{{{question}}}"

Provide a clear, detailed, and accurate answer to help them understand the concept. Break down complex ideas into smaller, easy-to-understand parts. Use examples if it helps clarify the explanation.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const askTutorFlow = ai.defineFlow(
  {
    name: 'askTutorFlow',
    inputSchema: AskTutorInputSchema,
    outputSchema: AskTutorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
