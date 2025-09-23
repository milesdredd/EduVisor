'use server';

/**
 * @fileOverview Finds relevant mentors for a given career path.
 *
 * - findMentors - A function that fetches a list of professionals in a field.
 * - FindMentorsInput - The input type for the findMentors function.
 * - FindMentorsOutput - The return type for the findMentors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindMentorsInputSchema = z.object({
  career: z.string().describe('The career path to find mentors for.'),
});
export type FindMentorsInput = z.infer<typeof FindMentorsInputSchema>;

const MentorSchema = z.object({
    name: z.string().describe("The full name of the professional."),
    description: z.string().describe("A one-sentence description of their role or expertise (e.g., 'Senior Software Engineer at Google')."),
    profileUrl: z.string().url().describe("The full URL to their public LinkedIn profile.")
});

const FindMentorsOutputSchema = z.object({
  mentors: z.array(MentorSchema).describe('A list of 3-4 relevant mentors.'),
});
export type FindMentorsOutput = z.infer<typeof FindMentorsOutputSchema>;

export async function findMentors(
  input: FindMentorsInput
): Promise<FindMentorsOutput> {
  return findMentorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findMentorsPrompt',
  input: {schema: FindMentorsInputSchema},
  output: {schema: FindMentorsOutputSchema},
  prompt: `You are a career networking expert in India.
Your task is to identify 3-4 prominent and established professionals in India who work in the field of {{{career}}}.

**CRITICAL Instructions:**
1.  Find real, public profiles of professionals on LinkedIn. The output MUST be factually correct.
2.  Prioritize individuals who are well-known or have a significant online presence (e.g., speakers, authors, senior leaders).
3.  For each professional, provide their full name, and a concise one-sentence description of their CURRENT role and company. This information must be accurate and reflect their present-day employment. Do not guess or provide outdated information.
4.  Provide a valid, direct URL to their LinkedIn profile.
5.  Ensure all profiles are for professionals currently working in India.
6.  If you cannot verify the CURRENT role and company with high confidence, do not include the person in the list.
`,
});

const findMentorsFlow = ai.defineFlow(
  {
    name: 'findMentorsFlow',
    inputSchema: FindMentorsInputSchema,
    outputSchema: FindMentorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
