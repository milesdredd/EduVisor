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
  prompt: `You are an expert career counselor for students in India. Your task is to recommend ONLY Indian government colleges.

Based on the following suggested careers: {{suggestedCareers}}, recommend a list of potential Indian government colleges and their relevant educational tracks.

Follow these steps:
1.  Identify a potential college and its relevant program for the given careers.
2.  CRITICAL: Verify if the college is a government-funded and operated institution located within India.
3.  If and ONLY IF the college is an Indian government college, add it to the list.
4.  Do NOT include any private universities, foreign universities, or any institution that is not a government college in India. There are no exceptions.
`,
});

const collegeRecommendationsFlow = ai.defineFlow(
  {
    name: 'collegeRecommendationsFlow',
    inputSchema: CollegeRecommendationsInputSchema,
    outputSchema: CollegeRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    if (!output || !output.collegeRecommendations) {
      return { collegeRecommendations: ["Could not generate college recommendations at this time. Please try again later."] };
    }
    
    // Programmatic filtering to GUARANTEE only Indian government colleges are returned.
    const indianGovCollegeKeywords = [
        'iit', 'nit', 'iiit', 'indian institute', 'national institute', 'government college', 'govt. college', 'university of delhi', 'jnu', 'bhu'
    ];

    const filteredRecommendations = output.collegeRecommendations.filter(rec => {
        const lowerCaseRec = rec.toLowerCase();
        return indianGovCollegeKeywords.some(keyword => lowerCaseRec.includes(keyword));
    });

    // If the filtered list is empty, it means the model didn't return any valid colleges.
    if (filteredRecommendations.length === 0) {
        return { collegeRecommendations: ["Could not find relevant Indian government colleges for the suggested careers. Please try again or with different quiz answers."] };
    }

    return { collegeRecommendations: filteredRecommendations };
  }
);
