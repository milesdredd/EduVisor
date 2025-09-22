"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, MapPin } from "lucide-react";
import Link from "next/link";

export default function CollegesPage() {
  // Mock data - in a real app, this would be fetched from an API
  const colleges = [
    { name: 'National Institute of Technology, Warangal', location: 'Warangal, Telangana', fee: '₹1,50,000/year', ranking: 1 },
    { name: 'Indian Institute of Technology, Bombay', location: 'Mumbai, Maharashtra', fee: '₹2,20,000/year', ranking: 2 },
    { name: 'Vellore Institute of Technology', location: 'Vellore, Tamil Nadu', fee: '₹1,98,000/year', ranking: 3 },
  ];

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold font-headline">Explore Colleges</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Find the perfect government and private colleges to launch your career.
        </p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="distance">Distance from you (km)</Label>
              <Input id="distance" type="number" placeholder="e.g., 50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort">Sort by</Label>
               <Select>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fees-asc">Fees: Low to High</SelectItem>
                  <SelectItem value="fees-desc">Fees: High to Low</SelectItem>
                  <SelectItem value="ranking">Ranking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1 lg:col-span-2 flex justify-end">
              <Button>Search</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map((college) => (
          <Card key={college.name} className="flex flex-col transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="bg-muted p-3 rounded-lg">
                  <Building className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{college.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <MapPin className="w-4 h-4"/> {college.location}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <p><span className="font-semibold">Fees:</span> {college.fee}</p>
              <p><span className="font-semibold">Ranking:</span> #{college.ranking}</p>
            </CardContent>
            <div className="p-6 pt-0">
               <Button asChild variant="secondary" className="w-full">
                <Link href={`/colleges/${college.name.toLowerCase().replace(/, /g, '-').replace(/ /g, '-')}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
