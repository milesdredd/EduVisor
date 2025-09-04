import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  User, 
  Trophy, 
  BookOpen, 
  Heart, 
  Calendar, 
  Download, 
  FileText, 
  PlayCircle, 
  Search, 
  CheckCircle, 
  Bookmark, 
  Send,
  Settings,
  Lightbulb,
  MapPin,
  ArrowRight
} from "lucide-react";
import { useEffect } from "react";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
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
    data: quizAssessments,
    isLoading: assessmentsLoading,
  } = useQuery({
    queryKey: ["/api/quiz/results"],
    enabled: isAuthenticated,
    retry: false,
  });

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: "Profile editing functionality will be available soon.",
    });
  };

  const handleViewApplications = () => {
    toast({
      title: "Applications",
      description: "Application tracking functionality will be available soon.",
    });
  };

  const handleDownloadReport = () => {
    toast({
      title: "Download Report",
      description: "Report download functionality will be available soon.",
    });
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const userInitials = user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U";
  const userName = user?.firstName || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "user@example.com";

  // Mock data for demonstration - in real app this would come from API
  const profileStats = {
    assessments: quizAssessments?.length || 0,
    matches: 12,
    applications: 3,
    bookmarks: 8
  };

  const recentActivities = [
    {
      id: 1,
      type: "assessment",
      title: "Completed Engineering Aptitude Test",
      description: "You scored in the top 10% and received 5 career recommendations",
      timestamp: "2 hours ago",
      icon: CheckCircle
    },
    {
      id: 2,
      type: "bookmark",
      title: "Saved IIT Delhi to Favorites",
      description: "Added to your college wishlist for B.Tech programs",
      timestamp: "1 day ago",
      icon: Bookmark
    },
    {
      id: 3,
      type: "application",
      title: "Applied to Delhi University",
      description: "Submitted application for B.Sc. Computer Science",
      timestamp: "3 days ago",
      icon: Send
    }
  ];

  const recommendations = [
    {
      id: 1,
      title: "Take Data Science Assessment",
      description: "Based on your interest in technology and problem-solving",
      icon: Lightbulb
    },
    {
      id: 2,
      title: "Explore Nearby Tech Colleges",
      description: "3 new engineering colleges added near your location",
      icon: MapPin
    },
    {
      id: 3,
      title: "JEE Application Deadline",
      description: "Application closes in 15 days - Don't miss out!",
      icon: Calendar
    }
  ];

  const progressData = [
    { label: "Profile Completion", value: 85, color: "bg-primary" },
    { label: "Career Exploration", value: 70, color: "bg-accent" },
    { label: "College Research", value: 60, color: "bg-purple-500" },
    { label: "Application Readiness", value: 45, color: "bg-orange-500" }
  ];

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-card rounded-2xl p-8 shadow-lg mb-8 border border-border">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-6">
                <div 
                  className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center"
                  data-testid="user-avatar"
                >
                  <span className="text-2xl font-bold text-white">{userInitials}</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-foreground" data-testid="user-name">
                    {userName}
                  </h1>
                  <p className="text-muted-foreground mb-1" data-testid="user-email">{userEmail}</p>
                  <p className="text-muted-foreground">Class 12th, Science Stream</p>
                </div>
              </div>
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
                data-testid="button-edit-profile"
              >
                <Settings className="w-4 h-4 mr-2 inline" />
                Edit Profile
              </button>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-primary/10 rounded-xl">
                <div className="text-2xl font-bold text-primary mb-1" data-testid="stat-assessments">
                  {profileStats.assessments}
                </div>
                <p className="text-sm text-muted-foreground">Assessments Taken</p>
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-xl">
                <div className="text-2xl font-bold text-accent mb-1" data-testid="stat-matches">
                  {profileStats.matches}
                </div>
                <p className="text-sm text-muted-foreground">Career Matches</p>
              </div>
              <div className="text-center p-4 bg-purple-500/10 rounded-xl">
                <div className="text-2xl font-bold text-purple-500 mb-1" data-testid="stat-applications">
                  {profileStats.applications}
                </div>
                <p className="text-sm text-muted-foreground">College Applications</p>
              </div>
              <div className="text-center p-4 bg-orange-500/10 rounded-xl">
                <div className="text-2xl font-bold text-orange-500 mb-1" data-testid="stat-bookmarks">
                  {profileStats.bookmarks}
                </div>
                <p className="text-sm text-muted-foreground">Saved Items</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Activity */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <h2 className="text-xl font-bold mb-6 text-foreground">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div 
                        key={activity.id} 
                        className="flex items-start space-x-4 p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                        data-testid={`activity-${activity.id}`}
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1 text-foreground">{activity.title}</h3>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <h2 className="text-xl font-bold mb-6 text-foreground">Your Progress</h2>
                <div className="space-y-6">
                  {progressData.map((item, index) => (
                    <div key={index} data-testid={`progress-${index}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-foreground">{item.label}</span>
                        <span className="text-sm text-muted-foreground">{item.value}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`progress-bar ${item.color} h-2 rounded-full transition-all duration-1000`}
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Personalized Recommendations */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <h2 className="text-xl font-bold mb-6 text-foreground">Recommended for You</h2>
                <div className="space-y-4">
                  {recommendations.map((rec) => {
                    const IconComponent = rec.icon;
                    return (
                      <div 
                        key={rec.id} 
                        className="p-4 border border-border rounded-xl hover:border-primary transition-colors cursor-pointer skill-badge"
                        data-testid={`recommendation-${rec.id}`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1 text-foreground">{rec.title}</h3>
                            <p className="text-sm text-muted-foreground">{rec.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <h2 className="text-xl font-bold mb-6 text-foreground">Quick Actions</h2>
                <div className="space-y-3">
                  <Link href="/quiz">
                    <button 
                      className="w-full p-3 text-left border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                      data-testid="action-take-assessment"
                    >
                      <div className="flex items-center space-x-3">
                        <PlayCircle className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">Take New Assessment</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                      </div>
                    </button>
                  </Link>

                  <Link href="/colleges">
                    <button 
                      className="w-full p-3 text-left border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                      data-testid="action-find-colleges"
                    >
                      <div className="flex items-center space-x-3">
                        <Search className="w-5 h-5 text-accent" />
                        <span className="font-medium text-foreground">Find Colleges</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                      </div>
                    </button>
                  </Link>

                  <button 
                    onClick={handleViewApplications}
                    className="w-full p-3 text-left border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                    data-testid="action-view-applications"
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-purple-500" />
                      <span className="font-medium text-foreground">My Applications</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </div>
                  </button>

                  <button 
                    onClick={handleDownloadReport}
                    className="w-full p-3 text-left border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                    data-testid="action-download-report"
                  >
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-orange-500" />
                      <span className="font-medium text-foreground">Download Report</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Achievement Summary */}
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 border border-border">
                <h3 className="text-lg font-bold mb-4 text-foreground flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-accent" />
                  Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Quiz Completed</span>
                    <span className="skill-badge px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      ✓ Done
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Career Matches Found</span>
                    <span className="skill-badge px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      ✓ 12 Matches
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Profile Score</span>
                    <span className="skill-badge px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                      85% Complete
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
