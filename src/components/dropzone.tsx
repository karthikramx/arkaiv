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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createDocument,
  updateDocument,
  deleteDocument,
} from "@/lib/firestore";
import { Spinner } from "./ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { Input } from "./ui/input";
import { TrashIcon } from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "sonner";
import { deleteStoredDocument } from "@/services/document";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "./ui/button";
import { Save } from "lucide-react";
import { Textarea } from "./ui/textarea";
import TagSelector from "@/components/ui/tag-selector";
import { getChangedFields } from "@/lib/utils";

import { Document } from "@/interfaces";
import { User } from "@/interfaces";
import { useTeam } from "@/context/TeamContext";
import { useRouter } from "next/navigation";
import { createFolder } from "@/services/folder";

interface Folder {
  id: string;
  name: string;
}

export default function Dropzone() {
  const [uploading, setUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [selectedDocumentCopy, setSelectedDocumentCopy] =
    useState<Document | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [open, setOpen] = useState(false);
  const [collapseMetadata, setCollapseMetadata] = useState(false);
  const { user } = useAuth();
  const { userDoc }: { userDoc: User | null } = useTeam();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolderName, setNewFolderName] = useState("untitled");
  const [createFolderDialog, setCreateFolderDialog] = useState(false);
  const allTags = ["test", "test2", "test3"];
  const router = useRouter();

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
            folderId: "home",
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
      where("teamId", "==", userDoc?.currentTeam),
      where("folderId", "==", "home")
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
    if (!userDoc?.currentTeam) return;
    const q = query(
      collection(db, "folders"),
      where("teamId", "==", userDoc?.currentTeam),
      where("parentFolderId", "==", "home")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const folders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Document, "id">),
      }));
      setFolders(folders);
    });

    return () => unsubscribe();
  }, [userDoc]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    accept: { "application/pdf": [".pdf"] },
  });

  // TODO: implement folder deletion .. need to implement a function here!
  // const deleteFolder = (folderId: string) => {
  // 1. Get all the sub foldeers
  // 2. Get all the documents in the folder
  // 3. Delete all the documents
  // 4. Loop through subfolders and delete them recursively
  // 5. Delete the main folder
  // };

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

            <div className="p-5 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-5">
              {folders.map((folder) => (
                <ContextMenu key={folder.id}>
                  <ContextMenuTrigger>
                    <div
                      key={folder.id}
                      className="bg-blue-100 relative flex flex-col items-center justify-between aspect-[3/4] border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                      title={folder.name}
                      onDoubleClick={() => {
                        router.push(`/folder/${folder.id}`);
                      }}
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
                      <ContextMenuItem
                        onClick={async () => {
                          await deleteDocument("folders", folder.id);
                          toast(`Deleted Folder: ${folder.name}`);
                        }}
                      >
                        Delete Folder
                      </ContextMenuItem>
                    </ContextMenuContent>
                  </ContextMenuTrigger>
                </ContextMenu>
              ))}
            </div>

            <div className="p-5 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-7 gap-5">
              {documents.map((doc) => (
                <ContextMenu key={doc.id}>
                  <ContextMenuTrigger>
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
                    <ContextMenuContent>
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
                  </ContextMenuTrigger>
                </ContextMenu>
              ))}

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="!max-w-screen-xl !p-0 overflow-hidden">
                  {/* Dialog Header (top bar) */}
                  <DialogHeader className="px-6 py-4 bg-white z-50 relative">
                    <DialogTitle className="text-sm font-semibold truncate">
                      {selectedDocument?.name}
                    </DialogTitle>
                  </DialogHeader>

                  {/* Main Content Area (Iframe + Right Sidebar) */}
                  <div className="flex h-[85vh] relative">
                    <SidebarProvider>
                      {/* Iframe Section */}
                      <SidebarInset className="flex-1 relative bg-gray-50 transition-all duration-300 ease-in-out">
                        {selectedDocument?.url && (
                          <div className="w-full h-full relative pl-12 pb-50">
                            <iframe
                              src={selectedDocument?.url}
                              className="w-full h-full relative z-10"
                              style={{
                                border: "none",
                                backgroundColor: "white",
                              }}
                            ></iframe>
                          </div>
                        )}
                      </SidebarInset>

                      {/* Sidebar Section */}

                      <Sidebar
                        collapsible="icon"
                        className="relative z-20 border-l top-7 transition-all duration-300 ease-in-out "
                      >
                        <SidebarTrigger
                          className="absolute left-2.5 -top-5 z-50 bg-white shadow rounded-md"
                          onClick={() => {
                            setCollapseMetadata(!collapseMetadata);
                          }}
                        />
                        {!collapseMetadata &&
                          selectedDocument !== selectedDocumentCopy && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="absolute shadow right-1 -top-5 z-50 border-none"
                              onClick={() => {
                                const changes = getChangedFields(
                                  selectedDocumentCopy,
                                  selectedDocument
                                );
                                if (selectedDocument) {
                                  updateDocument(
                                    "documents",
                                    selectedDocument?.id,
                                    changes
                                  );
                                  toast("Changes Saved");
                                  setSelectedDocumentCopy(selectedDocumentCopy);
                                }
                              }}
                            >
                              <Save />
                            </Button>
                          )}
                        <SidebarContent className="max-h-[76vh] overflow-y-auto bg-white">
                          <SidebarGroup>
                            <SidebarGroupLabel>Document Data</SidebarGroupLabel>
                            <SidebarGroupContent className="group-content-hidden">
                              {!collapseMetadata && (
                                <div className="flex flex-col gap-1 text-xs text-gray-500 px-2">
                                  {/* Name */}
                                  <div className="flex">
                                    <span className="font-medium">Name:</span>
                                    <span
                                      className="truncate"
                                      title={selectedDocument?.name || ""}
                                    >
                                      {selectedDocument?.name || "-"}
                                    </span>
                                  </div>

                                  {/* Pages */}
                                  <div className="flex flex-wrap">
                                    <span className="font-medium truncate">
                                      Pages:
                                    </span>
                                    <span
                                      className="truncate"
                                      title={selectedDocument?.pageCount.toString()}
                                    >
                                      {selectedDocument?.pageCount}
                                    </span>
                                  </div>

                                  {/* Size */}
                                  <div className="flex flex-wrap">
                                    <span className="font-medium truncate">
                                      Size:
                                    </span>
                                    <span className="truncate">
                                      {selectedDocument?.size} MB
                                    </span>
                                  </div>

                                  {/* Uploaded By Name */}
                                  <div className="flex flex-wrap">
                                    <span className="font-medium truncate">
                                      Uploaded By:
                                    </span>
                                    <span
                                      className="truncate"
                                      title={selectedDocument?.uploadedByName}
                                    >
                                      {selectedDocument?.uploadedByName}
                                    </span>
                                  </div>

                                  {/* Created At */}
                                  <div className="flex flex-wrap">
                                    <span className="font-medium truncate">
                                      Created At:
                                    </span>
                                    <span
                                      className="truncate"
                                      title={selectedDocument?.createdAt
                                        .toDate()
                                        .toDateString()}
                                    >
                                      {selectedDocument?.createdAt
                                        .toDate()
                                        .toDateString()}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </SidebarGroupContent>
                          </SidebarGroup>
                          <SidebarGroup>
                            <SidebarGroupLabel>Description</SidebarGroupLabel>
                            {!collapseMetadata && (
                              <div className="px-2">
                                <Textarea
                                  placeholder="Add a description..."
                                  value={selectedDocument?.description || ""}
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (!selectedDocument) return;
                                    setSelectedDocument({
                                      ...selectedDocument,
                                      description: newValue,
                                    });
                                  }}
                                  className="min-h-[90px] max-h-[90px] overflow-y-auto flex flex-col gap-1 text-xs text-gray-500 px-2 "
                                />
                              </div>
                            )}
                          </SidebarGroup>
                          <SidebarGroup>
                            <SidebarGroupLabel>Summary</SidebarGroupLabel>
                            {!collapseMetadata && (
                              <div className="px-2">
                                <Textarea
                                  placeholder="Add a summary..."
                                  value={selectedDocument?.summary}
                                  onChange={(e) => {
                                    const newValue = e.target.value;
                                    if (!selectedDocument) return;
                                    setSelectedDocument({
                                      ...selectedDocument,
                                      summary: newValue,
                                    });
                                  }}
                                  className="min-h-[90px] max-h-[90px] overflow-y-auto flex flex-col gap-1 text-xs text-gray-500 px-2 "
                                />
                              </div>
                            )}
                          </SidebarGroup>
                          <SidebarGroup>
                            <SidebarGroupLabel>Tags</SidebarGroupLabel>
                            {!collapseMetadata && (
                              <div className="p-2">
                                <TagSelector
                                  tags={allTags}
                                  existing={selectedDocument?.tags || []}
                                  onChange={(newTags) => {
                                    if (!selectedDocument) return;
                                    setSelectedDocument({
                                      ...selectedDocument,
                                      tags: newTags,
                                    });
                                  }}
                                />
                              </div>
                            )}
                          </SidebarGroup>
                          <SidebarGroup>
                            <SidebarGroupLabel>
                              Custom Metadata
                            </SidebarGroupLabel>
                            {!collapseMetadata && (
                              <div className="text-xs text-gray-500 px-2 gap-2">
                                <Button
                                  className="h-6 w-full text-sm text-gray-500"
                                  variant="outline"
                                  onClick={() => {
                                    if (!selectedDocument) return;
                                    const newMetaData =
                                      selectedDocument?.metadata;
                                    newMetaData.push({ key: "", value: "" });
                                    setSelectedDocument({
                                      ...selectedDocument,
                                      metadata: newMetaData,
                                    });
                                  }}
                                >
                                  + Add Metadata Field
                                </Button>
                                {selectedDocument?.metadata.map(
                                  (item, index) => (
                                    <div
                                      key={index}
                                      className="flex py-1.5 items-center"
                                    >
                                      <Input
                                        value={item.key}
                                        onChange={() => {}}
                                        className="h-6 w-2/5 mr-2"
                                      />
                                      <Input
                                        value={item.value}
                                        onChange={() => {}}
                                        className="h-6 w-3/5"
                                      />
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => {}}
                                        className="h-6"
                                      >
                                        <TrashIcon />
                                      </Button>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          </SidebarGroup>
                        </SidebarContent>
                      </Sidebar>
                    </SidebarProvider>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog
                open={createFolderDialog}
                onOpenChange={setCreateFolderDialog}
              >
                <form>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Create a new Team</DialogTitle>
                      <DialogDescription>
                        Create a new Team by entering its name and type. This
                        action can be undone by deleting the team
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      <div className="grid gap-3">
                        <Label>Folder Name</Label>
                        <Input
                          id="name-1"
                          name="name"
                          defaultValue={newFolderName}
                          onChange={(e) => {
                            setNewFolderName(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button
                        type="submit"
                        onClick={async () => {
                          if (userDoc?.currentTeam) {
                            await createFolder(
                              newFolderName,
                              "home",
                              userDoc?.currentTeam
                            );
                          }
                          setCreateFolderDialog(false);
                          setNewFolderName("untitled");
                        }}
                      >
                        Create Folder
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
            </div>
          </div>
          <ContextMenuContent>
            <ContextMenuItem
              onClick={async () => {
                setCreateFolderDialog(true);
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
