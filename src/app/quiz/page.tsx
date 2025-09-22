"use client";

import { QuizForm } from "@/components/quiz/quiz-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function QuizPage() {
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
