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
  thumbnailUrl?: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedByEmail: string;
  teamId: string;
  folderId: string;
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
  role: string;
  currentTeam: string;
  teams: Array<{
    teamId: string;
    role: string;
    imageUrl: string;
    name: string;
  }>;
  createdAt?: Date;
}

// TEAM Interface
export interface Team {
  id: string;
  name: string;
  createdById: string;
  createdByEmail: string;
  members: string[];
  type?: string;
  imageUrl: string;
  createdAt: Date;
}
// Folder Interface
export interface FolderPermission {
  role: "ADMIN" | "EMPLOYEE" | "CONTRACTOR";
  actions: ("view" | "edit" | "delete")[];
}

export interface Folder {
  id: string;
  name: string;
  parentFolderId?: string | null;
  teamId?: string;
  createdBy?: string;
  createdAt?: Date;
  permissions: FolderPermission[];
  contractorAccess: string[]; // Array of contractor user IDs
  inheritPermissions: boolean; // Whether to inherit from parent folder
  tags: string[];
  color: "blue" | "green" | "purple" | "orange" | "red" | "yellow" | "gray";
  lineage?: {
    id: string;
    name: string;
    parentFolderId: string | null;
  }[];
}

// Invite Interface
export interface Invite {
  id?: string;
  email: string;
  role: "admin" | "user";
  invitedAt: Date;
  accepted: boolean;
}
