
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useResultsStore } from '@/hooks/use-results-store';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Compass, BookOpen, Newspaper, Target, Bot, Users, ArrowRight, Lock } from 'lucide-react';
import type { CheckedState } from '@radix-ui/react-checkbox';
import { TimelineTracker } from '@/components/dashboard/timeline-tracker';

// Mock data for syllabus - in a real app, this might come from an API based on the chosen career
const MOCK_SYLLABUS = [
  { id: 'syllabus1', label: 'Data Structures & Algorithms' },
  { id: 'syllabus2', label: 'System Design Principles' },
  { id: 'syllabus3', label: 'Fundamentals of Product Management' },
];

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


export default function DashboardPage() {
    const store = useResultsStore();
    const [chosenCareer, setChosenCareer] = useState(store.chosenCareer);
    const [careerSuggestions, setCareerSuggestions] = useState(store.careerSuggestions);
    const isLocked = !chosenCareer && !careerSuggestions;
    const timelineCareer = chosenCareer?.title || careerSuggestions?.suggestions?.[0]?.career;


    useEffect(() => {
        const unsub = useResultsStore.subscribe((state) => {
            setChosenCareer(state.chosenCareer);
            setCareerSuggestions(state.careerSuggestions);
        });
        return () => unsub();
    }, []);

    const [syllabusProgress, setSyllabusProgress] = useState<Record<string, boolean>>({
      syllabus1: false,
      syllabus2: false,
      syllabus3: false, 
    });

    const handleSyllabusChange = (id: string, checked: CheckedState) => {
        setSyllabusProgress(prev => ({ ...prev, [id]: !!checked }));
    };

    const overallProgress = Math.round(
      (Object.values(syllabusProgress).filter(Boolean).length / MOCK_SYLLABUS.length) * 100
    );
    
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                {isLocked && <LockedDashboardOverlay />}

                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Target /> Syllabus & Milestones</CardTitle>
                            <CardDescription>Track your progress through the required subjects and skills.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {MOCK_SYLLABUS.map(item => (
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
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BookOpen /> Top Resources</CardTitle>
                            <CardDescription>Curated books and articles to get you started.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p>1. "Cracking the PM Interview" by Gayle Laakmann McDowell</p>
                            <p>2. "Inspired: How to Create Tech Products Customers Love" by Marty Cagan</p>
                        </CardContent>
                         <CardFooter>
                            <Button variant="secondary" disabled={isLocked}>Explore More Resources</Button>
                        </CardFooter>
                    </Card>
                    
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Newspaper /> Latest News & Trends</CardTitle>
                            <CardDescription>Stay updated with what's happening in the world of {chosenCareer ? chosenCareer.title : "your future career"}.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="font-medium">AI's Impact on Product Management is Growing</p>
                            <p className="text-sm text-muted-foreground">Product managers are increasingly leveraging AI tools for market analysis and feature prioritization...</p>
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
                            <Button className="w-full" disabled={isLocked}>
                                Create My Study Plan <ArrowRight className="ml-2"/>
                            </Button>
                        </CardFooter>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Users /> Talk to a Mentor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Connect with industry professionals.</p>
                            <Badge variant="outline" className="mt-2">Coming Soon</Badge>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
