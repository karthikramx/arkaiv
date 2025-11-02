import { createContext, useContext, useState } from "react";

// Context to keep track of current folder

interface FolderContextType {
  currentFolderId: string | null;
  setCurrentFolderId: (folderId: string | null) => void;
  // lineage is a array of objects donot use any
  currentFolderLineage: {
    id: string;
    name: string;
    parentFolderId: string | null;
  }[];
  setCurrentFolderLineage: (
    lineage: { id: string; name: string; parentFolderId: string | null }[]
  ) => void;
}

export const FolderContext = createContext<FolderContextType>({
  currentFolderId: null,
  setCurrentFolderId: () => {},
  currentFolderLineage: [],
  setCurrentFolderLineage: () => {},
});

export const FolderProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentFolderLineage, setCurrentFolderLineage] = useState<
    { id: string; name: string; parentFolderId: string | null }[]
  >([]);

  return (
    <FolderContext.Provider
      value={{
        currentFolderId,
        setCurrentFolderId,
        currentFolderLineage,
        setCurrentFolderLineage,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export const useFolder = () => useContext(FolderContext);
