interface Program {
  name: string;
}

interface Facility {
  name: string;
}

import { College } from "@shared/schema";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Search, MapPin, Star, Check, Filter } from "lucide-react";
import { useEffect } from "react";

export default function Colleges() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStream, setSelectedStream] = useState("All Streams");
  const [selectedDistance, setSelectedDistance] = useState("Within 50 km");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const {
    data: colleges,
    isLoading: collegesLoading,
    error,
  } = useQuery<College[]>({
    queryKey: ["/api/colleges", selectedStream, searchQuery],
    enabled: isAuthenticated,
    retry: false,
  });

  const streams = [
    "All Streams",
    "Engineering", 
    "Medical",
    "Arts & Science",
    "Commerce",
    "Management"
  ];

  const distances = [
    "Within 10 km",
    "Within 25 km", 
    "Within 50 km",
    "Any distance"
  ];

  const handleSearch = () => {
    // Search functionality will be triggered by query key changes
    toast({
      title: "Search Updated",
      description: "Searching for colleges matching your criteria...",
    });
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && isUnauthorizedError(error as Error)) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12 fade-in">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Government Colleges Directory</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover top government colleges near you with detailed information about programs, fees, and facilities
          </p>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border card-gradient">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Search Colleges</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="College name or location"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                      data-testid="input-search-colleges"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Stream</label>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                      value={selectedStream}
                      onChange={(e) => setSelectedStream(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground appearance-none"
                      data-testid="select-stream"
                    >
                      {streams.map((stream) => (
                        <option key={stream} value={stream}>
                          {stream}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Distance</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select
                      value={selectedDistance}
                      onChange={(e) => setSelectedDistance(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground appearance-none"
                      data-testid="select-distance"
                    >
                      {distances.map((distance) => (
                        <option key={distance} value={distance}>
                          {distance}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleSearch}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  data-testid="button-search-colleges"
                >
                  Search Colleges
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {collegesLoading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading colleges...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isUnauthorizedError(error as Error) && (
          <div className="text-center py-12">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-destructive mb-2">Error Loading Colleges</h3>
              <p className="text-muted-foreground">Failed to load colleges. Please try again later.</p>
            </div>
          </div>
        )}

        {/* Colleges Grid */}
        {colleges && colleges.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {colleges.map((college: any) => (
              <div
                key={college.id}
                className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-border hover-scale card-gradient shimmer relative overflow-hidden"
                data-testid={`college-card-${college.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={college.imageUrl || "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120"}
                      alt={`${college.name} campus`}
                      className="w-16 h-16 rounded-xl object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&h=120";
                      }}
                    />
                    <div>
                      <h3 className="text-xl font-bold mb-1 text-foreground" data-testid={`college-name-${college.id}`}>
                        {college.name}
                      </h3>
                      <p className="text-muted-foreground text-sm flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {college.location} • {college.distance ? `${college.distance.toFixed(1)} km away` : 'Distance unknown'}
                      </p>
                      {college.rating && (
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(college.rating) ? 'fill-current' : ''}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{college.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                    {college.type}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-semibold text-lg text-primary">
                      ₹{college.fees ? (college.fees / 1000).toFixed(0) : '0'}K
                    </div>
                    <p className="text-xs text-muted-foreground">Annual Fees</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-semibold text-lg text-accent">
                      {college.cutoffRank || 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground">Cut-off</p>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="font-semibold text-lg text-purple-500">
                      {college.placementRate ? `${college.placementRate}%` : 'N/A'}
                    </div>
                    <p className="text-xs text-muted-foreground">Placements</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-foreground">Available Programs</h4>
                  <div className="flex flex-wrap gap-2">
                    {college.programs?.slice(0, 3).map((program: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                      >
                        {program}
                      </span>
                    ))}
                    {college.programs?.length > 3 && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                        +{college.programs.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-2 text-foreground">Facilities</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {(college.facilities as Facility[])?.slice(0, 4).map((facility, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-accent" />
                        <span className="text-muted-foreground">{facility.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    className="flex-1 py-2 bg-primary/10 text-primary rounded-lg font-semibold hover:bg-primary/20 transition-colors"
                    data-testid={`button-view-details-${college.id}`}
                  >
                    View Details
                  </button>
                  <button
                    className="flex-1 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    data-testid={`button-apply-${college.id}`}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {colleges && colleges.length === 0 && !collegesLoading && (
          <div className="text-center py-12">
            <div className="bg-muted/50 rounded-lg p-8 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-foreground mb-2">No Colleges Found</h3>
              <p className="text-muted-foreground mb-4">
                No colleges match your current search criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStream("All Streams");
                  setSelectedDistance("Within 50 km");
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                data-testid="button-clear-filters"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Load More */}
        {colleges && colleges.length > 0 && (
          <div className="text-center mt-12">
            <button
              className="px-8 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
              data-testid="button-load-more"
            >
              Load More Colleges
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
