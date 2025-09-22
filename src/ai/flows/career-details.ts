'use server';

/**
 * @fileOverview Generates detailed information for a specific career path.
 *
 * - getCareerDetails - A function that fetches detailed information about a career.
 * - CareerDetailsInput - The input type for the getCareerDetails function.
 * - CareerDetailsOutput - The return type for the getCareerDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const CareerDetailsInputSchema = z.object({
  career: z.string().describe('The career title to get details for.'),
});
export type CareerDetailsInput = z.infer<typeof CareerDetailsInputSchema>;

export const CareerDetailsOutputSchema = z.object({
  title: z.string().describe('The title of the career.'),
  jobDuties: z
    .array(z.string())
    .describe('A list of 3-4 key job duties or responsibilities.'),
  requiredSkills: z
    .array(z.string())
    .describe('A list of 4-5 essential technical and soft skills.'),
  potentialSalary: z
    .string()
    .describe('The potential salary range for this career in India, specified in INR (e.g., "₹8,00,000 - ₹15,00,000 per year").'),
  jobGrowth: z
    .string()
    .describe('The projected job growth percentage, including a qualitative assessment (e.g., "15% (Faster than average)").'),
  entrepreneurialOptions: z
    .array(z.string())
    .describe('A list of 2-3 potential entrepreneurial options or freelance paths.'),
  scholarships: z
    .array(z.string())
    .describe('A list of 3-4 real, relevant scholarships for this field available in India.'),
  academicPathway: z
    .string()
    .describe('A typical, summarized academic pathway for this career, starting from high school subjects.'),
  studyMaterials: z
    .array(z.object({title: z.string(), url: z.string()}))
    .describe('A list of 2-3 freely accessible study materials (like articles, tutorials, or documentation) with their titles and URLs.'),
});
export type CareerDetailsOutput = z.infer<typeof CareerDetailsOutputSchema>;

export async function getCareerDetails(
  input: CareerDetailsInput
): Promise<CareerDetailsOutput> {
  return careerDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerDetailsPrompt',
  input: {schema: CareerDetailsInputSchema},
  output: {schema: CareerDetailsOutputSchema},
  prompt: `You are an expert career counselor in India.
Generate a detailed overview for the career: {{{career}}}.
All information, especially scholarships and salary, must be relevant to India.
Provide real, specific examples for all fields. Format URLs as valid links.

- jobDuties: List 3-4 primary responsibilities.
- requiredSkills: List 4-5 key technical and soft skills.
- potentialSalary: Provide a realistic salary range in INR.
- jobGrowth: State the projected growth rate.
- entrepreneurialOptions: Suggest 2-3 freelance or business ideas.
- scholarships: Name 3-4 actual scholarships available in India.
- academicPathway: Summarize the educational path from school onwards.
- studyMaterials: List 2-3 free online resources with valid URLs.
`,
});

const careerDetailsFlow = ai.defineFlow(
  {
    name: 'careerDetailsFlow',
    inputSchema: CareerDetailsInputSchema,
    outputSchema: CareerDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
