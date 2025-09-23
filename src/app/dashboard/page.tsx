
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResultsStore } from '@/hooks/use-results-store';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Compass, BookOpen, Newspaper, Target, Bot, Users, ArrowRight, Lock, Loader2, CalendarDays, Linkedin } from 'lucide-react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { TimelineTracker } from '@/components/dashboard/timeline-tracker';
import { getDashboardDetails, DashboardDetailsOutput } from '@/ai/flows/dashboard-details';
import { findMentors, FindMentorsOutput } from '@/ai/flows/find-mentors';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
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

function LockedDashboardOverlay() {
    return (
        <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
            <Lock className="w-16 h-16 text-primary mb-4" />
            <h2 className="text-2xl font-bold font-headline mb-2">Unlock Your Dashboard</h2>
            <p className="text-muted-foreground mb-6">Take the career assessment to get your personalized dashboard.</p>
            <Button asChild>
                <Link href="/quiz">Take the Assessment</Link>
            </Button>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Target /> Syllabus & Milestones</CardTitle>
                        <CardDescription>Track your progress through the required subjects and skills.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BookOpen /> Top Resources</CardTitle>
                        <CardDescription>Curated books and articles to get you started.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                       <Skeleton className="h-5 w-full" />
                       <Skeleton className="h-5 w-4/5" />
                    </CardContent>
                </Card>
                
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Newspaper /> Latest News & Trends</CardTitle>
                        <CardDescription>Stay updated with what's happening in your future career.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
            </div>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Overall Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-center">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4 mx-auto" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2"><CalendarDays /> Timeline Tracker</CardTitle>
                         <CardDescription>Key dates for your upcoming applications and exams.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-center items-center h-24">
                           <Loader2 className="animate-spin text-primary" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}


export default function DashboardPage() {
    const store = useResultsStore();
    const [chosenCareer, setChosenCareer] = useState(store.chosenCareer);
    const [careerSuggestions, setCareerSuggestions] = useState(store.careerSuggestions);
    const { toast } = useToast();

    const [details, setDetails] = useState<DashboardDetailsOutput | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const [isMentorLoading, setIsMentorLoading] = useState(false);
    const [mentors, setMentors] = useState<FindMentorsOutput | null>(null);
    const [isMentorDialogOpen, setIsMentorDialogOpen] = useState(false);

    const isLocked = !chosenCareer && !careerSuggestions;
    const timelineCareer = chosenCareer?.title || careerSuggestions?.suggestions?.[0]?.career;

    useEffect(() => {
        const unsub = useResultsStore.subscribe((state) => {
            setChosenCareer(state.chosenCareer);
            setCareerSuggestions(state.careerSuggestions);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (chosenCareer) {
            const fetchDetails = async () => {
                setIsLoadingDetails(true);
                try {
                    const result = await getDashboardDetails({ career: chosenCareer.title });
                    setDetails(result);
                } catch (error) {
                    console.error("Failed to fetch dashboard details:", error);
                    toast({
                        variant: "destructive",
                        title: "Error loading dashboard",
                        description: "Could not load personalized content. Please try again later.",
                    })
                } finally {
                    setIsLoadingDetails(false);
                }
            };
            fetchDetails();
        }
    }, [chosenCareer, toast]);

    const [syllabusProgress, setSyllabusProgress] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (details?.syllabus) {
            const initialProgress = details.syllabus.reduce((acc, item) => {
                acc[item.id] = false;
                return acc;
            }, {} as Record<string, boolean>);
            setSyllabusProgress(initialProgress);
        }
    }, [details]);


    const handleSyllabusChange = (id: string, checked: CheckedState) => {
        setSyllabusProgress(prev => ({ ...prev, [id]: !!checked }));
    };
    
    const handleFindMentors = async () => {
        if (!chosenCareer) return;
        setIsMentorLoading(true);
        setMentors(null);
        try {
            const results = await findMentors({ career: chosenCareer.title });
            setMentors(results);
        } catch(e) {
            console.error(e);
            toast({
                variant: 'destructive',
                title: 'Error finding mentors',
                description: 'Could not fetch mentor suggestions at this time.',
            });
        } finally {
            setIsMentorLoading(false);
        }
    };


    const overallProgress = details?.syllabus?.length
      ? Math.round((Object.values(syllabusProgress).filter(Boolean).length / details.syllabus.length) * 100)
      : 0;
    
    const showDashboardContent = chosenCareer && !isLoadingDetails && details;
    
    return (
        <div className="container mx-auto py-12 space-y-8">

            <div className="text-center space-y-2">
                <p className="text-lg text-muted-foreground">"The best way to predict the future is to create it."</p>
                <h1 className="text-4xl font-bold font-headline">Your Career Dashboard</h1>
            </div>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Compass size={24} className="text-primary" />
                        Your Chosen Path
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {chosenCareer ? (
                        <div>
                            <h2 className="text-3xl font-bold">{chosenCareer.title}</h2>
                            <p className="text-muted-foreground mt-1">Here is your personalized dashboard to guide you on your journey.</p>
                            <Button variant="link" asChild className="p-0 mt-2">
                               <Link href={`/career/${encodeURIComponent(chosenCareer.title.toLowerCase().replace(/ /g, '-'))}`}>
                                    Review Career Details
                               </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-muted-foreground">You haven't chosen a career path yet. Explore your results and choose a path to unlock your dashboard!</p>
                             <Button asChild variant="default" className="mt-4">
                                <Link href="/results">View My Results</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="relative">
                {isLocked && <LockedDashboardOverlay />}

                {(isLoadingDetails && !isLocked) ? <DashboardSkeleton /> : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Target /> Syllabus & Milestones</CardTitle>
                                <CardDescription>Track your progress through the required subjects and skills.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {showDashboardContent && details?.syllabus?.length ? (
                                    <div className="space-y-3">
                                        {details.syllabus.map(item => (
                                            <div key={item.id} className="flex items-center">
                                                <Checkbox
                                                    id={item.id}
                                                    checked={!isLocked && syllabusProgress[item.id]}
                                                    onCheckedChange={(checked) => handleSyllabusChange(item.id, checked)}
                                                    disabled={isLocked}
                                                    className="mr-3"
                                                />
                                                <label
                                                    htmlFor={item.id}
                                                    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                                                        syllabusProgress[item.id] && !isLocked ? 'line-through text-muted-foreground' : ''
                                                    }`}
                                                >
                                                    {item.label}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        {chosenCareer ? 'No syllabus available for this career path yet.' : 'Choose a career to get started.'}
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><BookOpen /> Top Resources</CardTitle>
                                <CardDescription>Curated books and articles to get you started.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {showDashboardContent && details?.resources?.length ? (
                                    details.resources.map((res, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="bg-secondary p-2 rounded-full">
                                               <BookOpen className="w-4 h-4 text-secondary-foreground"/>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{res.title}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{res.type}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                     <p className="text-sm text-muted-foreground">
                                        {chosenCareer ? 'No resources available for this career path yet.' : 'Choose a career to get started.'}
                                     </p>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button variant="secondary" disabled={isLocked || !chosenCareer} asChild>
                                    <Link href={`/resources?career=${encodeURIComponent(chosenCareer?.title || '')}`}>
                                        Explore More Resources
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Newspaper /> Latest News & Trends</CardTitle>
                                <CardDescription>Stay updated with what's happening in the world of {chosenCareer ? chosenCareer.title : "your future career"}.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {showDashboardContent && details?.news?.length ? (
                                    details.news.map((item, index) => (
                                        <div key={index}>
                                            <p className="font-medium">{item.headline}</p>
                                            <p className="text-sm text-muted-foreground">{item.summary}</p>
                                        </div>
                                    ))
                                ) : (
                                     <p className="text-sm text-muted-foreground">
                                        {chosenCareer ? 'No news available for this career path yet.' : 'Choose a career to get started.'}
                                     </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Overall Progress</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-center">
                                <Progress value={!isLocked ? overallProgress : 0} />
                                <p className="text-sm text-muted-foreground">
                                    {!isLocked ? `You're ${overallProgress}% of the way there. Keep going!` : 'Complete the quiz to start your progress.'}
                                </p>
                            </CardContent>
                        </Card>

                        <TimelineTracker career={timelineCareer} isLocked={isLocked} />

                        <Card className="bg-secondary">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Bot /> AI Study Helper</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">Get a personalized timetable, find answers to complex questions, and more.</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" disabled={isLocked || !chosenCareer}>
                                    <Link href={`/study-planner?career=${encodeURIComponent(chosenCareer?.title || '')}`}>
                                        Create My Study Plan <ArrowRight className="ml-2"/>
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Users /> Talk to a Mentor</CardTitle>
                            </CardHeader>
                             <CardContent>
                                <p className="text-muted-foreground">Connect with industry professionals in India.</p>
                            </CardContent>
                            <CardFooter>
                               <AlertDialog open={isMentorDialogOpen} onOpenChange={setIsMentorDialogOpen}>
                                    <AlertDialogTrigger asChild>
                                        <Button className="w-full" disabled={isLocked || !chosenCareer} onClick={handleFindMentors}>
                                            Find Mentors
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Mentors for {chosenCareer?.title}</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Here are some established professionals in your field. Consider reaching out to them for guidance.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <div className="max-h-[60vh] overflow-y-auto p-1">
                                            {isMentorLoading ? (
                                                <div className="flex justify-center items-center h-32">
                                                    <Loader2 className="animate-spin text-primary" />
                                                </div>
                                            ) : mentors && mentors.mentors.length > 0 ? (
                                                <div className="space-y-4">
                                                    {mentors.mentors.map((mentor, i) => (
                                                        <div key={i} className="flex items-start gap-4 p-3 border rounded-lg">
                                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                                <Users className="w-5 h-5 text-muted-foreground" />
                                                            </div>
                                                            <div className="flex-grow">
                                                                <p className="font-semibold">{mentor.name}</p>
                                                                <p className="text-sm text-muted-foreground">{mentor.description}</p>
                                                            </div>
                                                            <Button asChild variant="ghost" size="sm">
                                                                <a href={mentor.profileUrl} target="_blank" rel="noopener noreferrer">
                                                                    <Linkedin />
                                                                </a>
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-center text-sm text-muted-foreground py-8">Could not find any mentors at this time.</p>
                                            )}
                                        </div>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Close</AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}
