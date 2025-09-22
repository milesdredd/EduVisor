import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Discover Your Future Career Path
          </h1>
          <p className="text-lg text-muted-foreground">
            Unsure about your career? PathFinder's intelligent quiz analyzes your interests and skills to suggest personalized career and education paths just for you.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/quiz">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
            <Image
              src="https://picsum.photos/seed/pathfinder-hero/600/500"
              alt="An inspiring image of a person looking towards a horizon"
              width={600}
              height={500}
              className="rounded-xl shadow-2xl"
              data-ai-hint="inspiring horizon"
            />
        </div>
      </div>
    </div>
  );
}
