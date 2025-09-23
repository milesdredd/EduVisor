'use server';

/**
 * @fileOverview Generates a list of relevant timeline events (exams, deadlines) for a specific career path.
 *
 * - getTimelineEvents - A function that fetches relevant events for a career.
 * - TimelineEventsInput - The input type for the getTimelineEvents function.
 * - TimelineEventsOutput - The return type for the getTimelineEvents function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TimelineEventsInputSchema = z.object({
  career: z.string().describe('The chosen career path.'),
  educationLevel: z
    .string()
    .describe(
      "The user's current education level (e.g., 'Completed Class 12', 'Undergraduate')."
    ),
});
export type TimelineEventsInput = z.infer<typeof TimelineEventsInputSchema>;

const TimelineEventSchema = z.object({
  title: z
    .string()
    .describe(
      "The name of the event (e.g., 'JEE Main Application Deadline')."
    ),
  date: z
    .string()
    .describe(
      "The date of the event in 'YYYY-MM-DD' format (e.g., '2024-01-15')."
    ),
  type: z
    .enum(['exam', 'deadline'])
    .describe("The type of the event, either 'exam' or 'deadline'."),
});

const TimelineEventsOutputSchema = z.object({
  events: z
    .array(TimelineEventSchema)
    .describe(
      'A list of 2-3 key upcoming entrance exams or application deadlines relevant to the career path in India.'
    ),
});
export type TimelineEventsOutput = z.infer<typeof TimelineEventsOutputSchema>;

export async function getTimelineEvents(
  input: TimelineEventsInput
): Promise<TimelineEventsOutput> {
  return timelineEventsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'timelineEventsPrompt',
  input: {schema: TimelineEventsInputSchema},
  output: {schema: TimelineEventsOutputSchema},
  prompt: `You are an expert career counselor for students in India.
Based on the chosen career path of {{{career}}} and the user's education level of {{{educationLevel}}}, generate a list of 2-3 most important and immediate, real upcoming entrance exams or application deadlines in India.

- If education level is 'Completed Class 12' or similar, focus on UNDERGRADUATE entrance exams.
- If education level is 'Undergraduate', focus on POSTGRADUATE entrance exams (e.g., CAT, GATE).

CRITICAL: Use the current year for dates and format the date STRICTLY as 'YYYY-MM-DD'.
Only include events that are highly relevant to the specified career and education level.
`,
});

const timelineEventsFlow = ai.defineFlow(
  {
    name: 'timelineEventsFlow',
    inputSchema: TimelineEventsInputSchema,
    outputSchema: TimelineEventsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);

    if (!output?.events) {
      return {events: []};
    }

    return output;
  }
);
