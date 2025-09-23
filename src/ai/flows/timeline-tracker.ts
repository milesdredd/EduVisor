
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
import { isPast, parseISO, addYears } from 'date-fns';

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

**CRITICAL Instructions:**
1.  **Use Future Dates:** All dates MUST be in the future.
2.  **Recurring Events:** For major annual exams (like JEE, NEET, CAT, GATE, etc.), if the exact date for the next cycle is not yet announced, you MUST estimate a realistic date for the **next year** based on historical patterns (e.g., if JEE Main is usually in January, provide a date in January of next year). Do not use past dates.
3.  **Date Format:** Format the date STRICTLY as 'YYYY-MM-DD'.
4.  **Relevance:** Only include events that are highly relevant to the specified career and education level.
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

    const upcomingEvents = output.events.map(event => {
        try {
            let eventDate = parseISO(event.date);
            // If the event date is in the past, assume it's a recurring annual event and move it to next year.
            if (isPast(eventDate)) {
                eventDate = addYears(eventDate, 1);
            }
            return {
                ...event,
                date: eventDate.toISOString().split('T')[0], // Format back to 'YYYY-MM-DD'
            };
        } catch (e) {
            return null; // Exclude if date is invalid
        }
    }).filter((event): event is Exclude<typeof event, null> => event !== null);


    return { events: upcomingEvents };
  }
);
