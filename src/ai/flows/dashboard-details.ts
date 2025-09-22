'use server';

/**
 * @fileOverview Generates dynamic content for the user's career dashboard.
 *
 * - getDashboardDetails - A function that fetches syllabus, resources, and news for a career.
 * - DashboardDetailsInput - The input type for the getDashboardDetails function.
 * - DashboardDetailsOutput - The return type for the getDashboardDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DashboardDetailsInputSchema = z.object({
  career: z.string().describe('The chosen career path.'),
});
export type DashboardDetailsInput = z.infer<typeof DashboardDetailsInputSchema>;

const SyllabusItemSchema = z.object({
    id: z.string().describe("A unique ID for the syllabus item (e.g., 'syllabus1')."),
    label: z.string().describe("The name of the subject or skill (e.g., 'Data Structures & Algorithms').")
});

const ResourceItemSchema = z.object({
    title: z.string().describe("The title of the resource (e.g., 'Cracking the PM Interview')."),
    type: z.enum(['book', 'article', 'video']).describe("The type of the resource.")
});

const NewsItemSchema = z.object({
    headline: z.string().describe("A short headline for the news item."),
    summary: z.string().describe("A one-sentence summary of the news.")
});

const DashboardDetailsOutputSchema = z.object({
  syllabus: z
    .array(SyllabusItemSchema)
    .describe('A list of 3-4 key subjects or milestones for the syllabus.'),
  resources: z
    .array(ResourceItemSchema)
    .describe('A list of 2-3 top books or articles as resources.'),
  news: z
    .array(NewsItemSchema)
    .describe('A list of 1-2 recent news items or trends.'),
});
export type DashboardDetailsOutput = z.infer<typeof DashboardDetailsOutputSchema>;

export async function getDashboardDetails(
  input: DashboardDetailsInput
): Promise<DashboardDetailsOutput> {
  return dashboardDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dashboardDetailsPrompt',
  input: {schema: DashboardDetailsInputSchema},
  output: {schema: DashboardDetailsOutputSchema},
  prompt: `You are an expert career counselor in India.
Generate a concise set of dashboard items for a student pursuing a career in {{{career}}}.
Provide real, relevant, and specific examples.

- syllabus: List 3-4 essential subjects, skills, or milestones. Give each a unique ID.
- resources: List 2-3 highly-recommended and well-known books or articles.
- news: Provide 1-2 current and relevant news headlines and a one-sentence summary for each.
`,
});

const dashboardDetailsFlow = ai.defineFlow(
  {
    name: 'dashboardDetailsFlow',
    inputSchema: DashboardDetailsInputSchema,
    outputSchema: DashboardDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
