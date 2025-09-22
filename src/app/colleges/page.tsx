"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, MapPin, Bookmark } from "lucide-react";
import Link from "next/link";
import { useResultsStore } from "@/hooks/use-results-store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CollegesPage() {
  const { savedColleges } = useResultsStore();

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Explore Colleges</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Find the perfect government and private colleges to launch your career.
        </p>
      </div>

      {savedColleges.length > 0 && (
        <div className="mb-12">
            <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2"><Bookmark /> My Saved Colleges</h2>
            <Card>
                <CardContent className="p-6 space-y-4">
                    {savedColleges.map((college, index) => (
                        <Alert key={index}>
                           <Building className="h-4 w-4" />
                           <AlertTitle>{college.collegeName}</AlertTitle>
                           <AlertDescription>{college.reason}</AlertDescription>
                        </Alert>
                    ))}
                </CardContent>
            </Card>
        </div>
      )}

      {savedColleges.length === 0 && (
         <div className="text-center mb-12 py-8 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold">No Saved Colleges Yet</h3>
            <p className="text-muted-foreground mt-2">Go to your <Button variant="link" asChild className="p-0"><Link href="/profile">Profile</Link></Button> to get personalized recommendations and save them here.</p>
        </div>
      )}

      <Card className="mb-8">
        <CardHeader>
            <CardTitle>Search All Colleges</CardTitle>
            <CardDescription>Use the filters below to search our entire database.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <p className="text-center text-muted-foreground col-span-full py-8">Search functionality is coming soon!</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
