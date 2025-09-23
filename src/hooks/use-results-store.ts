
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PersonalizedCareerSuggestionsOutput } from '@/ai/flows/personalized-career-suggestions';
import type { CollegeRecommendationsOutput } from '@/ai/flows/college-recommendations';
import type { CareerDetailsOutput } from '@/ai/flows/career-details';
import type { LucideIcon } from 'lucide-react';

interface SavedCollege {
  collegeName: string;
  reason: string;
  websiteUrl?: string;
  entranceExams: string[];
  admissionCriteria: string;
}

interface UserData {
    username: string;
    email: string;
}

interface Activity {
    id: string;
    timestamp: number;
    description: string;
    icon: 'FileText' | 'Briefcase' | 'Building' | 'Search';
}

interface ResultsState {
  quizAnswers: Record<string, string | string[]>;
  careerSuggestions: PersonalizedCareerSuggestionsOutput | null;
  collegeRecommendations: CollegeRecommendationsOutput | null;
  chosenCareer: CareerDetailsOutput | null;
  savedColleges: SavedCollege[];
  isAuthenticated: boolean;
  user: UserData | null;
  activityLog: Activity[];
  setQuizAnswers: (answers: Record<string, string | string[]>) => void;
  setCareerSuggestions: (suggestions: PersonalizedCareerSuggestionsOutput) => void;
  setCollegeRecommendations: (recommendations: CollegeRecommendationsOutput) => void;
  setChosenCareer: (career: CareerDetailsOutput | null) => void;
  addSavedCollege: (college: SavedCollege) => void;
  removeSavedCollege: (collegeName: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  login: (userData: UserData) => void;
  logout: () => void;
  reset: () => void;
}

const initialState: Omit<ResultsState, 'setQuizAnswers' | 'setCareerSuggestions' | 'setCollegeRecommendations' | 'setChosenCareer' | 'addSavedCollege' | 'removeSavedCollege' | 'addActivity' | 'login' | 'logout' | 'reset'> = {
  quizAnswers: {},
  careerSuggestions: null,
  collegeRecommendations: null,
  chosenCareer: null,
  savedColleges: [],
  isAuthenticated: false,
  user: null,
  activityLog: [],
};

export const useResultsStore = create<ResultsState>()(
  persist(
    (set) => ({
      ...initialState,
      setQuizAnswers: (answers) => set((state) => ({ ...state, quizAnswers: answers })),
      setCareerSuggestions: (suggestions) => set((state) => ({ ...state, careerSuggestions: suggestions })),
      setCollegeRecommendations: (recommendations) => set((state) => ({ ...state, collegeRecommendations: recommendations })),
      setChosenCareer: (career) => set((state) => ({ ...state, chosenCareer: career })),
      addSavedCollege: (college) => set((state) => ({ savedColleges: [...state.savedColleges, college] })),
      removeSavedCollege: (collegeName) => set((state) => ({
        savedColleges: state.savedColleges.filter(c => c.collegeName !== collegeName)
      })),
      addActivity: (activity) => set((state) => ({
        activityLog: [
            { ...activity, id: Date.now().toString(), timestamp: Date.now() },
            ...state.activityLog
        ].slice(0, 5) // Keep only the last 5 activities
      })),
      login: (userData) => set({ isAuthenticated: true, user: userData }),
      logout: () => set({ isAuthenticated: false, user: null }),
      reset: () => {
        set((state) => ({
            ...initialState,
            isAuthenticated: state.isAuthenticated,
            user: state.user
        }));
      },
    }),
    {
      name: 'pathfinder-results-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

    