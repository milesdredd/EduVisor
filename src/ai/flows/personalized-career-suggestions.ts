'use server';

/**
 * @fileOverview Personalized career suggestions flow.
 *
 * This file defines a Genkit flow that takes quiz results as input and
 * returns a list of personalized career suggestions.
 *
 * @example
 * // Example usage:
 * const quizResults = { interest: 'technology', skills: ['coding', 'problemSolving'], personality: 'introverted' };
 * const suggestions = await personalizedCareerSuggestions(quizResults);
 *
 * @interface PersonalizedCareerSuggestionsInput - Input type for the personalizedCareerSuggestions function.
 * @interface PersonalizedCareerSuggestionsOutput - Output type for the personalizedCareerSuggestions function.
 * @function personalizedCareerSuggestions - The main function that triggers the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedCareerSuggestionsInputSchema = z.object({
  interest: z.string().describe("The user's primary area of interest."),
  aptitude: z.string().describe("The user's aptitude for logical problems."),
  skills: z.array(z.string()).describe("A list of the user's skills."),
  personality: z.string().describe("The user's personality type (e.g., introverted, extroverted)."),
});
export type PersonalizedCareerSuggestionsInput = z.infer<typeof PersonalizedCareerSuggestionsInputSchema>;

const PersonalizedCareerSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      career: z.string().describe('The name of the suggested career.'),
      description: z.string().describe('A brief description of the career.'),
      suitabilityScore: z.number().describe('A score indicating how well the career matches the user\'s profile (0-100).'),
    })
  ).describe('A list of personalized career suggestions.'),
});
export type PersonalizedCareerSuggestionsOutput = z.infer<typeof PersonalizedCareerSuggestionsOutputSchema>;

export async function personalizedCareerSuggestions(input: PersonalizedCareerSuggestionsInput): Promise<PersonalizedCareerSuggestionsOutput> {
  return personalizedCareerSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedCareerSuggestionsPrompt',
  input: {schema: PersonalizedCareerSuggestionsInputSchema},
  output: {schema: PersonalizedCareerSuggestionsOutputSchema},
  prompt: `Based on the following quiz results, suggest a list of personalized career paths. Provide a suitability score from 0-100. Keep the description to one short sentence.

Quiz Results:
Interest: {{{interest}}}
Aptitude: {{{aptitude}}}
Skills: {{#each skills}}- {{{this}}}\n{{/each}}
Personality: {{{personality}}}

Format the output as a JSON array of career suggestions, each with a career name, short description, and suitability score.
`,
});

const personalizedCareerSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedCareerSuggestionsFlow',
    inputSchema: PersonalizedCareerSuggestionsInputSchema,
    outputSchema: PersonalizedCareerSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
