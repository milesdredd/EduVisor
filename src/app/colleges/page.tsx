
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, MapPin, Bookmark, Search, Loader2, Star, Milestone, IndianRupee, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useResultsStore } from "@/hooks/use-results-store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { searchColleges, SearchCollegesOutput } from "@/ai/flows/search-colleges";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

function SearchResultSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <div className="h-5 bg-muted rounded w-1/4"></div>
              <div className="h-5 bg-muted rounded w-1/4"></div>
              <div className="h-5 bg-muted rounded w-1/4"></div>
            </div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function CollegesPage() {
  const store = useResultsStore();
  const [savedColleges, setSavedColleges] = useState(store.savedColleges);
  const { toast } = useToast();

  const [location, setLocation] = useState(store.quizAnswers?.location as string || "");
  const [distance, setDistance] = useState(500);
  const [stream, setStream] = useState("Computer Science");
  const [sortBy, setSortBy] = useState("ranking");
  const [searchResults, setSearchResults] = useState<SearchCollegesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSavedColleges(store.savedColleges);
    if (store.quizAnswers?.location) {
      setLocation(store.quizAnswers.location as string);
    }
  }, [store.savedColleges, store.quizAnswers]);


  const handleSearch = async () => {
    setIsLoading(true);
    setSearchResults(null);
    try {
      const results = await searchColleges({
        userLocation: location,
        maxDistance: distance,
        stream: stream,
        sortBy: sortBy as "ranking" | "fees" | "distance",
      });
      setSearchResults(results);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "Could not fetch college search results. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <CardTitle>Search All Government Colleges</CardTitle>
            <CardDescription>Use the filters below to search our entire database of Indian government colleges.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Location (City, State)</label>
              <Input placeholder="e.g. Mumbai, Maharashtra" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stream / Career</label>
              <Input placeholder="e.g. Mechanical Engineering" value={stream} onChange={(e) => setStream(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Max Distance</label>
                <span className="text-sm font-bold text-primary">{distance} km</span>
              </div>
              <Slider defaultValue={[distance]} max={2000} step={50} onValueChange={(val) => setDistance(val[0])} />
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ranking">Ranking</SelectItem>
                  <SelectItem value="fees">Fees</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-start-2 lg:col-start-3">
              <Button onClick={handleSearch} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isLoading && <SearchResultSkeleton />}

      {searchResults && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-headline text-center">Search Results ({searchResults.colleges.length})</h2>
          {searchResults.colleges.length === 0 ? (
            <p className="text-center text-muted-foreground">No colleges found matching your criteria. Try expanding your search.</p>
          ) : (
            searchResults.colleges.map((college) => (
              <Card key={college.collegeName}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{college.collegeName}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1"><MapPin size={14}/> {college.location}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-primary">
                      <Star size={16} className="fill-primary" /> {college.rating.toFixed(1)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2"><Milestone /> <strong>Distance:</strong> {college.distance} km</div>
                    <div className="flex items-center gap-2"><IndianRupee /> <strong>Fees:</strong> {college.fees}</div>
                    <div className="flex items-center gap-2"><GraduationCap /> <strong>Ranking:</strong> {college.ranking}</div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Relevant Courses</h4>
                    <div className="flex flex-wrap gap-2">
                      {college.courses.map(course => (
                        <div key={course} className="text-sm bg-secondary text-secondary-foreground rounded px-2 py-1">{course}</div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

    </div>
  );
}
