"use client";

import { ArrowLeft, BookOpen, Briefcase, Wallet, PlusCircle, Search, Sparkles, TrendingUp, Loader2 } from "lucide-react";
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
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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


export default function CareerDetailPage({ params }: { params: { slug: string } }) {
  const [career, setCareer] = useState<CareerDetailsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
        setIsLoading(true);
        try {
            const careerTitle = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const details = await getCareerDetails({ career: careerTitle });
            setCareer(details);
        } catch (error) {
            console.error("Failed to fetch career details:", error);
            // Optionally, set some error state to show in the UI
        } finally {
            setIsLoading(false);
        }
    };

    fetchDetails();
  }, [params.slug]);


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
            <CardTitle className="text-4xl font-headline">{career.title}</CardTitle>
            <CardDescription>
                A comprehensive look at the career path of a {career.title}.
            </CardDescription>
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
                 <Button>
                    <Search className="mr-2 h-4 w-4" /> Explore Colleges for this Path
                </Button>
            </CardContent>
        </Card>

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
