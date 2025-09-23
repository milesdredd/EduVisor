
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, MapPin, Search, Loader2, Star, Milestone, IndianRupee, GraduationCap, Trash2, ShoppingBasket, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useResultsStore } from "@/hooks/use-results-store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { searchColleges, SearchCollegesOutput } from "@/ai/flows/search-colleges";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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
  const { addActivity, removeSavedCollege } = useResultsStore();

  const [location, setLocation] = useState("");
  const [distance, setDistance] = useState(500);
  const [stream, setStream] = useState("Computer Science");
  const [sortBy, setSortBy] = useState("ranking");
  const [searchResults, setSearchResults] = useState<SearchCollegesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const unsub = useResultsStore.subscribe(
      (state) => {
        setSavedColleges(state.savedColleges);
        if (state.quizAnswers?.location) {
          setLocation(state.quizAnswers.location as string);
        }
      }
    );

    // Initial sync
    setSavedColleges(store.savedColleges);
    if (store.quizAnswers?.location) {
        setLocation(store.quizAnswers.location as string);
    }
    
    return () => unsub();
  }, [store.savedColleges, store.quizAnswers]);


  const handleSearch = async () => {
    if (!location) {
      toast({
        variant: "destructive",
        title: "Location Required",
        description: "Please enter your location to search for colleges.",
      });
      return;
    }
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
      addActivity({ description: `Searched for '${stream}' colleges`, icon: 'Search' });
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
  
  const handleRemoveCollege = (collegeName: string) => {
    removeSavedCollege(collegeName);
    toast({
        title: "College Removed",
        description: `${collegeName} has been removed from your bucket.`,
    })
  }

  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Explore Colleges</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Find the perfect government colleges to launch your career.
        </p>
      </div>

      {savedColleges.length > 0 && (
        <div className="mb-12">
            <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2"><ShoppingBasket /> Career Bucket</h2>
            <Card>
                <CardContent className="p-6 space-y-4">
                    {savedColleges.map((college, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                           <div className="flex items-start gap-4">
                             <Building className="h-5 w-5 mt-1 text-primary" />
                             <div>
                               <p className="font-semibold">{college.collegeName}</p>
                               <p className="text-sm text-muted-foreground">{college.reason}</p>
                             </div>
                           </div>
                           <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Trash2 className="text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently remove '{college.collegeName}' from your Career Bucket.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRemoveCollege(college.collegeName)}>
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      )}

      {savedColleges.length === 0 && (
         <div className="text-center mb-12 py-8 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold">Your Career Bucket is Empty</h3>
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
                     <Button asChild size="sm">
                        <a href={college.websiteUrl} target="_blank" rel="noopener noreferrer">
                            Visit Site <ExternalLink className="ml-2" />
                        </a>
                     </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-center justify-between flex-wrap gap-x-6 gap-y-2 text-sm border-t pt-4">
                    <div className="flex items-center gap-2" title="Overall Rating">
                      <Star size={16} className="fill-primary text-primary" /> 
                      <span className="font-bold">{college.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-2" title="Distance from you"><Milestone /> {college.distance} km</div>
                    <div className="flex items-center gap-2" title="Approx. annual fees"><IndianRupee /> {college.fees}</div>
                    <div className="flex items-center gap-2" title="Ranking"><GraduationCap /> {college.ranking}</div>
                  </div>
                  <Alert className="mt-4">
                    <h4 className="font-semibold mb-2">Relevant Courses</h4>
                    <div className="flex flex-wrap gap-2">
                      {college.courses.map(course => (
                        <div key={course} className="text-sm bg-secondary text-secondary-foreground rounded px-2 py-1">{course}</div>
                      ))}
                    </div>
                  </Alert>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

    </div>
  );
}
