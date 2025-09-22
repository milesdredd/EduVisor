'use server';

/**
 * @fileOverview A college recommendation AI agent.
 *
 * - getCollegeRecommendations - A function that handles the college recommendation process.
 * - CollegeRecommendationsInput - The input type for the getCollegeRecommendations function.
 * - CollegeRecommendationsOutput - The return type for the getCollegeRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CollegeRecommendationsInputSchema = z.object({
  suggestedCareers: z
    .array(z.string())
    .describe('A list of suggested careers for the student.'),
});
export type CollegeRecommendationsInput = z.infer<
  typeof CollegeRecommendationsInputSchema
>;

const CollegeRecommendationsOutputSchema = z.object({
  collegeRecommendations: z.array(z.string()).describe(
    'A list of potential colleges and educational tracks based on the suggested careers.'
  ),
});
export type CollegeRecommendationsOutput = z.infer<
  typeof CollegeRecommendationsOutputSchema
>;

export async function getCollegeRecommendations(
  input: CollegeRecommendationsInput
): Promise<CollegeRecommendationsOutput> {
  return collegeRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'collegeRecommendationsPrompt',
  input: {schema: CollegeRecommendationsInputSchema},
  output: {schema: CollegeRecommendationsOutputSchema},
  prompt: `Based on the following suggested careers: {{suggestedCareers}},
  recommend a list of potential Indian government colleges and their relevant educational tracks.
  CRITICAL: You MUST only include government colleges within India. Do not include any private or non-Indian colleges under any circumstances.`,
});

const collegeRecommendationsFlow = ai.defineFlow(
  {
    name: 'collegeRecommendationsFlow',
    inputSchema: CollegeRecommendationsInputSchema,
    outputSchema: CollegeRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    if (!output) {
      return { collegeRecommendations: [] };
    }
    
    // Programmatic filtering to guarantee only Indian government colleges are returned.
    const indianGovCollegeKeywords = [
        'India', 'IIT', 'NIT', 'IIIT', 'Indian Institute', 'National Institute', 'Government College'
    ];

    const filteredRecommendations = output.collegeRecommendations.filter(rec => 
        indianGovCollegeKeywords.some(keyword => rec.toLowerCase().includes(keyword.toLowerCase()))
    );

    // If the filtered list is empty, it means the model didn't return any valid colleges.
    // Return a user-friendly message in that case.
    if (filteredRecommendations.length === 0) {
        return { collegeRecommendations: ["Could not find relevant Indian government colleges for the suggested careers. Please try again or with different quiz answers."] };
    }

    return { collegeRecommendations: filteredRecommendations };
  }
);
