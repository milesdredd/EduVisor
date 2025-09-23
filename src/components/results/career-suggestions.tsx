"use client";

import Link from "next/link";
import { Lightbulb, TrendingUp, ArrowRight } from "lucide-react";
import type { PersonalizedCareerSuggestionsOutput } from "@/ai/flows/personalized-career-suggestions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CareerSuggestionsProps {
  suggestions: PersonalizedCareerSuggestionsOutput;
}

export function CareerSuggestions({ suggestions }: CareerSuggestionsProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-2">
        <Lightbulb className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold font-headline">Career Suggestions</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.suggestions.sort((a,b) => b.suitabilityScore - a.suitabilityScore).map((suggestion) => (
          <Card key={suggestion.career} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <CardTitle>{suggestion.career}</CardTitle>
              <CardDescription>{suggestion.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center gap-2">
                 <TrendingUp className="h-5 w-5 text-muted-foreground" />
                 <p className="text-sm text-muted-foreground">Suitability Score</p>
                 <Badge variant="secondary" className="font-bold">{suggestion.suitabilityScore}%</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={`/career/${encodeURIComponent(suggestion.career.toLowerCase().replace(/ /g, '-'))}`}>
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
