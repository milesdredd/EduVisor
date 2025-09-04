import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { ArrowLeft, ArrowRight, Code, Settings, Briefcase, Heart, BookOpen } from "lucide-react";
import { useEffect } from "react";

export default function CareerDetails() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, params] = useRoute("/career/:id");

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
    data: career,
    isLoading: careerLoading,
    error,
  } = useQuery({
    queryKey: ["/api/careers", params?.id],
    enabled: isAuthenticated && !!params?.id,
    retry: false,
  });

  const getCareerIcon = (title: string) => {
    if (title.includes("Computer") || title.includes("IT")) return <Code className="w-10 h-10 text-white" />;
    if (title.includes("Engineering")) return <Settings className="w-10 h-10 text-white" />;
    if (title.includes("Business")) return <Briefcase className="w-10 h-10 text-white" />;
    if (title.includes("Healthcare") || title.includes("Medicine")) return <Heart className="w-10 h-10 text-white" />;
    if (title.includes("Education")) return <BookOpen className="w-10 h-10 text-white" />;
    return <Code className="w-10 h-10 text-white" />;
  };

  const getCareerGradient = (title: string) => {
    if (title.includes("Computer") || title.includes("IT")) return "from-blue-500 to-purple-600";
    if (title.includes("Engineering")) return "from-orange-500 to-red-600";
    if (title.includes("Business")) return "from-green-500 to-teal-600";
    if (title.includes("Healthcare") || title.includes("Medicine")) return "from-pink-500 to-rose-600";
    if (title.includes("Education")) return "from-indigo-500 to-blue-600";
    return "from-blue-500 to-purple-600";
  };

  if (isLoading || !isAuthenticated || careerLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading career details...</p>
        </div>
      </div>
    );
  }

  if (error && isUnauthorizedError(error as Error)) {
    return null; // Will redirect via useEffect
  }

  if (!career) {
    return (
      <div className="pt-20 min-h-screen bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-foreground">Career Not Found</h1>
            <p className="text-xl text-muted-foreground mb-8">
              The career path you're looking for doesn't exist.
            </p>
            <Link href="/quiz-results">
              <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover-scale shadow-lg">
                Back to Results
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
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/quiz-results">
            <button
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-back-to-results"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Results
            </button>
          </Link>
        </div>

        {/* Career Header */}
        <div className="text-center mb-12 fade-in">
          <div className={`w-20 h-20 bg-gradient-to-r ${getCareerGradient(career.title)} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
            {getCareerIcon(career.title)}
          </div>
          <h1 className="text-4xl font-bold mb-4 text-foreground" data-testid="career-title">
            {career.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="career-description">
            {career.description}
          </p>
        </div>

        {/* Career Overview Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Job Opportunities */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Job Opportunities & Salaries</h2>

              <div className="space-y-4">
                {career.jobOpportunities?.map((job: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl" data-testid={`job-opportunity-${index}`}>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                        <Code className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{job.title}</h4>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-foreground">{job.salary}</span>
                      <p className="text-xs text-green-600">{job.experience}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div className="space-y-8">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="text-xl font-bold mb-4 text-foreground">Required Skills</h3>
              <div className="space-y-3">
                {career.requiredSkills?.map((skill: any, index: number) => (
                  <div key={index} data-testid={`skill-${index}`}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.importance}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{skill.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-border">
              <h3 className="text-lg font-bold mb-4 text-foreground">Quick Facts</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Salary</span>
                  <span className="font-medium text-foreground">
                    ₹{(career.averageSalaryMin / 100000).toFixed(1)}-{(career.averageSalaryMax / 100000).toFixed(1)} LPA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Job Growth Rate</span>
                  <span className="font-medium text-green-600">+{career.jobGrowthRate}% annually</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remote Work</span>
                  <span className="font-medium text-green-600">85% possible</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Pathway */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Educational Pathway</h2>

          <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 border border-border">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-8">
              <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-6 w-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">12th</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">Class 12 PCM</p>
                  <p className="text-xs text-muted-foreground">60%+ required</p>
                </div>

                <div className="flex items-center">
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-sm">B.Tech</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">Bachelor's Degree</p>
                  <p className="text-xs text-muted-foreground">4 years</p>
                </div>

                <div className="flex items-center">
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Career Start</p>
                  <p className="text-xs text-muted-foreground">₹{(career.averageSalaryMin / 100000).toFixed(1)}+ LPA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/colleges">
              <button
                className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover-scale shadow-lg"
                data-testid="button-explore-colleges"
              >
                Explore All Colleges
              </button>
            </Link>
            <Link href="/quiz-results">
              <button
                className="px-8 py-4 border border-border text-foreground rounded-xl hover:bg-muted transition-colors"
                data-testid="button-view-other-careers"
              >
                View Other Careers
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
