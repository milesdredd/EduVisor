'use server';

/**
 * @fileOverview Personalized college suggestions based on career paths and user preferences.
 *
 * - getPersonalizedCollegeSuggestions - A function that returns a list of personalized college recommendations.
 * - PersonalizedCollegeSuggestionsInput - Input type for the function.
 * - PersonalizedCollegeSuggestionsOutput - Output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedCollegeSuggestionsInputSchema = z.object({
  suggestedCareers: z
    .array(z.string())
    .describe("A list of career paths suggested to the user."),
  educationLevel: z
    .string()
    .describe("The user's current education level (e.g., 'Completed Class 12', 'Undergraduate')."),
  fitScorerPreferences: z
    .object({
      distance: z.number(),
      programs: z.number(),
      labs: z.number(),
      hostel: z.number(),
      cutoffs: z.number(),
      placements: z.number(),
      accessibility: z.number(),
    })
    .describe(
      "The user's preferences for college attributes, weighted from 0 to 100."
    ),
});
export type PersonalizedCollegeSuggestionsInput = z.infer<
  typeof PersonalizedCollegeSuggestionsInputSchema
>;

const CollegeAttributesSchema = z.object({
  distance: z.number().min(0).max(100).describe("Score for proximity/distance."),
  programs: z.number().min(0).max(100).describe("Score for program relevance and quality."),
  labs: z.number().min(0).max(100).describe("Score for lab facilities."),
  hostel: z.number().min(0).max(100).describe("Score for hostel quality."),
  cutoffs: z.number().min(0).max(100).describe("Score for academic rigor/high cutoffs."),
  placements: z.number().min(0).max(100).describe("Score for placement success."),
  accessibility: z.number().min(0).max(100).describe("Score for accessibility."),
});

const PersonalizedCollegeSuggestionsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      collegeName: z.string().describe('The full name of the recommended Indian government college, including the relevant degree track.'),
      websiteUrl: z.string().url().describe('The official website URL of the recommended college.'),
      reason: z
        .string()
        .describe(
          'A brief explanation for why this college is a good fit based on the user\'s career goals.'
        ),
      attributes: CollegeAttributesSchema.describe("A breakdown of the college's scores for each attribute."),
    })
  ).describe('A list of personalized college recommendations with detailed attribute scores.'),
});
export type PersonalizedCollegeSuggestionsOutput = z.infer<
  typeof PersonalizedCollegeSuggestionsOutputSchema
>;

export async function getPersonalizedCollegeSuggestions(
  input: PersonalizedCollegeSuggestionsInput
): Promise<PersonalizedCollegeSuggestionsOutput> {
  return personalizedCollegeSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedCollegeSuggestionsPrompt',
  input: {schema: PersonalizedCollegeSuggestionsInputSchema},
  output: {schema: PersonalizedCollegeSuggestionsOutputSchema},
  prompt: `You are an expert career counselor for students in India. Your task is to recommend ONLY Indian government colleges.

**User's Current Education Level:** {{{educationLevel}}}
**User's Suggested Careers:**
{{#each suggestedCareers}}
- {{{this}}}
{{/each}}

**Your Task:**
1.  Recommend a list of 4-5 suitable INDIAN GOVERNMENT COLLEGES.
2.  For each recommendation, provide the official website URL.
3.  Based on the user's education level, include a relevant degree track in the college name (e.g., "IIT Bombay - B.Tech in Computer Science" or "IIM Ahmedabad - MBA").
    - If education level is 'Completed Class 12', suggest UNDERGRADUATE programs.
    - If education level is 'Undergraduate', suggest POSTGRADUATE programs.
4.  For each recommendation, provide a brief reason that connects the college to the user's career paths.
5.  CRITICAL: For each recommended college, you MUST provide a score from 0 to 100 for EACH of the following attributes based on real-world data and reputation: distance (assume a lower score for farther colleges), programs, labs, hostel, cutoffs (academic rigor), placements, and accessibility. These scores should be objective measures of the college's strengths.
6.  CRITICAL: Verify that each college is a government-funded and operated institution located within India. Do NOT include any private universities, foreign universities, or any institution that is not a government college in India. There are no exceptions.
`,
});

const personalizedCollegeSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedCollegeSuggestionsFlow',
    inputSchema: PersonalizedCollegeSuggestionsInputSchema,
    outputSchema: PersonalizedCollegeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
