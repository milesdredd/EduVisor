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
  const [isLoading, setIsLoading] = useState(true);
  const [careerSuggestions, setCareerSuggestions] = useState(store.careerSuggestions);

  useEffect(() => {
    // This effect synchronizes the component's state with the Zustand store
    // and handles the loading and redirection logic.
    const unsub = useResultsStore.subscribe(
      (state) => {
        if (state.careerSuggestions) {
          setCareerSuggestions(state.careerSuggestions);
          setIsLoading(false);
        } else if (!state.careerSuggestions && !isLoading) {
          // If suggestions are null and we are done loading, redirect.
          router.replace("/quiz");
        }
      }
    );

    // Initial check when component mounts
    if (store.careerSuggestions) {
      setCareerSuggestions(store.careerSuggestions);
      setIsLoading(false);
    } else {
      // If after a short delay there are still no suggestions, stop loading
      // The subscription above will handle the redirect.
      const timer = setTimeout(() => {
        if (!useResultsStore.getState().careerSuggestions) {
          setIsLoading(false);
          router.replace('/quiz');
        }
      }, 500); // Wait 500ms for hydration
      
      return () => clearTimeout(timer);
    }

    return () => unsub();
  }, [router, store.careerSuggestions, isLoading]);

  const handleRetakeQuiz = () => {
    store.reset();
    router.push("/quiz");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!careerSuggestions) {
    // This state will briefly be seen before the redirect logic in useEffect runs.
    // A loader is more appropriate here.
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
