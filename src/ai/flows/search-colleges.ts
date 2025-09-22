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
});
export type SearchCollegesInput = z.infer<typeof SearchCollegesInputSchema>;

const SearchCollegesOutputSchema = z.object({
  colleges: z.array(
    z.object({
      collegeName: z.string().describe('The full name of the Indian government college.'),
      location: z.string().describe('The city and state where the college is located.'),
      distance: z.number().describe('The approximate distance in kilometers from the user.'),
      ranking: z.string().describe('A notable ranking of the college (e.g., "NIRF #3").'),
      fees: z.string().describe('The approximate annual tuition fees in INR.'),
      courses: z.array(z.string()).describe('A list of 2-3 popular courses relevant to the search stream.'),
      rating: z.number().min(0).max(5).describe('An overall rating out of 5.'),
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

**Instructions:**
1.  Generate a list of 5-7 Indian government colleges that match the user's query.
2.  All information (fees, rankings) must be relevant to India.
3.  Calculate the approximate distance from the user's location.
4.  Provide a realistic overall rating out of 5.
5.  If a stream is provided, list courses relevant to that stream.
6.  CRITICAL: ONLY include government-funded colleges. Do NOT include any private universities.
7.  Sort the final list according to the user's 'sortBy' preference.
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
