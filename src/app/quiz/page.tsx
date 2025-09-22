
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QuizForm } from "@/components/quiz/quiz-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useResultsStore } from '@/hooks/use-results-store';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function QuizPage() {
  const router = useRouter();
  const store = useResultsStore();
  const [careerSuggestions, setCareerSuggestions] = useState(store.careerSuggestions);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setCareerSuggestions(store.careerSuggestions);
    setIsClient(true);
  }, [store.careerSuggestions]);

  const handleRetakeQuiz = () => {
    store.reset();
  };

  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (careerSuggestions) {
    return (
      <div className="container mx-auto max-w-2xl py-12">
        <Card className="shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">You've Already Taken the Quiz!</CardTitle>
            <CardDescription>
              Your personalized career suggestions are waiting for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <Button asChild size="lg">
              <Link href="/results">
                View My Results
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <div className="w-full space-y-4 pt-4">
              <Separator />
              <p className="text-sm text-muted-foreground italic">
                "Not satisfied? Your path is yours to redefine."
              </p>
              <Button variant="outline" onClick={handleRetakeQuiz}>
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Career Quiz</CardTitle>
          <CardDescription>
            Answer a few questions to discover your personalized career path.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QuizForm />
        </CardContent>
      </Card>
    </div>
  );
}
