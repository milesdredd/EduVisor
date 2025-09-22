"use client";

import { ArrowLeft, BookOpen, Briefcase, Wallet, PlusCircle, Search, Sparkles, TrendingUp, Loader2, GraduationCap, CheckCircle, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getCareerDetails, type CareerDetailsOutput } from "@/ai/flows/career-details";
import { getCollegeRecommendations, type CollegeRecommendationsOutput } from "@/ai/flows/college-recommendations";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useResultsStore } from "@/hooks/use-results-store";
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


function CareerDetailSkeleton() {
    return (
        <div className="space-y-10">
            <Card>
                <CardHeader>
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Briefcase /> Job Opportunities</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">Key Job Duties</h3>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                         <div>
                            <h3 className="font-semibold mb-2">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-28" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><TrendingUp /> Career Outlook</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><Wallet className="w-5 h-5" /> Potential Salary</h3>
                            <Skeleton className="h-6 w-3/4" />
                        </div>
                         <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5" /> Job Growth</h3>
                            <Skeleton className="h-6 w-1/2" />
                        </div>
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5" /> Entrepreneurial Options</h3>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BookOpen /> Academic Pathway & Scholarships</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Summarized Academic Pathway</h3>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full mt-2" />
                    </div>
                     <div className="mb-6">
                        <h3 className="font-semibold mb-2">Relevant Scholarships</h3>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </div>
                     <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Explore Colleges for this Path
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-primary/10 border-primary/30">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">Get Prepared</CardTitle>
                    <CardDescription>Freely accessible study materials to get ready for entrance tests.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                   <Skeleton className="h-12 w-full" />
                   <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
      </div>
    )
}


export default function CareerDetailPage() {
  const [career, setCareer] = useState<CareerDetailsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollegesLoading, setIsCollegesLoading] = useState(false);
  const [collegeRecommendations, setCollegeRecommendations] = useState<CollegeRecommendationsOutput | null>(null);
  const { toast } = useToast();
  const { chosenCareer, setChosenCareer, addActivity } = useResultsStore();
  const isCareerChosen = chosenCareer?.title === career?.title;
  const params = useParams<{ slug: string }>();


  useEffect(() => {
    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const careerTitle = decodeURIComponent(params.slug).split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const details = await getCareerDetails({ career: careerTitle });
            setCareer(details);
            addActivity({ description: `Viewed '${careerTitle}' career`, icon: 'Briefcase' });
        } catch (error) {
            console.error("Failed to fetch career details:", error);
            toast({
                variant: "destructive",
                title: "An error occurred",
                description: "Failed to load career details. Please try again later.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (params.slug) {
        fetchDetails();
    }
  }, [params.slug, toast, addActivity]);
  
  const handleFetchRecommendations = async () => {
    if (!career) return;
    setIsCollegesLoading(true);
    setCollegeRecommendations(null); 
    try {
      const recommendations = await getCollegeRecommendations({ suggestedCareers: [career.title] });
      setCollegeRecommendations(recommendations);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get college recommendations. Please try again.",
      });
    } finally {
      setIsCollegesLoading(false);
    }
  };

  const handleChooseCareer = () => {
    if (career) {
      setChosenCareer(career);
      toast({
        title: "Path Chosen!",
        description: `'${career.title}' is now your official career path. Your journey starts now!`,
      });
    }
  };


  if (isLoading) {
    return (
        <div className="container mx-auto max-w-4xl py-12">
            <Button asChild variant="ghost" className="mb-8">
                <Link href="/results">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Results
                </Link>
            </Button>
            <CareerDetailSkeleton />
        </div>
    );
  }

  if (!career) {
    return (
        <div className="container mx-auto max-w-4xl py-12 text-center">
             <Button asChild variant="ghost" className="mb-8">
                <Link href="/results">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Results
                </Link>
            </Button>
            <p>Could not load career details. Please try again later.</p>
        </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Button asChild variant="ghost" className="mb-8">
        <Link href="/results">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Results
        </Link>
      </Button>

      <div className="space-y-10">
        <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-4xl font-headline">{career.title}</CardTitle>
                    <CardDescription>
                        A comprehensive look at the career path of a {career.title}.
                    </CardDescription>
                  </div>
                  {isCareerChosen ? (
                      <div className="text-center">
                        <Button asChild>
                            <Link href="/dashboard">
                                Let's Go to the Dashboard <ArrowRight className="ml-2" />
                            </Link>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2 italic">"Your career, my responsibility."</p>
                      </div>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button>
                          <Heart className="mr-2" />
                          Choose This Career Path
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you ready to commit to this path?</AlertDialogTitle>
                          <AlertDialogDescription>
                            <p className="italic text-center my-4">"The future depends on what you do today." - Mahatma Gandhi</p>
                            This action will set '{career.title}' as your chosen career path. You can always explore and change your path later. 😉
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleChooseCareer}>I Agree</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
              </div>
            </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Briefcase /> Job Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Key Job Duties</h3>
                        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                        {career.jobDuties.map((duty, index) => (
                            <li key={index}>{duty}</li>
                        ))}
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-semibold mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                        {career.requiredSkills.map((skill) => (
                            <Badge key={skill} variant="outline">{skill}</Badge>
                        ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp /> Career Outlook</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><Wallet className="w-5 h-5" /> Potential Salary</h3>
                        <p className="text-lg font-medium">{career.potentialSalary}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><TrendingUp className="w-5 h-5" /> Job Growth</h3>
                        <p className="text-lg font-medium">{career.jobGrowth}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold flex items-center gap-2 mb-2"><Sparkles className="w-5 h-5" /> Entrepreneurial Options</h3>
                        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                        {career.entrepreneurialOptions.map((opt, index) => (
                            <li key={index}>{opt}</li>
                        ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen /> Academic Pathway & Scholarships</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Summarized Academic Pathway</h3>
                    <p className="text-muted-foreground">{career.academicPathway}</p>
                </div>
                 <div className="mb-6">
                    <h3 className="font-semibold mb-2">Relevant Scholarships</h3>
                     <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                        {career.scholarships.map((scholarship, index) => (
                            <li key={index}>{scholarship}</li>
                        ))}
                    </ul>
                </div>
                 <Button onClick={handleFetchRecommendations} disabled={isCollegesLoading}>
                    {isCollegesLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Explore Colleges for this Path
                </Button>
            </CardContent>
        </Card>

        {isCollegesLoading && (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )}

        {collegeRecommendations && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GraduationCap /> Suggested Colleges & Tracks
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                    {collegeRecommendations.collegeRecommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                    ))}
                    </ul>
                </CardContent>
            </Card>
        )}

        <Card className="bg-primary/10 border-primary/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">Get Prepared</CardTitle>
                <CardDescription>Freely accessible study materials to get ready for entrance tests.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
               {career.studyMaterials.map((material, index) => (
                    <a key={index} href={material.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-background rounded-md hover:bg-muted transition-colors">
                        <span>{material.title}</span>
                        <PlusCircle className="w-5 h-5 text-primary" />
                    </a>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
