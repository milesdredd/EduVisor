
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type User,
  type Auth,
} from "firebase/auth";
import { app } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  auth: Auth;
  signUp: (email:string, password:string) => Promise<any>;
  signIn: (email:string, password:string) => Promise<any>;
  signOut: () => Promise<void>;
}

// Initialize Auth outside of the component to ensure it's a singleton.
const auth = getAuth(app);

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  auth: auth,
  signUp: async () => { throw new Error('Not implemented') },
  signIn: async () => { throw new Error('Not implemented') },
  signOut: async () => { throw new Error('Not implemented') },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
  };
  
  const value = {
    user,
    loading,
    auth,
    signUp: (email, password) => createUserWithEmailAndPassword(auth, email, password),
    signIn: (email, password) => signInWithEmailAndPassword(auth, email, password),
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
