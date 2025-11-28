"use client";

import { createContext } from "react";
import { useEffect, useState, useContext } from "react";
import { createDocument, readDocument } from "@/lib/firestore";
import {
  arrayUnion,
  CollectionReference,
  Query,
  serverTimestamp,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getDocs, where, query, collection } from "firebase/firestore";
import { User, ChildrenProps, Team } from "@/interfaces";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

// TeamContext type definition
interface TeamContextType {
  userDoc: User | null;
  teamDoc: Team | null;
  isLoading: boolean;
  createTeam: (name: string, type: string) => Promise<void>;
  switchTeam: (teamId: string) => Promise<void>;
}

const TeamContext = createContext<TeamContextType>({
  userDoc: null,
  teamDoc: null,
  isLoading: true,
  createTeam: async () => {},
  switchTeam: async () => {},
});

export function TeamProvider({ children }: ChildrenProps) {
  const [userDoc, setUserDoc] = useState<User | null>(null);
  const [teamDoc, setTeamDoc] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const createTeam = async (name: string, type: string) => {
    // creating default team for each user
    const teamId = await createDocument("teams", {
      name: name,
      createdById: user?.uid,
      createdByEmail: user?.email,
      type: type,
      members: [user?.uid],
      imageUrl: "",
      createdAt: serverTimestamp(),
    });

    // update the users' teams data
    const usersRef = collection(db, "users") as CollectionReference<User>;
    const q = query(usersRef, where("userId", "==", user?.uid));
    const querySnapshot = await getDocs(q as Query<User>);
    if (querySnapshot) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        teams: arrayUnion({
          teamId: teamId,
          role: "admin",
          name: name,
          imageUrl: "",
        }),
        currentTeam: teamId,
      });
      console.log("updated user with team");
    }
  };

  const switchTeam = async (teamId: string) => {
    setIsLoading(true);

    // update the users' current team value
    const usersRef = collection(db, "users") as CollectionReference<User>;
    const q = query(usersRef, where("userId", "==", user?.uid));
    const querySnapshot = await getDocs(q as Query<User>);
    if (querySnapshot) {
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        currentTeam: teamId,
      });
    }

    // Navigate to home page after switching team (without page refresh)
    router.push("/home");
  };

  // const deleteTeam = async (id: string) => {};

  useEffect(() => {
    if (!user?.email) {
      // Clear data when user logs out
      setUserDoc(null);
      setTeamDoc(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", user.email));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty) {
          setUserDoc(null);
          setTeamDoc(null);
          setIsLoading(false);
          return;
        }

        const doc = snapshot.docs[0];
        const userData = { id: doc.id, ...doc.data() } as User;
        setUserDoc(userData);

        if (userData.currentTeam) {
          const teamDocument = await readDocument<Team>(
            "teams",
            userData.currentTeam
          );
          setTeamDoc(teamDocument);
        } else {
          setTeamDoc(null);
        }

        setIsLoading(false);
      },
      (error) => {
        // Handle permission errors gracefully
        console.warn("Firestore listener error:", error);
        if (error.code === "permission-denied") {
          // User likely logged out, clear data
          setUserDoc(null);
          setTeamDoc(null);
        }
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.email]); // Use user?.email instead of user to avoid unnecessary re-renders

  return (
    <TeamContext.Provider
      value={{ userDoc, teamDoc, isLoading, createTeam, switchTeam }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export const useTeam = () => useContext(TeamContext);
