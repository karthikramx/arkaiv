"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from "firebase/auth";
import { Spinner } from "@/components/ui/spinner";
import { ReactNode } from "react";

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: Error | null }>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ user: User | null; error: Error | null }>;
  logout: () => Promise<{ resp: boolean | null; error: Error | null }>;
  forgotPassword: (
    email: string
  ) => Promise<{ resp: void | null; error: Error | null }>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ user: null, error: null }),
  signup: async () => ({ user: null, error: null }),
  logout: async () => ({ resp: null, error: null }),
  forgotPassword: async () => ({ resp: null, error: null }),
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false); // NEW

  // Mark component as hydrated
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    console.log("this will run on page refresh!");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Authentication Functions

  // User Login
  const login = async (email: string, password: string) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { user: userCredentials.user, error: null };
    } catch (error) {
      console.log("Login failed:", error);
      return { user: null, error: error as Error };
    }
  };

  // User Signup
  const signup = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // updating the profile with display name
      await updateProfile(userCredential.user, { displayName: name });

      // TODO: Add pages to collection more data like
      // 1. Individual or Team - Get Company Name
      // 2. Get some questions for insights and analytics
      // 3. Store this on users collection !

      // TODO: Add users to users collection

      return { user: userCredential.user, error: null };
    } catch (error) {
      console.log("Signup Failed:", error);
      return { user: null, error: error as Error };
    }
  };

  // User Logout
  const logout = async () => {
    try {
      await signOut(auth);
      return { resp: true, error: null };
    } catch (error) {
      return { resp: null, error: error as Error };
    }
  };

  // User Forgot Password
  const forgotPassword = async (email: string) => {
    try {
      const response = await sendPasswordResetEmail(auth, email);
      return { resp: response, error: null };
    } catch (error) {
      console.log("Failed to Send Forgot Password Email");
      return { resp: null, error: error as Error };
    }
  };

  // console.log("User value from Context, ", user);

  // Only render after hydration and Firebase state is ready
  if (!hydrated || loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-6" />
      </div>
    );

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, forgotPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
