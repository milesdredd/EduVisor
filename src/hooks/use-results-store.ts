import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PersonalizedCareerSuggestionsOutput } from '@/ai/flows/personalized-career-suggestions';
import type { CollegeRecommendationsOutput } from '@/ai/flows/college-recommendations';

interface ResultsState {
  quizAnswers: Record<string, string | string[]>;
  careerSuggestions: PersonalizedCareerSuggestionsOutput | null;
  collegeRecommendations: CollegeRecommendationsOutput | null;
  setQuizAnswers: (answers: Record<string, string | string[]>) => void;
  setCareerSuggestions: (suggestions: PersonalizedCareerSuggestionsOutput) => void;
  setCollegeRecommendations: (recommendations: CollegeRecommendationsOutput) => void;
  reset: () => void;
}

const initialState = {
  quizAnswers: {},
  careerSuggestions: null,
  collegeRecommendations: null,
};

export const useResultsStore = create<ResultsState>()(
  persist(
    (set) => ({
      ...initialState,
      setQuizAnswers: (answers) => set({ quizAnswers: answers }),
      setCareerSuggestions: (suggestions) => set({ careerSuggestions: suggestions }),
      setCollegeRecommendations: (recommendations) => set({ collegeRecommendations: recommendations }),
      reset: () => set(initialState),
    }),
    {
      name: 'pathfinder-results-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
