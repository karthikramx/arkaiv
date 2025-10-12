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
} from "firebase/auth";
import { Spinner } from "@/components/ui/spinner";

const AuthContext = createContext({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  forgotpassword: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false); // NEW

  // Mark component as hydrated
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
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
      return { user: null, error };
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
      return { user: userCredential.user, error: null };
    } catch (error) {
      console.log("Signup Failed:", error);
      return { user: null, error };
    }
  };

  // User Logout
  const logout = async () => {
    try {
      await signOut(auth);
      return { resp: true, error: null };
    } catch (error) {
      return { resp: null, error };
    }
  };

  // User Forgot Password
  const forgotPassword = async (email: string) => {
    try {
      const response = await sendPasswordResetEmail(auth, email);
      return { resp: response, error: null };
    } catch (error) {
      console.log("Failed to Send Forgot Password Email");
      return { resp: null, error: error };
    }
  };

  // consoling user
  // this is from context
  console.log("User value from Context, ", user);

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
