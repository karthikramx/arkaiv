import { Timestamp } from "firebase/firestore";
import { ReactNode } from "react";

// Type for children prop
export interface ChildrenProps {
  children: ReactNode;
}

// Document Inteface

interface MetadataItem {
  key: string;
  value: string;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedByEmail: string;
  team: string;
  size: string;
  summary: string;
  description: string;
  tags: Array<string>;
  metadata: MetadataItem[];
  pageCount: number;
  createdAt: Timestamp;
}

// User Interface
export interface User {
  id: string;
  name: string;
  userId: string;
  email: string;
  imageUrl: string;
  accountType: string;
  plan: string;
  currentTeam: string;
  teams: Array<{
    teamId: string;
    role: string;
    logo: string;
    name: string;
    plan: string;
  }>;
  createdAt?: Date;
}

// TEAM Interface
export interface Team {
  id: string;
  name: string;
  createdById: string;
  createdByEmail: string;
  type: string;
  order: string;
  plan: string;
  imageUrl: string;
  createdAt: Date;
}
// Folder Interface
export interface Folder {
  id: string;
  name: string;
}
