import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/hooks/useAuth";

import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Quiz from "@/pages/quiz";
import QuizResults from "@/pages/quiz-results";
import CareerDetails from "@/pages/career-details";
import Colleges from "@/pages/colleges";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <>
      <Navigation />
      <Switch>
        {isLoading || !isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/quiz" component={Quiz} />
            <Route path="/quiz-results" component={QuizResults} />
            <Route path="/career/:id" component={CareerDetails} />
            <Route path="/colleges" component={Colleges} />
            <Route path="/profile" component={Profile} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;