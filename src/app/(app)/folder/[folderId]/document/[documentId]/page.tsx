"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Document } from "@/interfaces";
import DocumentViewPort from "@/components/document-viewport";

export default function DocumentPage() {
  const params = useParams();
  const documentId = params.documentId as string;
  
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
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div>Loading document...</div>
      </div>
    );
  }

  if (!selectedDocument) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div>Document not found</div>
      </div>
    );
  }

  return (
    <DocumentViewPort
      selectedDocument={selectedDocument}
      setSelectedDocument={setSelectedDocument}
      selectedDocumentCopy={selectedDocumentCopy}
      setSelectedDocumentCopy={setSelectedDocumentCopy}
      collapseMetadata={collapseMetadata}
      setCollapseMetadata={setCollapseMetadata}
      isModal={false} // This is a full-page view, not a modal
    />
  );
}
