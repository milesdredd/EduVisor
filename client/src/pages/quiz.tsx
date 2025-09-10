import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { quizQuestions } from "@/lib/quiz-data";
import { Heart, Brain, Lightbulb, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useEffect } from "react";

export default function Quiz() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>("");

  const careerMapping: Record<string, string> = {
    "software developer": "Computer Science & IT",
    "data scientist": "Computer Science & IT",
    "it consultant": "Computer Science & IT",
    "systems analyst": "Computer Science & IT",
    "cybersecurity analyst": "Computer Science & IT",
    "mechanical engineer": "Engineering",
    "civil engineer": "Engineering",
    "electrical engineer": "Engineering",
    "business analyst": "Business & Management",
    "marketing manager": "Business & Management",
    "operations manager": "Business & Management",
    "doctor": "Healthcare & Medicine",
    "nurse": "Healthcare & Medicine",
    "pharmacist": "Healthcare & Medicine",
    "school teacher": "Education & Teaching",
    "college professor": "Education & Teaching",
    "education consultant": "Education & Teaching",
  };

  const { data: careers } = useQuery<any[]>({ queryKey: ["/api/careers"] });

  console.log("Careers data in Quiz component:", careers);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized", 
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const analyzeQuizMutation = useMutation({
    mutationFn: async (responses: Record<string, string>) => {
      const response = await apiRequest("POST", "/api/analyze", { responses });
      return response.json();
    },
    onSuccess: (data, responses) => {
      console.log("AI Suggestions:", data.suggestions);
      console.log("Available Careers:", careers);
      const careerMatches = data.suggestions.map((suggestion: any) => {
        const mappedCareerTitle = careerMapping[suggestion.career.toLowerCase()];
        const career = careers?.find(c => c.title === mappedCareerTitle);
        if (career) {
          return {
            careerPathId: career.id,
            matchPercentage: 100, // AI suggestions are all considered top matches.
          };
        }
        return null;
      }).filter(Boolean);
      console.log("Generated Career Matches:", careerMatches);

      submitQuizMutation.mutate({
        responses,
        results: data,
        careerMatches,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to analyze quiz. Please try again.",
        variant: "destructive",
      });
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (data: {
      responses: Record<string, string>;
      results: any;
      careerMatches: any[];
    }) => {
      const response = await apiRequest("POST", "/api/quiz/submit", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Assessment Complete!",
        description: "Your results have been saved successfully.",
      });
      setLocation("/quiz-results");
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    if (!selectedOption) return;

    const newResponses = {
      ...responses,
      [quizQuestions[currentQuestion].id]: selectedOption,
    };
    setResponses(newResponses);
    setSelectedOption("");

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      analyzeQuizMutation.mutate(newResponses);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(responses[quizQuestions[currentQuestion - 1].id] || "");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "interests":
        return <Heart className="w-6 h-6 text-primary" />;
      case "personality":
        return <Star className="w-6 h-6 text-secondary" />;
      case "aptitude":
        return <Lightbulb className="w-6 h-6 text-accent" />;
      case "skills":
        return <Brain className="w-6 h-6 text-green-500" />;
      default:
        return <Star className="w-6 h-6 text-primary" />;
    }
  };

  const progressPercentage = ((currentQuestion + 1) / quizQuestions.length) * 100;

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="pt-20 min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-6 py-12">
        {/* Quiz Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Career Assessment Quiz</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Discover your strengths and find your ideal career path
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span data-testid="quiz-progress-text">
                {currentQuestion + 1} of {quizQuestions.length}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="progress-bar h-2 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
                data-testid="quiz-progress-bar"
              ></div>
            </div>
          </div>
        </div>

        {/* Quiz Container */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-lg border border-border quiz-card shimmer card-gradient">
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-4">
                {getCategoryIcon(question.category)}
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize">
                  {question.category}
                </span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-foreground" data-testid="quiz-question">
                {question.question}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`quiz-option text-left p-6 rounded-xl border-2 transition-all duration-300 hover-scale ${
                    selectedOption === option.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary hover:bg-primary/5"
                  }`}
                  data-testid={`quiz-option-${option.id}`}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1 ${
                        selectedOption === option.id
                          ? "border-primary bg-primary"
                          : "border-border"
                      }`}
                    ></div>
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">{option.text}</h4>
                      <p className="text-muted-foreground text-sm">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="flex items-center px-6 py-3 text-muted-foreground border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-previous-question"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={!selectedOption || analyzeQuizMutation.isPending || submitQuizMutation.isPending || (currentQuestion === quizQuestions.length - 1 && !careers)}
              className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-next-question"
            >
              {submitQuizMutation.isPending ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Processing...
                </>
              ) : currentQuestion === quizQuestions.length - 1 ? (
                <>
                  View Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next Question
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quiz Categories Preview */}
        <div className="max-w-4xl mx-auto mt-16">
          <h3 className="text-2xl font-semibold mb-8 text-center text-foreground">Assessment Categories</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border hover-scale">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Interests</h4>
              <p className="text-sm text-muted-foreground">What you love doing</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border hover-scale">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-secondary" />
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Aptitude</h4>
              <p className="text-sm text-muted-foreground">Your natural abilities</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border hover-scale">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Personality</h4>
              <p className="text-sm text-muted-foreground">How you interact</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border hover-scale">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-green-500" />
              </div>
              <h4 className="font-semibold mb-2 text-foreground">Skills</h4>
              <p className="text-sm text-muted-foreground">Current strengths</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
