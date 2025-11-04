"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";
import { Textarea } from "@/components//ui/textarea";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import { getChangedFields } from "@/lib/utils";
import { updateDocument } from "@/lib/firestore";
import { Document } from "@/interfaces";
import TagSelector from "@/components/ui/tag-selector";

type DocumentModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  selectedDocument?: Document | null;
  setSelectedDocument?: (d: Document | null) => void;
  selectedDocumentCopy?: Document | null;
  setSelectedDocumentCopy?: (d: Document | null) => void;
  collapseMetadata?: boolean;
  setCollapseMetadata?: (c: boolean) => void;
  documentId?: string; // Allow loading by ID for standalone usage
  isModal?: boolean; // Distinguish between modal and full-page usage
};

// Document content component that can be used both in modal and full-page
function DocumentContent({
  selectedDocument,
  setSelectedDocument,
  selectedDocumentCopy,
  setSelectedDocumentCopy,
  collapseMetadata,
  setCollapseMetadata,
}: {
  selectedDocument: Document | null;
  setSelectedDocument: (d: Document | null) => void;
  selectedDocumentCopy: Document | null;
  setSelectedDocumentCopy: (d: Document | null) => void;
  collapseMetadata: boolean;
  setCollapseMetadata: (c: boolean) => void;
}) {
  const allTags = ["test", "test2", "test3"];

  return (
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
          className="relative z-20 border-l top-7 transition-all duration-300 ease-in-out"
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
                    setSelectedDocumentCopy(selectedDocument);
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
                      <span className="font-medium truncate">Pages:</span>
                      <span
                        className="truncate"
                        title={selectedDocument?.pageCount?.toString()}
                      >
                        {selectedDocument?.pageCount}
                      </span>
                    </div>

                    {/* Size */}
                    <div className="flex flex-wrap">
                      <span className="font-medium truncate">Size:</span>
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
                          ?.toDate()
                          ?.toDateString()}
                      >
                        {selectedDocument?.createdAt
                          ?.toDate()
                          ?.toDateString()}
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
                    className="min-h-[90px] max-h-[90px] overflow-y-auto flex flex-col gap-1 text-xs text-gray-500 px-2"
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
                    className="min-h-[90px] max-h-[90px] overflow-y-auto flex flex-col gap-1 text-xs text-gray-500 px-2"
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
              <SidebarGroupLabel>Custom Metadata</SidebarGroupLabel>
              {!collapseMetadata && (
                <div className="text-xs text-gray-500 px-2 gap-2">
                  <Button
                    className="h-6 w-full text-sm text-gray-500"
                    variant="outline"
                    onClick={() => {
                      if (!selectedDocument) return;
                      const newMetaData = [...(selectedDocument?.metadata || [])];
                      newMetaData.push({ key: "", value: "" });
                      setSelectedDocument({
                        ...selectedDocument,
                        metadata: newMetaData,
                      });
                    }}
                  >
                    + Add Metadata Field
                  </Button>
                  {selectedDocument?.metadata?.map((item, index) => (
                    <div key={index} className="flex py-1.5 items-center">
                      <Input
                        value={item.key}
                        onChange={(e) => {
                          if (!selectedDocument) return;
                          const newMetaData = [...selectedDocument.metadata];
                          newMetaData[index].key = e.target.value;
                          setSelectedDocument({
                            ...selectedDocument,
                            metadata: newMetaData,
                          });
                        }}
                        className="h-6 w-2/5 mr-2"
                      />
                      <Input
                        value={item.value}
                        onChange={(e) => {
                          if (!selectedDocument) return;
                          const newMetaData = [...selectedDocument.metadata];
                          newMetaData[index].value = e.target.value;
                          setSelectedDocument({
                            ...selectedDocument,
                            metadata: newMetaData,
                          });
                        }}
                        className="h-6 w-3/5"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          if (!selectedDocument) return;
                          const newMetaData = selectedDocument.metadata.filter((_, i) => i !== index);
                          setSelectedDocument({
                            ...selectedDocument,
                            metadata: newMetaData,
                          });
                        }}
                        className="h-6"
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    </div>
  );
}

export default function DocumentViewPort(props: DocumentModalProps) {
  // Allow the modal to be controlled by parent via props, otherwise fall back to internal state
  const [internalOpen, setInternalOpen] = useState(false);
  const open = props?.open ?? internalOpen;
  const setOpen = props?.onOpenChange ?? setInternalOpen;

  const [internalCollapse, setInternalCollapse] = useState(false);
  const collapseMetadata = props?.collapseMetadata ?? internalCollapse;
  const setCollapseMetadata = props?.setCollapseMetadata ?? setInternalCollapse;

  const [internalSelectedDocument, setInternalSelectedDocument] =
    useState<Document | null>(null);
  const selectedDocument = props?.selectedDocument ?? internalSelectedDocument;
  const setSelectedDocument =
    props?.setSelectedDocument ?? setInternalSelectedDocument;

  const [internalSelectedDocumentCopy, setInternalSelectedDocumentCopy] =
    useState<Document | null>(null);
  const selectedDocumentCopy =
    props?.selectedDocumentCopy ?? internalSelectedDocumentCopy;
  const setSelectedDocumentCopy =
    props?.setSelectedDocumentCopy ?? setInternalSelectedDocumentCopy;

  // If not used as modal, render content directly (for full-page usage)
  if (props?.isModal === false) {
    return (
      <div className="w-full h-screen">
        <div className="px-6 py-4 bg-white border-b">
          <h1 className="text-lg font-semibold truncate">
            {selectedDocument?.name}
          </h1>
        </div>
        <DocumentContent
          selectedDocument={selectedDocument}
          setSelectedDocument={setSelectedDocument}
          selectedDocumentCopy={selectedDocumentCopy}
          setSelectedDocumentCopy={setSelectedDocumentCopy}
          collapseMetadata={collapseMetadata}
          setCollapseMetadata={setCollapseMetadata}
        />
      </div>
    );
  }

  // Modal usage
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!max-w-screen-xl !p-0 overflow-hidden">
          {/* Dialog Header (top bar) */}
          <DialogHeader className="px-6 py-4 bg-white z-50 relative">
            <DialogTitle className="text-sm font-semibold truncate">
              {selectedDocument?.name}
            </DialogTitle>
          </DialogHeader>

          {/* Main Content Area */}
          <DocumentContent
            selectedDocument={selectedDocument}
            setSelectedDocument={setSelectedDocument}
            selectedDocumentCopy={selectedDocumentCopy}
            setSelectedDocumentCopy={setSelectedDocumentCopy}
            collapseMetadata={collapseMetadata}
            setCollapseMetadata={setCollapseMetadata}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
