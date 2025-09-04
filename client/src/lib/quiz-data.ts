export interface QuizQuestion {
  id: string;
  category: "interests" | "personality" | "aptitude" | "skills";
  question: string;
  options: {
    id: string;
    text: string;
    description: string;
    scores: {
      [key: string]: number;
    };
  }[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    category: "interests",
    question: "Which activities do you find most engaging?",
    options: [
      {
        id: "opt1",
        text: "Problem-solving and analysis",
        description: "Working with data, research, and logical reasoning",
        scores: { engineering: 3, tech: 3, business: 1, healthcare: 1, education: 1 }
      },
      {
        id: "opt2", 
        text: "Creative expression",
        description: "Art, design, writing, and innovative thinking",
        scores: { engineering: 1, tech: 2, business: 2, healthcare: 1, education: 2 }
      },
      {
        id: "opt3",
        text: "Helping others",
        description: "Teaching, counseling, and community service", 
        scores: { engineering: 1, tech: 1, business: 1, healthcare: 3, education: 3 }
      },
      {
        id: "opt4",
        text: "Leadership and business",
        description: "Managing teams, entrepreneurship, and strategic planning",
        scores: { engineering: 2, tech: 2, business: 3, healthcare: 1, education: 2 }
      }
    ]
  },
  {
    id: "q2",
    category: "personality",
    question: "How do you prefer to work?",
    options: [
      {
        id: "opt1",
        text: "Independently with minimal supervision",
        description: "Self-directed projects and autonomous work",
        scores: { engineering: 2, tech: 3, business: 1, healthcare: 2, education: 1 }
      },
      {
        id: "opt2",
        text: "In small collaborative teams",
        description: "Close-knit groups working toward common goals",
        scores: { engineering: 3, tech: 2, business: 2, healthcare: 2, education: 2 }
      },
      {
        id: "opt3",
        text: "Leading and managing others",
        description: "Guiding teams and making strategic decisions",
        scores: { engineering: 1, tech: 2, business: 3, healthcare: 2, education: 2 }
      },
      {
        id: "opt4",
        text: "In large dynamic organizations",
        description: "Working within established corporate structures",
        scores: { engineering: 2, tech: 2, business: 3, healthcare: 3, education: 1 }
      }
    ]
  },
  {
    id: "q3",
    category: "aptitude",
    question: "Which subjects did you excel in during school?",
    options: [
      {
        id: "opt1",
        text: "Mathematics and Physics",
        description: "Strong analytical and quantitative skills",
        scores: { engineering: 3, tech: 3, business: 2, healthcare: 2, education: 2 }
      },
      {
        id: "opt2",
        text: "Biology and Chemistry", 
        description: "Life sciences and scientific method",
        scores: { engineering: 1, tech: 1, business: 1, healthcare: 3, education: 2 }
      },
      {
        id: "opt3",
        text: "Language and Literature",
        description: "Communication and critical analysis",
        scores: { engineering: 1, tech: 1, business: 2, healthcare: 1, education: 3 }
      },
      {
        id: "opt4",
        text: "Economics and Social Studies",
        description: "Understanding systems and human behavior",
        scores: { engineering: 1, tech: 2, business: 3, healthcare: 1, education: 2 }
      }
    ]
  },
  {
    id: "q4",
    category: "skills",
    question: "What type of problems do you enjoy solving most?",
    options: [
      {
        id: "opt1",
        text: "Technical and logical puzzles",
        description: "Code debugging, mathematical proofs, system optimization",
        scores: { engineering: 3, tech: 3, business: 1, healthcare: 1, education: 1 }
      },
      {
        id: "opt2",
        text: "People and relationship challenges",
        description: "Conflict resolution, team dynamics, counseling",
        scores: { engineering: 1, tech: 1, business: 2, healthcare: 3, education: 3 }
      },
      {
        id: "opt3",
        text: "Strategic and business problems",
        description: "Market analysis, process improvement, resource allocation",
        scores: { engineering: 2, tech: 2, business: 3, healthcare: 1, education: 1 }
      },
      {
        id: "opt4",
        text: "Research and discovery",
        description: "Scientific investigation, data analysis, exploration",
        scores: { engineering: 2, tech: 2, business: 1, healthcare: 3, education: 2 }
      }
    ]
  },
  {
    id: "q5",
    category: "interests",
    question: "In your free time, you're most likely to:",
    options: [
      {
        id: "opt1",
        text: "Build or create something",
        description: "Programming projects, DIY crafts, engineering models",
        scores: { engineering: 3, tech: 3, business: 1, healthcare: 1, education: 1 }
      },
      {
        id: "opt2",
        text: "Read and research topics of interest",
        description: "Academic articles, news, educational content",
        scores: { engineering: 2, tech: 2, business: 2, healthcare: 2, education: 3 }
      },
      {
        id: "opt3",
        text: "Volunteer or help in community",
        description: "Social service, tutoring, healthcare volunteering",
        scores: { engineering: 1, tech: 1, business: 1, healthcare: 3, education: 3 }
      },
      {
        id: "opt4",
        text: "Network and attend business events",
        description: "Professional meetups, conferences, entrepreneurship events",
        scores: { engineering: 1, tech: 2, business: 3, healthcare: 1, education: 1 }
      }
    ]
  }
];

export function calculateCareerScores(responses: Record<string, string>): Record<string, number> {
  const scores = {
    engineering: 0,
    tech: 0,
    business: 0,
    healthcare: 0,
    education: 0
  };

  Object.entries(responses).forEach(([questionId, optionId]) => {
    const question = quizQuestions.find(q => q.id === questionId);
    const option = question?.options.find(o => o.id === optionId);
    
    if (option) {
      Object.entries(option.scores).forEach(([career, score]) => {
        if (career in scores) {
          scores[career as keyof typeof scores] += score;
        }
      });
    }
  });

  return scores;
}

export function getCareerMatches(scores: Record<string, number>) {
  const totalQuestions = quizQuestions.length;
  const maxPossibleScore = totalQuestions * 3;

  return Object.entries(scores)
    .map(([career, score]) => ({
      career,
      percentage: Math.round((score / maxPossibleScore) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);
}
