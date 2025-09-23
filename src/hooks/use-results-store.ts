
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PersonalizedCareerSuggestionsOutput } from '@/ai/flows/personalized-career-suggestions';
import type { CollegeRecommendationsOutput } from '@/ai/flows/college-recommendations';
import type { CareerDetailsOutput } from '@/ai/flows/career-details';
import type { DashboardDetailsOutput } from '@/ai/flows/dashboard-details';
import type { PersonalizedCollegeSuggestionsOutput } from '@/ai/flows/personalized-college-suggestions';
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

interface SyllabusItem {
    id: string;
    label: string;
}

interface ResultsState {
  quizAnswers: Record<string, string | string[]>;
  careerSuggestions: PersonalizedCareerSuggestionsOutput | null;
  collegeRecommendations: CollegeRecommendationsOutput | null;
  personalizedCollegeSuggestions: PersonalizedCollegeSuggestionsOutput | null;
  chosenCareer: CareerDetailsOutput | null;
  dashboardDetails: DashboardDetailsOutput | null;
  careerDetailsCache: Record<string, CareerDetailsOutput>;
  syllabusProgress: Record<string, boolean>;
  savedColleges: SavedCollege[];
  isAuthenticated: boolean;
  user: UserData | null;
  activityLog: Activity[];
  setQuizAnswers: (answers: Record<string, string | string[]>) => void;
  setCareerSuggestions: (suggestions: PersonalizedCareerSuggestionsOutput) => void;
  setCollegeRecommendations: (recommendations: CollegeRecommendationsOutput) => void;
  setPersonalizedCollegeSuggestions: (suggestions: PersonalizedCollegeSuggestionsOutput | null) => void;
  setChosenCareer: (career: CareerDetailsOutput | null) => void;
  setDashboardDetails: (details: DashboardDetailsOutput | null) => void;
  setCareerDetail: (careerTitle: string, details: CareerDetailsOutput) => void;
  addSyllabusItem: (label: string) => void;
  addSyllabusItems: (labels: string[]) => void;
  removeSyllabusItem: (id: string) => void;
  toggleSyllabusCompletion: (id: string, completed: boolean) => void;
  addSavedCollege: (college: SavedCollege) => void;
  removeSavedCollege: (collegeName: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  login: (userData: UserData) => void;
  logout: () => void;
  reset: () => void;
}

const initialState: Omit<ResultsState, 'setQuizAnswers' | 'setCareerSuggestions' | 'setCollegeRecommendations' | 'setPersonalizedCollegeSuggestions' | 'setChosenCareer' | 'setDashboardDetails' | 'setCareerDetail' | 'addSyllabusItem' | 'addSyllabusItems' | 'removeSyllabusItem' | 'toggleSyllabusCompletion' | 'addSavedCollege' | 'removeSavedCollege' | 'addActivity' | 'login' | 'logout' | 'reset'> = {
  quizAnswers: {},
  careerSuggestions: null,
  collegeRecommendations: null,
  personalizedCollegeSuggestions: null,
  chosenCareer: null,
  dashboardDetails: null,
  careerDetailsCache: {},
  syllabusProgress: {},
  savedColleges: [],
  isAuthenticated: false,
  user: null,
  activityLog: [],
};

export const useResultsStore = create<ResultsState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setQuizAnswers: (answers) => set((state) => ({ ...state, quizAnswers: answers })),
      setCareerSuggestions: (suggestions) => set((state) => ({ ...state, careerSuggestions: suggestions })),
      setCollegeRecommendations: (recommendations) => set((state) => ({ ...state, collegeRecommendations: recommendations })),
      setPersonalizedCollegeSuggestions: (suggestions) => set((state) => ({ ...state, personalizedCollegeSuggestions: suggestions})),
      setChosenCareer: (career) => set((state) => ({ ...state, chosenCareer: career, dashboardDetails: null, syllabusProgress: {} })),
      setDashboardDetails: (details) => {
        set(state => {
            const newSyllabusProgress = { ...state.syllabusProgress };
            if (details?.syllabus) {
                details.syllabus.forEach(item => {
                    if (!(item.id in newSyllabusProgress)) {
                        newSyllabusProgress[item.id] = false;
                    }
                });
            }
            return { ...state, dashboardDetails: details, syllabusProgress: newSyllabusProgress };
        });
      },
      setCareerDetail: (careerTitle, details) => {
        set(state => ({
            careerDetailsCache: {
                ...state.careerDetailsCache,
                [careerTitle]: details
            }
        }));
      },
      addSyllabusItem: (label: string) => {
        get().addSyllabusItems([label]);
      },
       addSyllabusItems: (labels: string[]) => {
        set(state => {
            if (!state.dashboardDetails) return state;

            const newItems = labels.map(label => ({ id: `custom-${Date.now()}-${Math.random()}`, label }));
            const newSyllabus = [...(state.dashboardDetails.syllabus || []), ...newItems];

            const newProgress = { ...state.syllabusProgress };
            newItems.forEach(item => {
                newProgress[item.id] = false;
            });

            return {
                dashboardDetails: { ...state.dashboardDetails, syllabus: newSyllabus },
                syllabusProgress: newProgress
            };
        });
    },
      removeSyllabusItem: (id: string) => {
          set(state => {
              if (!state.dashboardDetails) return state;
              const newSyllabus = state.dashboardDetails.syllabus.filter(item => item.id !== id);
              const newProgress = { ...state.syllabusProgress };
              delete newProgress[id];
              return {
                  dashboardDetails: { ...state.dashboardDetails, syllabus: newSyllabus },
                  syllabusProgress: newProgress
              };
          });
      },
      toggleSyllabusCompletion: (id: string, completed: boolean) => {
        set(state => ({
            syllabusProgress: { ...state.syllabusProgress, [id]: completed }
        }));
      },
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
            user: state.user,
            careerDetailsCache: {},
        }));
      },
    }),
    {
      name: 'pathfinder-results-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
