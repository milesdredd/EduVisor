"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getMoreResources, MoreResourcesOutput } from "@/ai/flows/more-resources";
import { ArrowLeft, Book, ExternalLink, Film, Newspaper, Rss } from "lucide-react";

function ResourcesSkeleton() {
    return (
        <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/4 mt-2" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6 mt-2" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

const iconMap = {
    book: Book,
    article: Newspaper,
    video: Film,
    course: Rss,
};

function ResourcesContent() {
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const [resources, setResources] = useState<MoreResourcesOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const career = searchParams.get("career");

    useEffect(() => {
        if (career) {
            const fetchResources = async () => {
                setIsLoading(true);
                try {
                    const result = await getMoreResources({ career });
                    setResources(result);
                } catch (error) {
                    console.error("Failed to fetch resources:", error);
                    toast({
                        variant: "destructive",
                        title: "Error loading resources",
                        description: "Could not load personalized resources. Please try again later.",
                    });
                } finally {
                    setIsLoading(false);
                }
            };
            fetchResources();
        } else {
            setIsLoading(false);
        }
    }, [career, toast]);

    if (isLoading) {
        return <ResourcesSkeleton />;
    }

    if (!career) {
        return (
            <div className="text-center">
                <p className="text-muted-foreground">No career specified. Please go back to the dashboard.</p>
                <Button asChild variant="link">
                    <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
            </div>
        )
    }

    if (!resources || resources.resources.length === 0) {
        return (
            <div className="text-center">
                <p className="text-muted-foreground">Could not find any resources for '{career}'.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {resources.resources.map((resource, index) => {
                const Icon = iconMap[resource.type] || Book;
                return (
                    <Card key={index}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="flex items-center gap-3">
                                        <Icon className="text-primary" />
                                        {resource.title}
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                        {resource.summary}
                                    </CardDescription>
                                </div>
                                <Badge variant="secondary" className="capitalize">{resource.type}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    Go to Resource <ExternalLink className="ml-2" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}


export default function ResourcesPage() {
    const searchParams = useSearchParams();
    const career = searchParams.get("career") || "your career";

    return (
        <div className="container mx-auto max-w-3xl py-12">
            <Button asChild variant="ghost" className="mb-8">
                <Link href="/dashboard">
                    <ArrowLeft className="mr-2" />
                    Back to Dashboard
                </Link>
            </Button>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-headline">Explore Resources</h1>
                <p className="text-muted-foreground mt-2">
                    A curated list of articles, videos, and courses for the path of a {career}.
                </p>
            </div>
            <Suspense fallback={<ResourcesSkeleton />}>
                <ResourcesContent />
            </Suspense>
        </div>
    );
}