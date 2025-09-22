"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { personalizedCareerSuggestions } from "@/ai/flows/personalized-career-suggestions";
import { useResultsStore } from "@/hooks/use-results-store";
import { quizQuestions, type QuizQuestion } from "@/lib/quiz-questions";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const createSchema = (questions: QuizQuestion[]) => {
  const schemaObject = questions.reduce((acc, q) => {
    if (q.type === 'radio') {
      acc[q.id] = z.string({ required_error: "Please select an option." });
    } else if (q.type === 'checkbox') {
      acc[q.id] = z.array(z.string()).min(1, "Please select at least one skill.").max(3, "You can only select up to 3 skills.");
    }
    return acc;
  }, {} as Record<string, z.ZodType<any, any>>);
  return z.object(schemaObject);
};

const formSchema = createSchema(quizQuestions);

type QuizFormValues = z.infer<typeof formSchema>;

export function QuizForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setQuizAnswers, setCareerSuggestions, reset } = useResultsStore();
  const { toast } = useToast();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interest: '',
      aptitude: '',
      skills: [],
      personality: ''
    },
  });

  const progress = ((currentStep + 1) / quizQuestions.length) * 100;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === quizQuestions.length - 1;

  async function handleNext() {
    const questionId = quizQuestions[currentStep].id as keyof QuizFormValues;
    const isValid = await form.trigger(questionId);
    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function handlePrevious() {
    setCurrentStep((prev) => prev - 1);
  }

  async function onSubmit(data: QuizFormValues) {
    setIsSubmitting(true);
    setQuizAnswers(data);

    try {
      // The AI flow currently only supports interest, skills, and personality.
      // We will need to update it to include aptitude.
      // For now, we omit it from the call.
      const suggestions = await personalizedCareerSuggestions({
        interest: data.interest as string,
        skills: data.skills as string[],
        personality: data.personality as string,
      });

      if (suggestions && suggestions.suggestions.length > 0) {
        setCareerSuggestions(suggestions);
        router.push("/results");
      } else {
        throw new Error("Could not generate career suggestions.");
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get career suggestions. Please try again.",
      });
      reset();
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentQuestion = quizQuestions[currentStep];

  return (
    <div className="space-y-8">
      <Progress value={progress} className="w-full" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name={currentQuestion.id as keyof QuizFormValues}
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-xl font-semibold">{currentQuestion.question}</FormLabel>
                <FormControl>
                  {currentQuestion.type === 'radio' ? (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value as string}
                      className="space-y-2"
                    >
                      {currentQuestion.options.map((option) => (
                        <FormItem key={option} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 transition-all hover:bg-accent/50 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:text-accent-foreground">
                          <FormControl>
                            <RadioGroupItem value={option} />
                          </FormControl>
                          <FormLabel className="font-normal">{option}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  ) : (
                    <div className="space-y-2">
                      {(currentQuestion.options || []).map((option) => {
                        const skillsValue = (form.watch('skills') as string[]) || [];
                        const skillsCount = skillsValue.length;
                        return (
                          <FormItem key={option} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 transition-all hover:bg-accent/50 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:text-accent-foreground">
                            <FormControl>
                              <Checkbox
                                checked={skillsValue.includes(option)}
                                disabled={skillsCount >= 3 && !skillsValue.includes(option)}
                                onCheckedChange={(checked) => {
                                  const currentValue = skillsValue;
                                  if (checked) {
                                      if (currentValue.length < 3) {
                                          field.onChange([...currentValue, option]);
                                      }
                                  } else {
                                      field.onChange(currentValue.filter(value => value !== option));
                                  }
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{option}</FormLabel>
                          </FormItem>
                        );
                      })}
                    </div>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={handlePrevious} disabled={isFirstStep}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            {isLastStep ? (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Get Results
              </Button>
            ) : (
              <Button type="button" onClick={handleNext}>
                Next <ArrowRight className="ml-2 h-4" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
