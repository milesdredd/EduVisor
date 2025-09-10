import OpenAI from 'openai';

const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function getCareerSuggestions(responses: Record<string, string>): Promise<any> {
  const prompt = `
    Based on the following quiz responses, suggest the top 5 career paths for the user.
    The user is located in India and prefers Hindi and English.

    Responses:
    ${JSON.stringify(responses, null, 2)}

    Provide the output in the following JSON format:
    {
      "suggestions": [
        {
          "career": "Software Engineer",
          "description": "Designs, develops, and maintains software applications."
        },
        ...
      ]
    }
    Give me career suggestions in JSON only. Do not include backticks, markdown, or explanations.
  `;

  try {
    const completion = await openrouter.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [
        { role: "system", content: "You are a helpful career advisor." },
        { role: "user", content: prompt }
      ],
    });

    let content = completion.choices[0].message.content;

    // Remove markdown code fences (```json or ```)
    content = content.replace(/```json|```/g, '').trim();

    return JSON.parse(content);
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);
    throw error;
  }
}
