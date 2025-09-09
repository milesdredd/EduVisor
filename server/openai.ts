import { QuizQuestion } from "../client/src/lib/quiz-data";
import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface AICareerAnalysis {
  personalityInsights: string;
  careerRecommendations: string[];
  skillGaps: string[];
  nextSteps: string[];
  motivation: string;
}

export async function analyzeQuizResponses(
  responses: Record<string, string>,
  quizQuestions: QuizQuestion[]
): Promise<AICareerAnalysis> {
  try {
    // Prepare the quiz data for AI analysis
    const detailedResponses = Object.entries(responses).map(([questionId, optionId]) => {
      const question = quizQuestions.find(q => q.id === questionId);
      const option = question?.options.find(o => o.id === optionId);
      
      return {
        category: question?.category,
        question: question?.question,
        selectedOption: option?.text,
        description: option?.description
      };
    });

    const prompt = `
You are an expert career counselor and psychologist. Analyze the following career aptitude quiz responses and provide detailed, personalized career guidance.

Quiz Responses:
${JSON.stringify(detailedResponses, null, 2)}

Based on these responses, provide a comprehensive analysis in JSON format with the following structure:
{
  "personalityInsights": "A 2-3 sentence analysis of the person's personality traits, work style, and preferences",
  "careerRecommendations": ["3-5 specific career paths that align with their profile", "Include both traditional and emerging careers"],
  "skillGaps": ["2-3 key skills they should develop", "Be specific and actionable"],
  "nextSteps": ["3-4 immediate actionable steps they can take", "Include both short-term and medium-term goals"],
  "motivation": "An encouraging 2-sentence message that acknowledges their strengths and potential"
}

Focus on being:
- Specific and actionable
- Encouraging yet realistic
- Inclusive of diverse career paths
- Mindful of current job market trends
- Supportive of personal growth
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert career counselor with deep knowledge of personality psychology, career development, and current job market trends. Provide personalized, actionable career guidance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 1500
    });

    const analysis = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      personalityInsights: analysis.personalityInsights || "Your responses show unique strengths and preferences that can guide your career path.",
      careerRecommendations: analysis.careerRecommendations || ["Explore careers that align with your interests"],
      skillGaps: analysis.skillGaps || ["Continue developing your existing strengths"],
      nextSteps: analysis.nextSteps || ["Take time to explore your interests further"],
      motivation: analysis.motivation || "Your thoughtful responses show great self-awareness. Trust in your ability to find a fulfilling career path."
    };

  } catch (error) {
    console.error("Error analyzing quiz responses:", error);
    
    // Fallback response if AI fails
    return {
      personalityInsights: "Your quiz responses indicate thoughtful consideration of your preferences and strengths.",
      careerRecommendations: [
        "Explore careers that match your interests",
        "Consider fields that utilize your natural abilities",
        "Look into emerging opportunities in your areas of strength"
      ],
      skillGaps: [
        "Continue developing technical skills relevant to your field",
        "Strengthen communication and collaboration abilities"
      ],
      nextSteps: [
        "Research specific career paths that interest you",
        "Connect with professionals in your fields of interest",
        "Consider relevant courses or certifications",
        "Gain practical experience through internships or projects"
      ],
      motivation: "Your self-awareness and commitment to growth are valuable assets. Keep exploring and building on your strengths."
    };
  }
}

export async function generateCareerPathInsight(
  careerTitle: string,
  userProfile: any,
  matchPercentage: number
): Promise<string> {
  try {
    const prompt = `
As a career counselor, provide a personalized insight for why this career path matches this user.

Career: ${careerTitle}
Match Percentage: ${matchPercentage}%
User Profile: ${JSON.stringify(userProfile)}

Provide a 2-3 sentence personalized explanation of why this career is a good fit for them, focusing on their specific strengths and interests. Be encouraging and specific.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are a supportive career counselor who provides personalized, encouraging career guidance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return response.choices[0].message.content || `This career path aligns well with your interests and skills at ${matchPercentage}% match.`;

  } catch (error) {
    console.error("Error generating career insight:", error);
    return `This career path shows a ${matchPercentage}% match with your profile, indicating strong alignment with your interests and abilities.`;
  }
}