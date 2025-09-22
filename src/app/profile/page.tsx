"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, Briefcase, Building, Bell, BarChart3, SlidersHorizontal, Star, ListChecks, GraduationCap, Loader2, Compass, Lock, Trash2 } from "lucide-react";
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
    const [recommendations, setRecommendations] = useState<PersonalizedCollegeSuggestionsOutput | null>(null);
    const { careerSuggestions, chosenCareer, reset } = useResultsStore();
    const { toast } = useToast();
    const router = useRouter();
    
    const handleScoreChange = (category: keyof typeof scores, value: number[]) => {
      setScores(prev => ({ ...prev, [category]: value[0] }));
    };

    const calculateFitScore = () => {
        const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
        return Math.round(total / Object.keys(scores).length);
    }

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
            setRecommendations(result);
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
      reset();
      toast({
        title: "Data Cleared",
        description: "Your assessment data has been reset. You can now take the quiz again.",
      });
      router.push('/quiz');
    };
  
  return (
    <div className="container mx-auto py-12 space-y-12">
      <div className="flex items-center space-x-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-4xl font-bold font-headline">Alex Doe</h1>
          <p className="text-muted-foreground text-lg">alex.doe@example.com</p>
        </div>
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
                    <CardDescription>Weigh your priorities to find the college that's the perfect fit for you.</CardDescription>
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
                            <Collapsible>
                                <CollapsibleTrigger asChild>
                                    <Button variant="secondary" className="w-full">
                                        Calculate My Ideal College Fit Score
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="mt-4 text-center">
                                    <p className="text-muted-foreground">Your Ideal College Fit Score is</p>
                                    <p className="text-6xl font-bold text-primary">{calculateFitScore()}%</p>
                                </CollapsibleContent>
                            </Collapsible>
                            
                            <Separator />

                            <div>
                                <Button onClick={handleFetchRecommendations} disabled={isLoading} className="w-full">
                                    {isLoading ? <Loader2 className="animate-spin" /> : <GraduationCap />}
                                    Get Personalized College Recommendations
                                </Button>
                            </div>

                            {isLoading && (
                                <div className="flex justify-center items-center p-4">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            )}
                            
                            {recommendations && recommendations.recommendations.length > 0 && (
                                <div className="space-y-4 pt-4">
                                    <h3 className="text-xl font-semibold">Your Recommended Colleges</h3>
                                    {recommendations.recommendations.map((rec, index) => (
                                        <Alert key={index}>
                                            <GraduationCap className="h-4 w-4" />
                                            <AlertTitle>{rec.collegeName}</AlertTitle>
                                            <AlertDescription>{rec.reason}</AlertDescription>
                                        </Alert>
                                    ))}
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell /> Timeline Tracker</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <div className="bg-primary/20 text-primary p-2 rounded-md">
                    <p className="font-bold text-sm">JUN</p>
                    <p className="font-bold text-2xl">15</p>
                </div>
                <p className="ml-4 text-sm">JEE Advanced Application Deadline</p>
              </div>
              <Separator />
               <div className="flex items-center">
                <div className="bg-primary/20 text-primary p-2 rounded-md">
                    <p className="font-bold text-sm">JUL</p>
                    <p className="font-bold text-2xl">01</p>
                </div>
                <p className="ml-4 text-sm">VITEEE Counseling Starts</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="flex items-center gap-2 text-sm text-muted-foreground"><FileText className="w-4 h-4" /> Took 'Interests' assessment</p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground"><Briefcase className="w-4 h-4" /> Viewed 'Software Engineer' career</p>
                <p className="flex items-center gap-2 text-sm text-muted-foreground"><Building className="w-4 h-4" /> Explored 'IIT Bombay'</p>
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
                    Reset My Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      quiz answers and career suggestions.
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
