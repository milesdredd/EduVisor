import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PersonalizedCareerSuggestionsOutput } from '@/ai/flows/personalized-career-suggestions';
import type { CollegeRecommendationsOutput } from '@/ai/flows/college-recommendations';
import type { CareerDetailsOutput } from '@/ai/flows/career-details';

interface SavedCollege {
  collegeName: string;
  reason: string;
}

interface ResultsState {
  quizAnswers: Record<string, string | string[]>;
  careerSuggestions: PersonalizedCareerSuggestionsOutput | null;
  collegeRecommendations: CollegeRecommendationsOutput | null;
  chosenCareer: CareerDetailsOutput | null;
  savedColleges: SavedCollege[];
  setQuizAnswers: (answers: Record<string, string | string[]>) => void;
  setCareerSuggestions: (suggestions: PersonalizedCareerSuggestionsOutput) => void;
  setCollegeRecommendations: (recommendations: CollegeRecommendationsOutput) => void;
  setChosenCareer: (career: CareerDetailsOutput | null) => void;
  addSavedCollege: (college: SavedCollege) => void;
  reset: () => void;
}

const initialState = {
  quizAnswers: {},
  careerSuggestions: null,
  collegeRecommendations: null,
  chosenCareer: null,
  savedColleges: [],
};

export const useResultsStore = create<ResultsState>()(
  persist(
    (set) => ({
      ...initialState,
      setQuizAnswers: (answers) => set((state) => ({ ...state, quizAnswers: answers })),
      setCareerSuggestions: (suggestions) => set((state) => ({ ...state, careerSuggestions: suggestions })),
      setCollegeRecommendations: (recommendations) => set((state) => ({ ...state, collegeRecommendations: recommendations })),
      setChosenCareer: (career) => set((state) => ({ ...state, chosenCareer: career })),
      addSavedCollege: (college) => set((state) => ({ ...state, savedColleges: [...state.savedColleges, college] })),
      reset: () => {
        set({...initialState, chosenCareer: null, savedColleges: []});
      },
    }),
    {
      name: 'pathfinder-results-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
