"use client";

import { useCallback, useEffect, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  serverTimestamp,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createDocument } from "@/lib/firestore";
import { Spinner } from "./ui/spinner";
import { useAuth } from "@/context/AuthContext";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { deleteStoredDocument } from "@/services/document";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Sree_Krushnadevaraya } from "next/font/google";

interface Document {
  id: string;
  name: string;
  url: string;
}

interface Folder {
  id: string;
  name: string;
}

// interface selectedDocument {
//   id: string;
//   name: string;
//   url: string;
//   createdAt: Timestamp;
//   uploadedBy: string;
// }

export default function Dropzone() {
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  // const [selectedDocument, setSelectedDocument] =
  //   useState<selectedDocument | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  // const [metadata, setMetadata] = useState([]);
  const { user } = useAuth();

  // const pdfData = {
  //   filename: "karthik.pdf",
  //   page: 10,
  // };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
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
          size: fileSizeInMB,
          metadata: [],
          createdAt: serverTimestamp(), // May have a UTC
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "documents"),
      where("uploadedBy", "==", user?.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Document[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Document, "id">),
      }));
      setDocuments(docs);
    });

    return () => unsubscribe();
  }, []);

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

  return (
    <div className="w-full h-full">
      <ContextMenu>
        <ContextMenuTrigger>
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

            <div className="p-5 mt-5 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {folders.map((folder) => (
                <ContextMenu key={folder.id}>
                  <ContextMenuTrigger>
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
                    <ContextMenuContent>
                      <ContextMenuItem>Open</ContextMenuItem>
                      <ContextMenuItem>Edit Folder Name</ContextMenuItem>
                      <ContextMenuItem>Delete Folder</ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenuTrigger>
                </ContextMenu>
              ))}

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="!max-w-screen-xl">
                  <DialogHeader>
                    <DialogTitle>{selectedFileName}</DialogTitle>
                  </DialogHeader>
                  <div className="flex v-screen">
                    <div className="w-[100%]">
                      {selectedFileUrl && (
                        <div className="h-[85vh]">
                          <iframe
                            src={selectedFileUrl}
                            width="100%"
                            height="100%"
                            style={{ border: "none" }}
                          ></iframe>
                        </div>
                      )}
                    </div>
                    <div className="w-[0%] bg-gray-50 p-2">
                      {/* <div className="flex">
                  <Label>Name:</Label>
                  <Label>{selectedFileName}</Label>
                </div>
                <div className="flex">
                  <Label>Created At</Label>
                </div>
                <div className="flex">
                  <Label>Uploaded by</Label>
                </div> */}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="p-5 mt-5 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-2">
              {documents.map((doc) => (
                <ContextMenu key={doc.id}>
                  <ContextMenuTrigger>
                    <div
                      key={doc.id}
                      className="relative flex flex-col items-center justify-between aspect-[3/4] border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer bg-white"
                      onDoubleClick={() => {
                        setSelectedFileUrl(doc.url);
                        setSelectedFileName(doc.name);
                        // setSelectedDocument(doc);
                        console.log(doc);
                        setOpen(true);
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
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => {
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
                  </ContextMenuTrigger>
                </ContextMenu>
              ))}

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="!max-w-screen-xl">
                  <DialogHeader>
                    <DialogTitle>{selectedFileName}</DialogTitle>
                  </DialogHeader>
                  <div className="flex v-screen">
                    <div className="w-[100%]">
                      {selectedFileUrl && (
                        <div className="h-[85vh]">
                          <iframe
                            src={selectedFileUrl}
                            width="100%"
                            height="100%"
                            style={{ border: "none" }}
                          ></iframe>
                        </div>
                      )}
                    </div>
                    <div className="w-[0%] bg-gray-50 p-2">
                      {/* <div className="flex">
                  <Label>Name:</Label>
                  <Label>{selectedFileName}</Label>
                </div>
                <div className="flex">
                  <Label>Created At</Label>
                </div>
                <div className="flex">
                  <Label>Uploaded by</Label>
                </div> */}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={async () => {
                await createDocument("folders", {
                  name: "Untitled",
                  parent: "home",
                  createdBy: user?.uid,
                  createdAt: serverTimestamp(),
                });
              }}
            >
              New Folder
            </ContextMenuItem>
            <ContextMenuItem>Upload Files</ContextMenuItem>
            <ContextMenuItem>Refresh</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenuTrigger>
      </ContextMenu>
    </div>
  );
}
