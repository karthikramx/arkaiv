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

// TeamContext type definition
interface TeamContextType {
  userDoc: User | null;
  teamDoc: Team | null; // (replace with a proper Team type later if you have one)
  createTeam: (name: string, type: string) => Promise<void>;
  switchTeam: (teamId: string) => Promise<void>;
}

const TeamContext = createContext<TeamContextType>({
  userDoc: null,
  teamDoc: null,
  createTeam: async (name: string, type: string) => {},
  switchTeam: async (teamId: string) => {},
});

export function TeamProvider({ children }: ChildrenProps) {
  const [userDoc, setUserDoc] = useState<User | null>(null);
  const [teamDoc, setTeamDoc] = useState<Team | null>(null);
  const { user } = useAuth();

  const createTeam = async (name: string, type: string) => {
    // creating default team for each user
    const teamId = await createDocument("teams", {
      name: name,
      createdById: user?.uid,
      type: type,
      order: 0,
      plan: "free",
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
          logo: "",
          plan: "free",
        }),
        currentTeam: teamId,
      });
      console.log("updated user with team");
    }
  };

  const switchTeam = async (teamId: string) => {
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
  };

  // const deleteTeam = async (id: string) => {};

  useEffect(() => {
    if (!user?.email) return;

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", user.email));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) return;

      const doc = snapshot.docs[0];
      const userData = { id: doc.id, ...doc.data() } as User;
      setUserDoc(userData);

      if (userData.currentTeam) {
        const teamDocument = await readDocument<Team>(
          "teams",
          userData.currentTeam
        );
        setTeamDoc(teamDocument);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <TeamContext.Provider value={{ userDoc, teamDoc, createTeam, switchTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

export const useTeam = () => useContext(TeamContext);
