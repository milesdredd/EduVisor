
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, PlusCircle, Loader2, Trash2, Pencil } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { format, differenceInDays, parseISO, isPast } from 'date-fns';


interface TimelineEvent {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD format
  type: 'exam' | 'deadline' | 'custom';
}

interface TimelineTrackerProps {
    career?: string;
    educationLevel?: string;
    isLocked?: boolean;
}

export function TimelineTracker({ career, educationLevel, isLocked = false }: TimelineTrackerProps) {
    const [events, setEvents] = useState<TimelineEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // State for adding a new event
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventDate, setNewEventDate] = useState("");

    // State for editing an event
    const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
    const [editEventTitle, setEditEventTitle] = useState("");
    const [editEventDate, setEditEventDate] = useState("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    useEffect(() => {
        if (career && educationLevel) {
            const fetchEvents = async () => {
                setIsLoading(true);
                try {
                    const result = await getTimelineEvents({ career, educationLevel });
                    const fetchedEvents = result.events.map((e, index) => ({ ...e, id: Date.now() + index, type: e.type as 'exam' | 'deadline' }));
                    setEvents(fetchedEvents.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
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
    }, [career, educationLevel]);

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
    
    const handleRemoveEvent = (eventId: number) => {
        setEvents(prev => prev.filter(event => event.id !== eventId));
        toast({
            title: "Event Removed",
            description: `The event has been removed from your timeline.`
        });
    }

    const handleOpenEditDialog = (event: TimelineEvent) => {
        setEditingEvent(event);
        setEditEventTitle(event.title);
        setEditEventDate(event.date);
        setIsEditDialogOpen(true);
    };

    const handleUpdateEvent = () => {
        if (!editingEvent) return;

        setEvents(prev => prev.map(event => 
            event.id === editingEvent.id 
            ? { ...event, title: editEventTitle, date: editEventDate } 
            : event
        ).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));

        toast({
            title: "Event Updated",
            description: `'${editEventTitle}' has been updated.`
        });
        setIsEditDialogOpen(false);
        setEditingEvent(null);
    };


    const getEventStatus = (date: string): 'past' | 'soon' | 'future' => {
        try {
            const eventDate = parseISO(date);
            const now = new Date();
            
            if (isPast(eventDate) && !format(eventDate, 'yyyy-MM-dd').includes(format(now, 'yyyy-MM-dd'))) {
                return 'past';
            }
            
            const daysUntil = differenceInDays(eventDate, now);
            if (daysUntil <= 30 && daysUntil >= 0) {
                return 'soon';
            }

            return 'future';
        } catch (e) {
            return 'future';
        }
    }
    
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
                                        type="date"
                                        value={newEventDate}
                                        onChange={(e) => setNewEventDate(e.target.value)}
                                        className="col-span-3"
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
                    events.map((event, index) => {
                        const eventDate = parseISO(event.date);
                        const status = getEventStatus(event.date);

                        return(
                            <div key={event.id} className="group">
                                <div className="flex items-center">
                                    <div className={cn("text-center w-20 p-2 rounded-md", 
                                       status === 'past' && 'bg-destructive/10 text-destructive-foreground',
                                       status === 'soon' && 'bg-yellow-400/20 text-yellow-700 dark:text-yellow-400',
                                       status === 'future' && 'bg-primary/20 text-primary',
                                    )}>
                                        <p className="font-bold text-sm uppercase">{format(eventDate, 'MMM')}</p>
                                        <p className="font-bold text-2xl">{format(eventDate, 'dd')}</p>
                                        <p className="font-bold text-xs">{format(eventDate, 'yyyy')}</p>
                                    </div>
                                    <p className={cn("ml-4 text-sm flex-grow", status === 'past' && 'line-through text-muted-foreground')}>
                                        {event.title}
                                    </p>
                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 hover:bg-muted"
                                            onClick={() => handleOpenEditDialog(event)}
                                        >
                                            <Pencil className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 hover:bg-destructive/10"
                                            onClick={() => handleRemoveEvent(event.id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </div>
                                {index < events.length - 1 && <Separator className="my-4" />}
                            </div>
                        )
                    })
                ) : (
                    <div className="text-center text-muted-foreground p-4">
                         {isLocked ? (
                            <>
                                <p>Nothing on your timeline yet.</p>
                                <p className="text-sm">
                                    <Button variant="link" asChild className="p-0"><Link href="/quiz">Take the assessment</Link></Button> to see relevant dates.
                                </p>
                            </>
                         ) : (
                            <p>No relevant dates found. Add a custom event!</p>
                         )}
                    </div>
                )}
            </CardContent>
             {/* Edit Event Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>
                            Update the details for your event.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-event-title" className="text-right">
                                Title
                            </Label>
                            <Input
                                id="edit-event-title"
                                value={editEventTitle}
                                onChange={(e) => setEditEventTitle(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="edit-event-date" className="text-right">
                                Date
                            </Label>
                            <Input
                                id="edit-event-date"
                                type="date"
                                value={editEventDate}
                                onChange={(e) => setEditEventDate(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleUpdateEvent}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );

}
