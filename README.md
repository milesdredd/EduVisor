# EduVisor: Your Personal AI-Powered Career and College Counselor

EduVisor is a modern, AI-driven web application designed to guide students through the complex process of choosing a career and finding the right college. It replaces uncertainty with clarity by providing personalized, data-driven recommendations.

## ✨ Features

- **🤖 AI-Powered Assessment:** A comprehensive quiz to analyze a user's interests, skills, and values to suggest the most suitable career paths.
- **🧑‍🔬 Personalized Career Suggestions:** Receive a tailored list of career recommendations based on your unique quiz results.
- **📖 In-Depth Career Details:** Dive deep into any suggested career to learn about its day-to-day job duties, required skills, salary potential, job growth outlook, and even entrepreneurial options.
- **🎓 Dynamic College Recommendations:** Get personalized college and university suggestions that align with your chosen career path.
- **🎛️ Interactive Fit Scorer:** Dynamically re-rank recommended colleges by adjusting your personal priorities, such as distance, program strength, lab facilities, and placement records.
- **📊 Personalized Dashboard:** A central hub to track your chosen career path, view a personalized academic timeline, and monitor your progress.
- **👤 User Profiles & Activity Log:** Create a profile, save interesting colleges, and keep track of all your explored careers and activities.
- **🌓 Light & Dark Mode:** A sleek, modern interface with support for both light and dark themes for comfortable viewing.
###  This site is live [here](https://eduvisor-codecrusaders.vercel.app/)

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **AI Integration:** [Google's Genkit](https://firebase.google.com/docs/genkit)
- **Backend & Hosting:** [Firebase](https://firebase.google.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v20.x or later)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/eduvisor.git
   cd eduvisor
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root of the project and add the necessary environment variables for Firebase and Google AI Studio.

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...

   # Google AI (Genkit)
   GOOGLE_API_KEY=...
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- **/src/app/**: Contains all the pages and routes for the application, following the Next.js App Router structure.
- **/src/components/**: Includes all the reusable UI components, such as the theme toggle, layout elements, and shadcn/ui components.
- **/src/ai/**: Holds the AI logic, including all Genkit flows for generating career suggestions, college recommendations, and other AI-powered features.
- **/src/hooks/**: Contains custom React hooks, including the Zustand store for state management (`use-results-store.ts`).
- **/src/lib/**: Includes utility functions, Firebase configuration, and other shared library code.
- **/public/**: Stores all static assets like images and icons.

## 📄 License

This project is currently not licensed. All rights reserved.
