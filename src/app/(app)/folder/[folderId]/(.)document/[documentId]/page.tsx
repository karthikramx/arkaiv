"use client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Document } from "@/interfaces";
import DocumentViewPort from "@/components/document-viewport";

export default function InterceptedDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;
  const folderId = params.folderId as string;
  
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedDocumentCopy, setSelectedDocumentCopy] = useState<Document | null>(null);
  const [collapseMetadata, setCollapseMetadata] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load document data when component mounts
  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId) return;
      
      try {
        const docRef = doc(db, "documents", documentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const documentData = {
            id: docSnap.id,
            ...docSnap.data()
          } as Document;
          
          setSelectedDocument(documentData);
          setSelectedDocumentCopy(documentData);
        }
      } catch (error) {
        console.error("Error loading document:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DocumentViewPort
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          // Navigate back to folder when modal closes
          router.push(`/folder/${folderId}`);
        }
      }}
      selectedDocument={selectedDocument}
      setSelectedDocument={setSelectedDocument}
      selectedDocumentCopy={selectedDocumentCopy}
      setSelectedDocumentCopy={setSelectedDocumentCopy}
      collapseMetadata={collapseMetadata}
      setCollapseMetadata={setCollapseMetadata}
      isModal={true}
    />
  );
}
