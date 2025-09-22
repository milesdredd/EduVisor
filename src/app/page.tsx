"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BarChart2, Lightbulb, TrendingUp, RefreshCw, LayoutDashboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useResultsStore } from "@/hooks/use-results-store";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const { chosenCareer, reset } = useResultsStore();
  const router = useRouter();

  const handleStartAgain = () => {
    reset();
    router.push('/quiz');
  };

  return (
    <div className="flex flex-col">
      <section className="container mx-auto px-4 py-16 sm:py-20 md:py-28">
        <div className="grid grid-cols-1 items-center gap-12">
          <div className="space-y-6 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {chosenCareer 
                ? `Welcome Back! Let's Continue Your Journey.`
                : `Discover a Career That Aligns With You`
              }
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {chosenCareer
                ? `You're on the path to becoming a ${chosenCareer.title}. Your dashboard is ready with personalized resources to guide you.`
                : `Take our comprehensive assessment to discover career paths that align with your unique strengths and interests. Your future starts now.`
              }
            </p>
            <div className="flex gap-4 justify-center">
              {chosenCareer ? (
                <>
                  <Button asChild size="lg">
                    <Link href="/dashboard">
                      Go to Dashboard
                      <LayoutDashboard className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button onClick={handleStartAgain} size="lg" variant="outline">
                    Start Again
                    <RefreshCw className="ml-2 h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Button asChild size="lg">
                  <Link href="/quiz">
                    Take The Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-muted py-20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold">Why Your Degree Matters</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Investing in your education opens doors to greater opportunities and a more fulfilling life.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <TrendingUp className="w-8 h-8 text-primary" />
                <CardTitle>Higher Earning Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">College graduates, on average, earn significantly more over their lifetimes than those with only a high school diploma.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <Lightbulb className="w-8 h-8 text-primary" />
                <CardTitle>Expanded Career Options</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">A degree qualifies you for a wider range of specialized and high-skilled jobs across numerous industries.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <BarChart2 className="w-8 h-8 text-primary" />
                <CardTitle>Job Market Stability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Individuals with higher education often experience lower unemployment rates and greater job security.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-20 text-center">
         <h2 className="font-headline text-3xl font-bold">Success Stories in Numbers</h2>
         <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">Our platform has guided thousands of students towards their ideal career paths.</p>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            <div>
              <p className="text-5xl font-bold text-primary">95%</p>
              <p className="text-muted-foreground mt-2">Reported higher confidence in their career choice</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary">8M+</p>
              <p className="text-muted-foreground mt-2">Career suggestions delivered</p>
            </div>
             <div>
              <p className="text-5xl font-bold text-primary">500+</p>
              <p className="text-muted-foreground mt-2">University courses cataloged</p>
            </div>
         </div>
      </section>

    </div>
  );
}
