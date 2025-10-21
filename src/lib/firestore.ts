import {
  collection,
  addDoc,
  DocumentData,
  deleteDoc,
  doc,
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
  }
};

export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting document:", error);
  }
};
