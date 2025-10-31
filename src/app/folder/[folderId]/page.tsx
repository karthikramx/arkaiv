"use client";
import ContextMenuComponent from "@/components/contextmenu";
import { useParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
import { User, Folder, Team, Document } from "@/interfaces";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useDropzone } from "react-dropzone";
import { useTeam } from "@/context/TeamContext";
import { useAuth } from "@/context/AuthContext";

// Firebase and Firestore imports
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  serverTimestamp,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import {
  createDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/firestore";

export default function FoldersPort() {
  const params = useParams();
  const folderId = params.folderId as string;
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [open, setOpen] = useState(false);
  const [collapseMetadata, setCollapseMetadata] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [selectedDocumentCopy, setSelectedDocumentCopy] =
    useState<Document | null>(null);
  const { user } = useAuth();
  const { userDoc }: { userDoc: User | null } = useTeam();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        if (!userDoc?.currentTeam) {
          toast("Erro Uploading Document - Please Contact Support!");
          return;
        }

        setUploading(true);

        for (const file of acceptedFiles) {
          const fileRef = ref(storage, `documents/${file.name}`);
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
    [userDoc, user]
  );

  useEffect(() => {
    if (!userDoc?.currentTeam) return;

    const q = query(
      collection(db, "documents"),
      where("team", "==", userDoc?.currentTeam) // TODO: change this to teamId
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Document[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Document, "id">),
      }));
      setDocuments(docs);
    });

    return () => unsubscribe();
  }, [userDoc]);

  useEffect(() => {
    const q = query(
      collection(db, "folders"),
      where("createdBy", "==", user?.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const folders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Document, "id">),
      }));
      setFolders(folders);
    });

    return () => unsubscribe();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: { "application/pdf": [".pdf"] },
  });

  // Folder level functions
  const createNewFolder = async () => {
    await createDocument("folders", {
      name: "Untitled",
      path: "",
      parent: "",
      teamId: userDoc?.currentTeam,
      createdBy: user?.uid,
      createdAt: serverTimestamp(),
    });
  };

  const deleteFolder = async (folderId: string) => {
    await deleteDocument("folders", folderId);
  };

  return (
    <div className="w-full h-full">
      <ContextMenuComponent
        items={[
          { label: "New Folder", onClick: async () => createNewFolder },
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
            {folders.map((folder) => (
              <ContextMenuComponent
                key={folder.id}
                items={[
                  {
                    label: "Delete Folder",
                    onClick: async () => deleteFolder(folderId),
                  },
                  {
                    label: "Delete",
                    onClick: () => console.log("Delete clicked"),
                  },
                  {
                    label: "Share",
                    onClick: () => console.log("Share clicked"),
                  },
                ]}
              >
                <div
                  key={folder.id}
                  className="bg-blue-100 relative flex flex-col items-center justify-between aspect-[3/4] border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                  title={folder.name}
                >
                  <div className="flex-1 flex items-center justify-center w-full h-full p-3">
                    <div>
                      <span className="text-xs text-gray-400">FOLDER</span>
                    </div>
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

          {/*Document Views*/}
          <div className="p-5 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-5">
            {documents.map((doc) => (
              <ContextMenuComponent
                key={doc.id}
                items={[
                  { label: "View File", onClick: async () => createNewFolder },
                  {
                    label: "Delete File",
                    onClick: () => console.log("Delete clicked"),
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
                    setSelectedDocument(doc);
                    setSelectedDocumentCopy(doc);
                    setOpen(true);
                    setCollapseMetadata(false);
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
                {/* <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => {
                          setSelectedDocument(doc);
                          setSelectedDocumentCopy(doc);
                          setOpen(true);
                        }}
                      >
                        View
                      </ContextMenuItem>
                      <ContextMenuItem>Edit File Name</ContextMenuItem>
                      <ContextMenuItem
                        onClick={async () => {
                          if (doc.url) {
                            await deleteStoredDocument(
                              "documents",
                              doc.id,
                              doc.url
                            );
                            toast("Document Deleted Successfully");
                          }
                        }}
                      >
                        Delete File
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenuTrigger> */}
              </ContextMenuComponent>
            ))}
          </div>
        </div>
      </ContextMenuComponent>
    </div>
  );
}
