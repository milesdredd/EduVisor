import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { TrendingUp, Users, Brain, Target, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
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

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')`,
          }}
        ></div>

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Discover Your Perfect Career Path
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join thousands of students who found their dream careers through our AI-powered guidance platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quiz">
                <button
                  className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover-scale shadow-lg"
                  data-testid="button-start-quiz"
                >
                  Start Career Quiz
                </button>
              </Link>
              <Link href="/colleges">
                <button
                  className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
                  data-testid="button-explore-colleges"
                >
                  Explore Colleges
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Graduation Matters Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Why Your Degree Matters</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Understanding the impact of higher education on your future success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 hover-scale border border-border card-gradient shimmer relative overflow-hidden">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Higher Earning Potential</h3>
              <p className="text-muted-foreground mb-4">
                Graduates earn 84% more than high school graduates over their lifetime
              </p>
              <div className="bg-primary/10 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Average Salary Increase</span>
                  <span className="font-semibold text-primary">+84%</span>
                </div>
              </div>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 hover-scale border border-border card-gradient shimmer relative overflow-hidden">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Network</h3>
              <p className="text-muted-foreground mb-4">
                Build valuable connections with peers, professors, and industry professionals
              </p>
              <div className="bg-accent/10 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Network Growth</span>
                  <span className="font-semibold text-accent">+300%</span>
                </div>
              </div>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-500/10 to-accent/10 hover-scale border border-border card-gradient shimmer relative overflow-hidden">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Critical Thinking</h3>
              <p className="text-muted-foreground mb-4">
                Develop analytical skills and problem-solving abilities for life
              </p>
              <div className="bg-purple-500/10 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Skills Development</span>
                  <span className="font-semibold text-purple-500">+250%</span>
                </div>
              </div>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-primary/10 hover-scale border border-border card-gradient shimmer relative overflow-hidden">
              <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Flexibility</h3>
              <p className="text-muted-foreground mb-4">
                Access diverse career opportunities and easier job transitions
              </p>
              <div className="bg-orange-500/10 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Job Opportunities</span>
                  <span className="font-semibold text-orange-500">+400%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">Success Stories in Numbers</h2>
            <p className="text-xl text-white/80">Real impact on students' lives through education</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center glassmorphism p-6 rounded-2xl">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <p className="text-white/80">Students Guided</p>
            </div>
            <div className="text-center glassmorphism p-6 rounded-2xl">
              <div className="text-4xl font-bold text-white mb-2">1,200+</div>
              <p className="text-white/80">Government Colleges</p>
            </div>
            <div className="text-center glassmorphism p-6 rounded-2xl">
              <div className="text-4xl font-bold text-white mb-2">95%</div>
              <p className="text-white/80">Success Rate</p>
            </div>
            <div className="text-center glassmorphism p-6 rounded-2xl">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <p className="text-white/80">Career Paths</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">How EduPath Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to discover your ideal career path</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Take Assessment Quiz</h3>
              <p className="text-muted-foreground">
                Answer questions about your interests, skills, and personality to get personalized recommendations
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Get Career Matches</h3>
              <p className="text-muted-foreground">
                Receive 4-5 personalized career paths with detailed information about each option
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Explore & Plan</h3>
              <p className="text-muted-foreground">
                Discover colleges, courses, and create your academic roadmap for success
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8 text-foreground">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Take our comprehensive assessment and discover career paths that align with your unique strengths and interests
          </p>
          <Link href="/quiz">
            <button
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover-scale shadow-lg"
              data-testid="button-start-assessment"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Start Your Assessment
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
