'use server';

/**
 * @fileOverview A college search AI agent.
 *
 * - searchColleges - A function that handles the college search process.
 * - SearchCollegesInput - The input type for the searchColleges function.
 * - SearchCollegesOutput - The return type for the searchColleges function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SearchCollegesInputSchema = z.object({
  userLocation: z.string().describe("The user's current city and state for distance calculation."),
  maxDistance: z.number().optional().describe('Maximum distance from the user in kilometers.'),
  stream: z.string().optional().describe('The academic stream or career field the user is interested in.'),
  sortBy: z.enum(['ranking', 'fees', 'distance']).default('ranking').describe('The criteria to sort the results by.'),
  educationLevel: z.string().optional().describe("The user's current education level (e.g., 'Completed Class 12', 'Undergraduate')."),
});
export type SearchCollegesInput = z.infer<typeof SearchCollegesInputSchema>;

const SearchCollegesOutputSchema = z.object({
  colleges: z.array(
    z.object({
      collegeName: z.string().describe('The full name of the Indian government college.'),
      websiteUrl: z.string().url().describe('The official website URL of the college.'),
      location: z.string().describe('The city and state where the college is located.'),
      distance: z.number().describe('The approximate distance in kilometers from the user.'),
      ranking: z.string().describe('A notable ranking of the college (e.g., "NIRF #3").'),
      fees: z.string().describe('The approximate annual tuition fees in INR.'),
      courses: z.array(z.string()).describe('A list of 2-3 popular courses relevant to the search stream.'),
      rating: z.number().min(0).max(5).describe('An overall rating out of 5.'),
      entranceExams: z.array(z.string()).describe("A list of 1-2 primary entrance exams for admission (e.g., 'JEE Advanced', 'CAT')."),
      admissionCriteria: z.string().describe("A brief, one-sentence summary of the key admission criteria (e.g., 'Based on entrance exam rank and 12th-grade marks.')."),
    })
  ).describe('A list of Indian government colleges matching the search criteria.'),
});
export type SearchCollegesOutput = z.infer<typeof SearchCollegesOutputSchema>;

export async function searchColleges(
  input: SearchCollegesInput
): Promise<SearchCollegesOutput> {
  return searchCollegesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchCollegesPrompt',
  input: {schema: SearchCollegesInputSchema},
  output: {schema: SearchCollegesOutputSchema},
  prompt: `You are an expert on higher education in India. Your task is to find INDIAN GOVERNMENT COLLEGES based on the user's criteria.

User's Location: {{{userLocation}}}
Desired Stream/Career: {{{stream}}}
Maximum Distance: {{{maxDistance}}} km
Sort By: {{{sortBy}}}
Education Level: {{{educationLevel}}}

**Instructions:**
1.  Generate a list of 5-7 Indian government colleges that match the user's query.
2.  For each college, provide its official website URL.
3.  All information (fees, rankings) must be relevant to India.
4.  Calculate the approximate distance from the user's location.
5.  Provide a realistic overall rating out of 5.
6.  If a stream is provided, list courses relevant to that stream.
7.  **CRITICAL**: The listed courses and entrance exams MUST be relevant to the user's education level.
    - If education level is 'Completed Class 12', list UNDERGRADUATE courses and exams.
    - If education level is 'Undergraduate', list POSTGRADUATE courses and exams.
8.  For each college, list the 1-2 primary entrance exams required for the popular courses.
9.  For each college, provide a one-sentence summary of their key admission criteria.
10. CRITICAL: ONLY include government-funded colleges. Do NOT include any private universities.
11. Sort the final list according to the user's 'sortBy' preference.
`,
});

const searchCollegesFlow = ai.defineFlow(
  {
    name: 'searchCollegesFlow',
    inputSchema: SearchCollegesInputSchema,
    outputSchema: SearchCollegesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
