"use client";

import { useState } from "react";
import { useResultsStore } from "@/hooks/use-results-store";
import { getCollegeRecommendations } from "@/ai/flows/college-recommendations";
import { Button } from "@/components/ui/button";
import { GraduationCap, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export function CollegeRecommendations() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { quizAnswers, careerSuggestions, collegeRecommendations, setCollegeRecommendations } = useResultsStore();

  const handleFetchRecommendations = async () => {
    if (!careerSuggestions) return;

    const educationLevel = quizAnswers?.educationLevel as string;
    if (!educationLevel) {
        toast({
            variant: "destructive",
            title: "Quiz not taken",
            description: "Please take the assessment quiz to get college recommendations.",
        });
        return;
    }

    setIsLoading(true);
    try {
      const suggestedCareers = careerSuggestions.suggestions.map(s => s.career);
      const recommendations = await getCollegeRecommendations({ suggestedCareers, educationLevel });
      setCollegeRecommendations(recommendations);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get college recommendations. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-2">
        <GraduationCap className="h-8 w-8 text-primary" />
        <h2 className="text-3xl font-bold font-headline">College Recommendations</h2>
      </div>

      {!collegeRecommendations && (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Ready to see which colleges can help you achieve these careers?</p>
          <Button onClick={handleFetchRecommendations} disabled={isLoading} size="lg">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Find Colleges
          </Button>
        </div>
      )}

      {collegeRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Colleges & Tracks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              {collegeRecommendations.collegeRecommendations.map((rec, index) => (
                <li key={index}>{rec.collegeName}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
