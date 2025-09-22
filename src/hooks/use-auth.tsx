
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
  auth: Auth | null;
  signUp: (email:string, password:string) => Promise<any>;
  signIn: (email:string, password:string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  auth: null,
  signUp: async () => { throw new Error('Auth not initialized') },
  signIn: async () => { throw new Error('Auth not initialized') },
  signOut: async () => { throw new Error('Auth not initialized') },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    // Initialize auth on the client only
    const authInstance = getAuth(app);
    setAuth(authInstance);

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };
  
  const value = {
    user,
    loading,
    auth,
    signUp: (email, password) => {
      if (!auth) return Promise.reject(new Error("Auth not initialized"));
      return createUserWithEmailAndPassword(auth, email, password);
    },
    signIn: (email, password) => {
      if (!auth) return Promise.reject(new Error("Auth not initialized"));
      return signInWithEmailAndPassword(auth, email, password);
    },
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
