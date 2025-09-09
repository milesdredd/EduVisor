import { UserCareerMatch } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Trophy, Code, Briefcase, Heart, BookOpen, Settings, ArrowRight } from "lucide-react";
import { useEffect } from "react";

export default function QuizResults() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

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

  const {
    data: careerMatches,
    isLoading: resultsLoading,
    error,
  } = useQuery({
    queryKey: ["/api/quiz/results"],
    enabled: isAuthenticated,
    retry: false,
  });

  const getCareerIcon = (title: string) => {
    if (title.includes("Computer") || title.includes("IT")) return <Code className="w-6 h-6 text-white" />;
    if (title.includes("Engineering")) return <Settings className="w-6 h-6 text-white" />;
    if (title.includes("Business")) return <Briefcase className="w-6 h-6 text-white" />;
    if (title.includes("Healthcare") || title.includes("Medicine")) return <Heart className="w-6 h-6 text-white" />;
    if (title.includes("Education")) return <BookOpen className="w-6 h-6 text-white" />;
    return <Code className="w-6 h-6 text-white" />;
  };

  const getCareerGradient = (index: number) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-orange-500 to-red-600", 
      "from-green-500 to-teal-600",
      "from-pink-500 to-rose-600",
      "from-indigo-500 to-blue-600"
    ];
    return gradients[index] || gradients[0];
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (percentage >= 80) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    if (percentage >= 70) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
  };

  if (isLoading || !isAuthenticated || resultsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error && isUnauthorizedError(error as Error)) {
    return null; // Will redirect via useEffect
  }

  if (!careerMatches || careerMatches.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-foreground">No Results Found</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Please take the assessment quiz to see your career recommendations.
            </p>
            <Link href="/quiz">
              <button
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover-scale shadow-lg"
                data-testid="button-take-quiz"
              >
                Take Assessment Quiz
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Results Header */}
        <div className="text-center mb-12 fade-in">
          <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground">Your Career Assessment Results</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Based on your responses, we've identified your top career matches
          </p>

          {/* Personality Summary */}
          <div className="max-w-2xl mx-auto glassmorphism p-8 rounded-2xl floating-animation">
            <h3 className="text-lg font-semibold mb-3 text-foreground">Your Profile Summary</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="skill-badge px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Analytical Thinker
              </span>
              <span className="skill-badge px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                Problem Solver
              </span>
              <span className="skill-badge px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                Detail Oriented
              </span>
              <span className="skill-badge px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                Team Player
              </span>
            </div>
          </div>
        </div>

        {/* Career Path Results */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Your Recommended Career Paths</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(careerMatches as UserCareerMatch[]).map((match, index) => (
              <Link key={match.id} href={`/career/${(match.careerPath as any).id}`}>
                <div className="bg-card rounded-2xl p-6 border border-border hover-scale shadow-lg group cursor-pointer career-card shimmer relative overflow-hidden"
                     data-testid={`career-card-${(match.careerPath as any).id}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getCareerGradient(index)} rounded-xl flex items-center justify-center`}>
                      {getCareerIcon((match.careerPath as any).title)}
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(match.matchPercentage)}`}>
                        {match.matchPercentage}% Match
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {(match.careerPath as any).title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{(match.careerPath as any).description}</p>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average Salary</span>
                      <span className="text-sm font-medium text-foreground">
                        ₹{((match.careerPath as any).averageSalaryMin / 100000).toFixed(1)}-{((match.careerPath as any).averageSalaryMax / 100000).toFixed(1)} LPA
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Job Growth</span>
                      <span className="text-sm font-medium text-green-600">+{(match.careerPath as any).jobGrowthRate}% annually</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Explore this career</span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Results Actions */}
          <div className="text-center mt-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quiz">
                <button
                  className="px-6 py-3 border border-border text-foreground rounded-xl hover:bg-muted transition-colors"
                  data-testid="button-retake-quiz"
                >
                  Retake Quiz
                </button>
              </Link>
              <Link href="/colleges">
                <button
                  className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover-scale"
                  data-testid="button-explore-colleges"
                >
                  Explore Colleges
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
