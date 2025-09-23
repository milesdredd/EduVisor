
"use client";

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Bot, CalendarCheck, HelpCircle, Loader2, ArrowRight, BookPlus } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getStudyPlan, StudyPlanOutput } from '@/ai/flows/study-plan';
import { askTutor, AskTutorOutput } from '@/ai/flows/ask-tutor';
import { useResultsStore } from '@/hooks/use-results-store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function StudyPlannerSkeleton() {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-1/4 mt-4" />
                </CardContent>
            </Card>
        </div>
    )
}

function StudyPlannerContent() {
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const { chosenCareer, addSyllabusItems } = useResultsStore();
    const careerParam = searchParams.get("career");

    // Use chosenCareer from the store as the primary source, fallback to param
    const career = chosenCareer?.title || careerParam;

    const [timeframeValue, setTimeframeValue] = useState(3);
    const [timeframeUnit, setTimeframeUnit] = useState("months");
    const [studyPlan, setStudyPlan] = useState<StudyPlanOutput | null>(null);
    const [isPlanLoading, setIsPlanLoading] = useState(false);

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState<AskTutorOutput | null>(null);
    const [isTutorLoading, setIsTutorLoading] = useState(false);

    const handleGetStudyPlan = async () => {
        if (!career) {
            toast({ variant: "destructive", title: "Career path not selected." });
            return;
        }
        setIsPlanLoading(true);
        setStudyPlan(null);
        try {
            const timeframe = `${timeframeValue} ${timeframeUnit}`;
            const result = await getStudyPlan({ career, timeframe });
            setStudyPlan(result);
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Failed to generate study plan." });
        } finally {
            setIsPlanLoading(false);
        }
    };

    const handleAskTutor = async () => {
        if (!career || !question) {
            toast({ variant: "destructive", title: "Career or question is missing." });
            return;
        }
        setIsTutorLoading(true);
        setAnswer(null);
        try {
            const result = await askTutor({ career, question });
            setAnswer(result);
        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "AI Tutor failed to respond." });
        } finally {
            setIsTutorLoading(false);
        }
    };

    const handleAddPlanToSyllabus = () => {
        if (!studyPlan) return;
        const allTopics = studyPlan.plan.flatMap(week => week.topics);
        addSyllabusItems(allTopics);
        toast({
            title: "Plan Added!",
            description: "Your study plan has been added to your syllabus on the dashboard.",
        });
    };

    if (!career) {
        return (
             <div className="text-center">
                <p className="text-muted-foreground">No career specified. Please select a career from your dashboard.</p>
                <Button asChild variant="link">
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><CalendarCheck /> Personalized Timetable</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <span className="text-sm font-medium">Make a</span>
                         <Input
                            type="number"
                            min="1"
                            value={timeframeValue}
                            onChange={(e) => setTimeframeValue(parseInt(e.target.value, 10))}
                            className="w-20"
                        />
                        <Select value={timeframeUnit} onValueChange={setTimeframeUnit}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weeks">Weeks</SelectItem>
                                <SelectItem value="months">Months</SelectItem>
                                <SelectItem value="years">Years</SelectItem>
                            </SelectContent>
                        </Select>
                         <span className="text-sm font-medium">planner</span>
                        <Button onClick={handleGetStudyPlan} disabled={isPlanLoading} size="icon" className="rounded-full">
                            {isPlanLoading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
                        </Button>
                    </div>

                    {isPlanLoading && <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>}
                    
                    {studyPlan && (
                        <div className="pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Your {`${timeframeValue} ${timeframeUnit}`} Study Plan</h3>
                                <Button onClick={handleAddPlanToSyllabus}>
                                    <BookPlus className="mr-2 h-4 w-4"/>
                                    Add to My Syllabus
                                </Button>
                            </div>
                            <Accordion type="single" collapsible className="w-full">
                                {studyPlan.plan.map((week, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger>{week.week}: <span className="text-primary ml-2">{week.focus}</span></AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="list-disc pl-6 space-y-2">
                                                {week.topics.map((topic, i) => (
                                                    <li key={i}>{topic}</li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    )}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><Bot /> AI Tutor</CardTitle>
                    <CardDescription>Have a complex question about your preparation? Ask our AI Tutor.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="e.g., Explain the difference between Concurrency and Parallelism for my computer science exam."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows={4}
                    />
                    <Button onClick={handleAskTutor} disabled={isTutorLoading}>
                        {isTutorLoading ? <Loader2 className="animate-spin" /> : <HelpCircle />}
                        Ask Question
                    </Button>

                    {isTutorLoading && <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>}

                    {answer && (
                        <Card className="bg-muted mt-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Tutor's Answer</CardTitle>
                            </CardHeader>
                            <CardContent>
                               <p className="whitespace-pre-wrap">{answer.answer}</p>
                            </CardContent>
                        </Card>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}


export default function StudyPlannerPage() {
    const searchParams = useSearchParams();
    const career = searchParams.get("career") || "your career";

    return (
        <div className="container mx-auto max-w-4xl py-12">
             <Button asChild variant="ghost" className="mb-8">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2" />
                    Back to Dashboard
                </Link>
            </Button>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline">AI Study Helper</h1>
                <p className="text-muted-foreground mt-2">
                    Your personal AI assistant to prepare for a career in {career}.
                </p>
            </div>
            <Suspense fallback={<StudyPlannerSkeleton />}>
                <StudyPlannerContent />
            </Suspense>
        </div>
    );
}
