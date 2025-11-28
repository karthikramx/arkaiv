"use client";
import ContextMenuComponent from "@/components/contextmenu";
import { useParams, useRouter } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { User, Folder, Document } from "@/interfaces";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useDropzone } from "react-dropzone";
import { useTeam } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";
import { deleteStoredDocument } from "@/services/document";
import CreateFolderDialog from "@/components/create-folder-dialog";
import ManageFolderPermissions from "@/components/manage-folder-permissions";

// Firebase and Firestore imports
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  serverTimestamp,
  query,
  onSnapshot,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import { createDocument, deleteDocument } from "@/lib/firestore";
import { filterFoldersByPermissions } from "@/utils/permissions";

export default function FoldersViewPort() {
  const params = useParams();
  const folderId = params.folderId as string;
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [filteredFolders, setFilteredFolders] = useState<Folder[]>([]);
  const [createFolderDialog, setCreateFolderDialog] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [permissionsDialog, setPermissionsDialog] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const { user } = useAuth();
  const { userDoc }: { userDoc: User | null } = useTeam();
  const router = useRouter();

  // get all the subfolders
  useEffect(() => {
    if (!userDoc?.currentTeam) return;
    if (!folderId) return;
    const q = query(
      collection(db, "folders"),
      where("teamId", "==", userDoc?.currentTeam),
      where("parentFolderId", "==", folderId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const folders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Folder, "id">),
      }));
      setFolders(folders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userDoc, folderId]);

  // Filter folders based on user permissions
  useEffect(() => {
    if (!userDoc || folders.length === 0) {
      setFilteredFolders([]);
      return;
    }

    const filtered = filterFoldersByPermissions(folders, userDoc);
    setFilteredFolders(filtered);
  }, [folders, userDoc]);

  // get all the docs for this folder
  useEffect(() => {
    if (!userDoc?.currentTeam) return;

    const q = query(
      collection(db, "documents"),
      where("teamId", "==", userDoc?.currentTeam), // TODO: change this to teamId
      where("folderId", "==", folderId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Document[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Document, "id">),
      }));
      setDocuments(docs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userDoc, folderId]);

  // Fetch current folder data for RBAC context
  useEffect(() => {
    if (!folderId || folderId === "home") {
      setCurrentFolder(null);
      return;
    }

    const fetchCurrentFolder = async () => {
      try {
        const folderRef = doc(db, "folders", folderId);
        const folderDoc = await getDoc(folderRef);

        if (folderDoc.exists()) {
          setCurrentFolder({ id: folderDoc.id, ...folderDoc.data() } as Folder);
        }
      } catch (error) {
        console.error("Error fetching folder:", error);
      }
    };

    fetchCurrentFolder();
  }, [folderId]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        if (!userDoc?.currentTeam) {
          toast("Erro Uploading Document - Please Contact Support!");
          return;
        }

        setUploading(true);

        for (const file of acceptedFiles) {
          const id = crypto.randomUUID();
          const fileRef = ref(storage, `documents/${id}-${file.name}`);
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2); // file size calc - MB

          createDocument("documents", {
            name: file.name,
            url,
            uploadedBy: user?.uid,
            uploadedByName: user?.displayName,
            uploadedByEmail: user?.email,
            teamId: userDoc.currentTeam,
            folderId: folderId,
            size: fileSizeInMB,
            summary: "",
            description: "",
            tags: [],
            metadata: [],
            pageCount: 0,
            createdAt: serverTimestamp(), // May have a UTC
          });
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false);
      }
    },
    [userDoc, user, folderId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: { "application/pdf": [".pdf"] },
  });

  // // Folder level functions
  // const createNewFolder = async () => {
  //   await createDocument("folders", {
  //     name: "Untitled",
  //     path: "",
  //     parentFolderId: folderId,
  //     teamId: userDoc?.currentTeam,
  //     createdBy: user?.uid,
  //     createdAt: serverTimestamp(),
  //   });
  // };

  const deleteFolder = async (folderId: string) => {
    await deleteDocument("folders", folderId);
  };

  // File level functions
  const viewFile = (doc: Document) => {
    // Navigate to document route - this will be intercepted by the (.)document route
    router.push(`/folder/${folderId}/document/${doc.id}`);
  };

  const deleteFile = async (doc: Document) => {
    if (doc.url) {
      await deleteStoredDocument("documents", doc.id, doc.url);
      toast("Document Deleted Successfully");
    }
  };

  if (loading || !userDoc) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner />
          <div className="text-sm text-gray-500">Loading folder...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ContextMenuComponent
        items={[
          {
            label: "New Folder",
            onClick: async () => {
              setCreateFolderDialog(true);
            },
          },
          { label: "Delete", onClick: () => console.log("Delete clicked") },
          { label: "Share", onClick: () => console.log("Share clicked") },
        ]}
      >
        <div
          {...getRootProps()}
          className={`w-full h-full transition-colors duration-200 ${
            isDragActive ? "bg-blue-50" : "bg-transparent"
          }`}
        >
          <input {...getInputProps()} />
          {uploading && (
            <div className="absolute top-4 right-4 text-sm rounded-lg shadow">
              <div className="flex p-2 items-center justify-between">
                <Spinner />
                Uploading Document(s)...
              </div>
            </div>
          )}

          {/*Folders View*/}
          <div className="p-5 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-5">
            {filteredFolders.map((folder) => (
              <ContextMenuComponent
                key={folder.id}
                items={[
                  {
                    label: "Open",
                    onClick: () => router.push(`/folder/${folder.id}`),
                  },
                  {
                    label: "Manage Permissions",
                    onClick: () => {
                      setSelectedFolder(folder);
                      setPermissionsDialog(true);
                    },
                  },
                  {
                    label: "Delete Folder",
                    onClick: async () => deleteFolder(folderId),
                  },
                ]}
              >
                <div
                  key={folder.id}
                  className={`relative flex flex-col items-center justify-between aspect-[3/4] border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer ${
                    folder.color === "blue"
                      ? "bg-blue-100"
                      : folder.color === "green"
                      ? "bg-green-100"
                      : folder.color === "purple"
                      ? "bg-purple-100"
                      : folder.color === "orange"
                      ? "bg-orange-100"
                      : folder.color === "red"
                      ? "bg-red-100"
                      : folder.color === "yellow"
                      ? "bg-yellow-100"
                      : "bg-gray-100"
                  }`}
                  title={folder.name}
                  onDoubleClick={() => {
                    router.push(`/folder/${folder.id}`);
                  }}
                >
                  <div className="flex-1 flex flex-col items-center justify-center w-full h-full p-3">
                    <div>
                      <span className="text-xs text-gray-400">FOLDER</span>
                    </div>
                    {folder.tags && folder.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1 justify-center">
                        {folder.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-1 py-0.5 text-xs bg-white bg-opacity-70 rounded text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                        {folder.tags.length > 2 && (
                          <span className="px-1 py-0.5 text-xs bg-white bg-opacity-70 rounded text-gray-600">
                            +{folder.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="w-full text-center py-2 border-t bg-gray-50">
                    <span className="text-xs font-medium text-gray-700 truncate px-2 block">
                      {folder.name}
                    </span>
                  </div>
                </div>
              </ContextMenuComponent>
            ))}
          </div>

          <CreateFolderDialog
            open={createFolderDialog}
            onOpenChange={setCreateFolderDialog}
            parentFolderId={folderId}
            parentFolder={currentFolder}
          />

          {/*Document Views*/}
          <div className="p-5 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-5">
            {documents.map((doc) => (
              <ContextMenuComponent
                key={doc.id}
                items={[
                  { label: "View File", onClick: () => viewFile(doc) },
                  {
                    label: "Delete File",
                    onClick: async () => deleteFile(doc),
                  },
                  {
                    label: "Share",
                    onClick: () => console.log("Share clicked"),
                  },
                ]}
              >
                <div
                  key={doc.id}
                  className="relative flex flex-col items-center justify-between aspect-[3/4] border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer bg-white"
                  onDoubleClick={() => {
                    // Navigate to document route - this will be intercepted by the (.)document route
                    router.push(`/folder/${folderId}/document/${doc.id}`);
                  }}
                  title={doc.name}
                >
                  <div className="flex-1 flex items-center justify-center w-full h-full p-3">
                    <div className="w-10 h-12 border-2 border-gray-300 bg-gray-50 flex items-center justify-center">
                      <span className="text-xs text-gray-400">PDF</span>
                    </div>
                  </div>

                  <div className="w-full text-center py-2 border-t bg-gray-50">
                    <span className="text-xs font-medium text-gray-700 truncate px-2 block">
                      {doc.name}
                    </span>
                  </div>
                </div>
              </ContextMenuComponent>
            ))}
          </div>
        </div>
      </ContextMenuComponent>

      <CreateFolderDialog
        open={createFolderDialog}
        onOpenChange={setCreateFolderDialog}
        parentFolderId={folderId}
        parentFolder={currentFolder}
      />

      {selectedFolder && (
        <ManageFolderPermissions
          open={permissionsDialog}
          onOpenChange={setPermissionsDialog}
          folder={selectedFolder}
        />
      )}
    </div>
  );
}
