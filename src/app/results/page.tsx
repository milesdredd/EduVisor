"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useResultsStore } from "@/hooks/use-results-store";
import { CareerSuggestions } from "@/components/results/career-suggestions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function ResultsPage() {
  const router = useRouter();
  const store = useResultsStore();
  const [careerSuggestions, setCareerSuggestions] = useState(store.careerSuggestions);

  useEffect(() => {
    setCareerSuggestions(store.careerSuggestions);
    if (!store.careerSuggestions) {
      router.replace("/quiz");
    }
  }, [store.careerSuggestions, router]);

  const handleRetakeQuiz = () => {
    store.reset();
    router.push("/quiz");
  };

  if (!careerSuggestions) {
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
