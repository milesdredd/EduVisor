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

export const PersonalizedCollegeSuggestionsInputSchema = z.object({
  suggestedCareers: z
    .array(z.string())
    .describe("A list of career paths suggested to the user."),
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

export const PersonalizedCollegeSuggestionsOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      collegeName: z.string().describe('The full name of the recommended Indian government college.'),
      reason: z
        .string()
        .describe(
          'A brief explanation for why this college is a good fit based on the user\'s career goals and preferences.'
        ),
    })
  ).describe('A list of personalized college recommendations.'),
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
  prompt: `You are an expert career counselor for students in India. Your task is to recommend ONLY Indian government colleges based on the user's career aspirations and their stated preferences.

**User's Suggested Careers:**
{{#each suggestedCareers}}
- {{{this}}}
{{/each}}

**User's College Preferences (weighted 0-100):**
- Importance of Distance: {{{fitScorerPreferences.distance}}}
- Importance of Programs Offered: {{{fitScorerPreferences.programs}}}
- Importance of Lab Facilities: {{{fitScorerPreferences.labs}}}
- Importance of Hostel Quality: {{{fitScorerPreferences.hostel}}}
- Importance of High Cutoffs (academic rigor): {{{fitScorerPreferences.cutoffs}}}
- Importance of Placement Success: {{{fitScorerPreferences.placements}}}
- Importance of Accessibility: {{{fitScorerPreferences.accessibility}}}

**Your Task:**
1.  Analyze the user's career goals and their preferences.
2.  Recommend a list of 3-4 suitable INDIAN GOVERNMENT COLLEGES.
3.  For each recommendation, provide a brief reason that connects the college to the user's career paths and most heavily weighted preferences.
4.  CRITICAL: Verify that each college is a government-funded and operated institution located within India. Do NOT include any private universities, foreign universities, or any institution that is not a government college in India. There are no exceptions.
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
