'use server';

/**
 * @fileOverview Generates an extended list of resources for a specific career path.
 *
 * - getMoreResources - A function that fetches various study materials for a career.
 * - MoreResourcesInput - The input type for the getMoreResources function.
 * - MoreResourcesOutput - The return type for the getMoreResources function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MoreResourcesInputSchema = z.object({
  career: z.string().describe('The chosen career path to find resources for.'),
});
export type MoreResourcesInput = z.infer<typeof MoreResourcesInputSchema>;

const ResourceItemSchema = z.object({
  title: z.string().describe("The title of the resource."),
  type: z.enum(['article', 'video', 'book', 'course']).describe("The type of the resource."),
  url: z.string().url().describe("The URL to access the resource."),
  summary: z.string().describe("A one-sentence summary of what the resource offers."),
});

const MoreResourcesOutputSchema = z.object({
  resources: z.array(ResourceItemSchema).describe('A list of 8-10 varied and high-quality resources.'),
});
export type MoreResourcesOutput = z.infer<typeof MoreResourcesOutputSchema>;

export async function getMoreResources(
  input: MoreResourcesInput
): Promise<MoreResourcesOutput> {
  return moreResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moreResourcesPrompt',
  input: {schema: MoreResourcesInputSchema},
  output: {schema: MoreResourcesOutputSchema},
  prompt: `You are an expert content curator for students in India.
Generate a comprehensive list of 8-10 high-quality, freely accessible online resources for a student pursuing a career in {{{career}}}.

**Instructions:**
1.  **Variety is Key:** Include a mix of resource types: 'article', 'video', 'book', and 'course'.
2.  **Quality over Quantity:** Provide links to well-known, reputable sources (e.g., official documentation, established educational channels, respected industry blogs).
3.  **Actionable Information:** For each resource, provide a valid URL and a concise one-sentence summary.
4.  **Relevance:** All resources must be highly relevant to the {{{career}}} path.
`,
});

const moreResourcesFlow = ai.defineFlow(
  {
    name: 'moreResourcesFlow',
    inputSchema: MoreResourcesInputSchema,
    outputSchema: MoreResourcesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
