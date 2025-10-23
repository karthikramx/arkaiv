import {
  collection,
  addDoc,
  DocumentData,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// firestore helper functions

// Create Document in a collection
export const createDocument = async (
  collectionName: string,
  document: DocumentData
) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), document);
    return docRef.id;
  } catch (error) {
    console.log("Error creating document", error);
    throw error;
  }
};

// Read a document by ID
export const readDocuments = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error reading document:", error);
    throw error;
  }
};

// Update a document by ID
export const updateDocument = async (
  collectionName: string,
  id: string,
  data: Record<string, any>
) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);

    console.log(`Document ${id} updated successfully.`);
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

// Delete a document by id
export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

// TODO: Reading multiple document using a query
// TODO: Updating multiple documents using a query
