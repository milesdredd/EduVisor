"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useResultsStore } from "@/hooks/use-results-store";
import { CareerSuggestions } from "@/components/results/career-suggestions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const { careerSuggestions, reset } = useResultsStore((state) => ({
    careerSuggestions: state.careerSuggestions,
    reset: state.reset,
  }));

  useEffect(() => {
    // If there are no results, redirect to the quiz.
    // This prevents accessing the page directly.
    if (!careerSuggestions) {
      router.replace("/quiz");
    }
  }, [careerSuggestions, router]);

  const handleRetakeQuiz = () => {
    reset();
    router.push("/quiz");
  };

  if (!careerSuggestions) {
    // Render a loader or null while redirecting
    return (
      <div className="flex h-screen items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 space-y-12">
      <div>
        <h1 className="text-4xl font-bold font-headline text-center">Your Personalized Path</h1>
        <p className="text-muted-foreground text-center mt-2">
          Based on your quiz answers, here are some career paths that might be a great fit for you.
        </p>
      </div>
      
      <CareerSuggestions suggestions={careerSuggestions} />

      <Separator />

      <div className="text-center">
        <Button onClick={handleRetakeQuiz}>Retake Quiz</Button>
      </div>
    </div>
  );
}
