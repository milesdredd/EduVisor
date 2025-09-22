
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Briefcase, Building, BarChart3, SlidersHorizontal, Star, ListChecks, GraduationCap, Loader2, Compass, Lock, Trash2, Bookmark, BookmarkCheck, LogOut, Search } from "lucide-react";
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { useResultsStore } from '@/hooks/use-results-store';
import { getPersonalizedCollegeSuggestions, PersonalizedCollegeSuggestionsOutput } from '@/ai/flows/personalized-college-suggestions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation';
import { TimelineTracker } from '@/components/dashboard/timeline-tracker';

type CollegeRecommendation = PersonalizedCollegeSuggestionsOutput['recommendations'][0];

const iconMap = {
    FileText: FileText,
    Briefcase: Briefcase,
    Building: Building,
    Search: Search,
};

export default function ProfilePage() {
    const [scores, setScores] = useState({
      distance: 50,
      programs: 70,
      labs: 80,
      hostel: 60,
      cutoffs: 90,
      placements: 85,
      accessibility: 75,
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<CollegeRecommendation[] | null>(null);
    const store = useResultsStore();
    const [careerSuggestions, setCareerSuggestions] = useState(store.careerSuggestions);
    const [chosenCareer, setChosenCareer] = useState(store.chosenCareer);
    const [savedColleges, setSavedColleges] = useState(store.savedColleges);
    const [user, setUser] = useState(store.user);
    const [activityLog, setActivityLog] = useState(store.activityLog);
    
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
      setCareerSuggestions(store.careerSuggestions);
      setChosenCareer(store.chosenCareer);
      setSavedColleges(store.savedColleges);
      setUser(store.user);
      setActivityLog(store.activityLog);
    }, [store.careerSuggestions, store.chosenCareer, store.savedColleges, store.user, store.activityLog]);
    
    const handleScoreChange = (category: keyof typeof scores, value: number[]) => {
      setScores(prev => ({ ...prev, [category]: value[0] }));
    };

    const calculateOverallFitScore = (collegeAttributes: CollegeRecommendation['attributes']) => {
        if (!collegeAttributes) return 0;
        
        const weightedSum = Object.keys(scores).reduce((sum, key) => {
            const preference = scores[key as keyof typeof scores];
            const attribute = collegeAttributes[key as keyof typeof collegeAttributes];
            return sum + (preference * attribute);
        }, 0);

        const totalWeight = Object.values(scores).reduce((sum, score) => sum + score, 0);
        if (totalWeight === 0) return 0;

        return Math.round((weightedSum / totalWeight));
    }

    const sortedRecommendations = recommendations 
      ? [...recommendations].sort((a, b) => {
          const scoreA = calculateOverallFitScore(a.attributes);
          const scoreB = calculateOverallFitScore(b.attributes);
          return scoreB - scoreA;
        })
      : [];


    const handleFetchRecommendations = async () => {
        if (!careerSuggestions || careerSuggestions.suggestions.length === 0) {
            toast({
                variant: "destructive",
                title: "Quiz Not Taken",
                description: "Please take the career assessment quiz first to get college recommendations.",
            });
            return;
        }

        setIsLoading(true);
        setRecommendations(null);

        try {
            const result = await getPersonalizedCollegeSuggestions({
                suggestedCareers: careerSuggestions.suggestions.map(s => s.career),
                fitScorerPreferences: scores
            });
            setRecommendations(result.recommendations);
        } catch (error) {
            console.error("Failed to get recommendations:", error);
            toast({
                variant: "destructive",
                title: "An error occurred",
                description: "Could not fetch college recommendations. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetData = () => {
      store.reset();
      toast({
        title: "Data Cleared",
        description: "Your assessment data has been reset. You can now take the quiz again.",
      });
      router.push('/quiz');
    };

    const handleSaveCollege = (rec: { collegeName: string; reason: string; }) => {
        store.addSavedCollege(rec);
        toast({
            title: "College Saved!",
            description: `${rec.collegeName} has been added to your list.`,
        });
    };
  
    const handleLogout = () => {
      store.logout();
      store.reset();
      router.push('/login');
    }

  return (
    <div className="container mx-auto py-12 space-y-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center space-x-6">
            <Avatar className="h-24 w-24">
            <AvatarImage src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.username}`} alt={user?.username} />
            <AvatarFallback>{user?.username?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
            <h1 className="text-4xl font-bold font-headline">{user?.username}</h1>
            <p className="text-muted-foreground text-lg">{user?.email}</p>
            </div>
        </div>
        <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2"/> Logout</Button>
      </div>

       <Card className="bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-primary">
                    <Compass size={28} />
                    Your Chosen Path
                </CardTitle>
            </CardHeader>
            <CardContent>
                {chosenCareer ? (
                    <div>
                        <h2 className="text-3xl font-bold font-headline">{chosenCareer.title}</h2>
                        <p className="text-muted-foreground mt-2">This is your starting point. Explore the resources below to prepare for your journey.</p>
                        <Button variant="link" asChild className="p-0 mt-2">
                           <Link href={`/career/${encodeURIComponent(chosenCareer.title.toLowerCase().replace(/ /g, '-'))}`}>
                                Review Career Details
                           </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">You haven't chosen a career path yet. Let's find one!</p>
                        <Button asChild>
                            <Link href="/quiz">Take the Assessment</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ListChecks /> College Fit Scorer</CardTitle>
                    <CardDescription>Adjust your priorities to dynamically re-rank your recommended colleges.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!careerSuggestions ? (
                        <div className="text-center text-muted-foreground p-8 rounded-lg bg-muted flex flex-col items-center gap-4">
                            <Lock className="w-8 h-8" />
                            <p>You need to complete the career assessment before using the Fit Scorer.</p>
                            <Button asChild>
                                <Link href="/quiz">Take the Assessment</Link>
                            </Button>
                        </div>
                    ) : (
                        <>
                            {Object.entries(scores).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <div className="flex justify-between">
                                        <label className="capitalize text-sm font-medium">{key.replace(/([A-Z])/g, ' $1')}</label>
                                        <span className="text-sm font-bold text-primary">{value}</span>
                                    </div>
                                    <Slider
                                        defaultValue={[value]}
                                        max={100}
                                        step={1}
                                        onValueChange={(val) => handleScoreChange(key as keyof typeof scores, val)}
                                    />
                                </div>
                            ))}
                            
                            <Separator />

                            <div>
                                <Button onClick={handleFetchRecommendations} disabled={isLoading} className="w-full">
                                    {isLoading ? <Loader2 className="animate-spin" /> : <GraduationCap />}
                                    {recommendations ? "Refresh Recommendations" : "Get Personalized College Recommendations"}
                                </Button>
                            </div>

                            {isLoading && (
                                <div className="flex justify-center items-center p-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            )}
                            
                            {sortedRecommendations && sortedRecommendations.length > 0 && (
                                <div className="space-y-4 pt-4">
                                    <h3 className="text-xl font-semibold">Your Re-Ranked Colleges</h3>
                                    {sortedRecommendations.map((rec, index) => {
                                        const isSaved = savedColleges.some(c => c.collegeName === rec.collegeName);
                                        const fitScore = calculateOverallFitScore(rec.attributes);
                                        return (
                                            <Alert key={index} className="relative">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <GraduationCap className="h-4 w-4" />
                                                        <AlertTitle>{rec.collegeName}</AlertTitle>
                                                        <AlertDescription>{rec.reason}</AlertDescription>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                      <div className="text-right">
                                                          <div className="font-bold text-primary text-lg">{fitScore}%</div>
                                                          <div className="text-xs text-muted-foreground">Fit Score</div>
                                                      </div>
                                                      <Button
                                                          variant="ghost"
                                                          size="icon"
                                                          onClick={() => handleSaveCollege(rec)}
                                                          disabled={isSaved}
                                                      >
                                                          {isSaved ? <BookmarkCheck className="text-primary" /> : <Bookmark />}
                                                          <span className="sr-only">Save College</span>
                                                      </Button>
                                                    </div>
                                                </div>
                                            </Alert>
                                        )
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart3 /> Progress</CardTitle>
                    <CardDescription>Track your journey in exploring careers and colleges.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="mb-2 font-medium">Careers Explored</p>
                        <Progress value={60} />
                    </div>
                     <div>
                        <p className="mb-2 font-medium">Colleges Reviewed</p>
                        <Progress value={30} />
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
          <TimelineTracker career={chosenCareer?.title} isLocked={!chosenCareer} />

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activityLog.length > 0 ? (
                activityLog.map(activity => {
                  const Icon = iconMap[activity.icon];
                  return (
                    <p key={activity.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="w-4 h-4" />
                      {activity.description}
                    </p>
                  )
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center">No recent activity to show.</p>
              )}
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account and data.</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Reset My Quiz Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      quiz answers and career suggestions, but your login information will be kept.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetData}>
                      Yes, reset my data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
