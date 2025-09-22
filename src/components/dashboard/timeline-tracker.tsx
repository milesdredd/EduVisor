"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getTimelineEvents } from "@/ai/flows/timeline-tracker";
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";

interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  type: 'exam' | 'deadline' | 'custom';
}

interface TimelineTrackerProps {
    career?: string;
    isLocked?: boolean;
}

export function TimelineTracker({ career, isLocked = false }: TimelineTrackerProps) {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventDate, setNewEventDate] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        if (career) {
            const fetchEvents = async () => {
                setIsLoading(true);
                try {
                    const result = await getTimelineEvents({ career });
                    const fetchedEvents = result.events.map((e, index) => ({ ...e, id: index, type: e.type as 'exam' | 'deadline' }));
                    setEvents(fetchedEvents);
                } catch (error) {
                    console.error("Failed to fetch timeline events:", error);
                    toast({
                        variant: "destructive",
                        title: "Could not load timeline",
                        description: "Failed to fetch relevant exam dates.",
                    });
                } finally {
                    setIsLoading(false);
                }
            };
            fetchEvents();
        } else {
            setEvents([]);
        }
    }, [career, toast]);

    const handleAddEvent = () => {
        if (!newEventTitle || !newEventDate) {
            toast({
                variant: "destructive",
                title: "Missing fields",
                description: "Please provide both a title and a date.",
            });
            return;
        }
        const newEvent: TimelineEvent = {
            id: Date.now(),
            title: newEventTitle,
            date: newEventDate,
            type: 'custom',
        };
        setEvents(prev => [...prev, newEvent].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setNewEventTitle("");
        setNewEventDate("");
        toast({
            title: "Event Added",
            description: `'${newEvent.title}' has been added to your timeline.`
        });
    };
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CalendarDays />
                        Timeline Tracker
                    </div>
                     <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" disabled={isLocked}>
                                <PlusCircle className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add a Custom Event</DialogTitle>
                                <DialogDescription>
                                    Add a new exam, application deadline, or any other important date to your personal timeline.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="event-title" className="text-right">
                                        Title
                                    </Label>
                                    <Input
                                        id="event-title"
                                        value={newEventTitle}
                                        onChange={(e) => setNewEventTitle(e.target.value)}
                                        className="col-span-3"
                                        placeholder="e.g. BITSAT Application"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="event-date" className="text-right">
                                        Date
                                    </Label>
                                    <Input
                                        id="event-date"
                                        value={newEventDate}
                                        onChange={(e) => setNewEventDate(e.target.value)}
                                        className="col-span-3"
                                        placeholder="e.g. JUL 20"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                  <Button type="button" onClick={handleAddEvent}>Add Event</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardTitle>
                <CardDescription>Key dates for your upcoming applications and exams.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-24">
                        <Loader2 className="animate-spin text-primary" />
                    </div>
                ) : events.length > 0 ? (
                    events.map((event, index) => (
                        <div key={event.id}>
                            <div className="flex items-center">
                                <div className="bg-primary/20 text-primary p-2 rounded-md text-center w-16">
                                    <p className="font-bold text-sm uppercase">{event.date.split(' ')[0]}</p>
                                    <p className="font-bold text-2xl">{event.date.split(' ')[1]}</p>
                                </div>
                                <p className="ml-4 text-sm">{event.title}</p>
                            </div>
                            {index < events.length - 1 && <Separator className="my-4" />}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground p-4">
                        <p>Nothing on your timeline yet.</p>
                        <p className="text-sm">
                            <Button variant="link" asChild className="p-0"><Link href="/quiz">Take the assessment</Link></Button> or add a custom event now.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
