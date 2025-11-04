"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { readDocument } from "@/lib/firestore";
import { Folder } from "@/interfaces";

interface FolderContextType {
  currentFolderId: string | null;
  currentFolderLineage: {
    id: string;
    name: string;
    parentFolderId: string | null;
  }[];
}

export const FolderContext = createContext<FolderContextType>({
  currentFolderId: null,
  currentFolderLineage: [],
});

export const FolderProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolderLineage, setCurrentFolderLineage] = useState<
    { id: string; name: string; parentFolderId: string | null }[]
  >([]);

  // print the current url whenever it changes
  useEffect(() => {
    const handler = async () => {
      const path = window.location.pathname;
      const pathParts = path.split("/");
      const segment = pathParts[1];
      if (segment === "folder") {
        const folderId = pathParts[2] || null;
        setCurrentFolderId(folderId);
        if (folderId) {
          const folderData = await readDocument<Folder>("folders", folderId);
          setCurrentFolderLineage(folderData?.lineage || []);
        }
      } else if (segment === "home") {
        setCurrentFolderId(null);
        setCurrentFolderLineage([]);
      }
    };
    handler(); // call it once on mount to set the initial folder id
  }, [pathname]);

  return (
    <FolderContext.Provider
      value={{
        currentFolderId,
        currentFolderLineage,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export const useFolder = () => useContext(FolderContext);
