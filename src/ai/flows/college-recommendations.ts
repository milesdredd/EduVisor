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

const CollegeRecommendationSchema = z.object({
    collegeName: z.string().describe('The name of the potential college and its relevant educational track.'),
    websiteUrl: z.string().url().describe('The official website URL of the college.')
});

const CollegeRecommendationsOutputSchema = z.object({
  collegeRecommendations: z.array(CollegeRecommendationSchema).describe(
    'A list of potential colleges, their educational tracks, and official websites based on the suggested careers.'
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

Based on the following suggested careers: {{suggestedCareers}}, recommend a list of potential Indian government colleges, their relevant educational tracks, and their official website URLs.

Follow these steps:
1.  Identify a potential college and its relevant program for the given careers.
2.  Find the official, valid website URL for that college.
3.  CRITICAL: Verify if the college is a government-funded and operated institution located within India.
4.  If and ONLY IF the college is an Indian government college, add it to the list with its name and official URL.
5.  Do NOT include any private universities, foreign universities, or any institution that is not a government college in India. There are no exceptions.
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
      return { collegeRecommendations: [] };
    }
    
    // Programmatic filtering to GUARANTEE only Indian government colleges are returned.
    const indianGovCollegeKeywords = [
        'iit', 'nit', 'iiit', 'indian institute', 'national institute', 'government college', 'govt. college', 'university of delhi', 'jnu', 'bhu'
    ];

    const filteredRecommendations = output.collegeRecommendations.filter(rec => {
        const lowerCaseRec = rec.collegeName.toLowerCase();
        return indianGovCollegeKeywords.some(keyword => lowerCaseRec.includes(keyword));
    });

    return { collegeRecommendations: filteredRecommendations };
  }
);
