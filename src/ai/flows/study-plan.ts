'use server';

/**
 * @fileOverview Generates a personalized study plan for a given career and timeframe.
 *
 * - getStudyPlan - A function that creates a study schedule.
 * - StudyPlanInput - The input type for the getStudyPlan function.
 * - StudyPlanOutput - The return type for the getStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyPlanInputSchema = z.object({
  career: z.string().describe('The chosen career path.'),
  timeframe: z
    .string()
    .describe('The total time available for preparation (e.g., "3 months").'),
});
export type StudyPlanInput = z.infer<typeof StudyPlanInputSchema>;

const WeeklyPlanSchema = z.object({
    week: z.string().describe("The week number (e.g., 'Week 1', 'Week 2-3')."),
    topics: z.array(z.string()).describe("A list of specific topics or subjects to cover during that week."),
    focus: z.string().describe("The main focus or goal for the week (e.g., 'Building Fundamentals', 'Advanced Topics & Practice').")
});

const StudyPlanOutputSchema = z.object({
  plan: z.array(WeeklyPlanSchema).describe('A structured, week-by-week study plan.'),
});
export type StudyPlanOutput = z.infer<typeof StudyPlanOutputSchema>;

export async function getStudyPlan(
  input: StudyPlanInput
): Promise<StudyPlanOutput> {
  return studyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studyPlanPrompt',
  input: {schema: StudyPlanInputSchema},
  output: {schema: StudyPlanOutputSchema},
  prompt: `You are an expert academic advisor for students in India.
Create a detailed, week-by-week study plan for a student preparing for entrance exams for a career in {{{career}}}.
The student has {{{timeframe}}} to prepare.

**Instructions:**
1.  Break down the preparation into a weekly schedule.
2.  For each week (or group of weeks, e.g., "Weeks 1-2"), specify the key topics/subjects to cover.
3.  For each week, provide a "focus" goal (e.g., "Mastering Core Concepts", "Mock Tests and Revision").
4.  The plan should be realistic and cover all major areas required for exams related to the {{{career}}} in India.
`,
});

const studyPlanFlow = ai.defineFlow(
  {
    name: 'studyPlanFlow',
    inputSchema: StudyPlanInputSchema,
    outputSchema: StudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
