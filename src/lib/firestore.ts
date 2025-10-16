import { collection, addDoc, DocumentData } from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "@/context/AuthContext";
import { fchown } from "fs";

// firestore helper functions

// Create Document in a collection
export const createDocument = async (
  collectionName: string,
  document: DocumentData
) => {
  try {
    console.log("Code is from firestore.ts");
    console.log(collectionName);
    console.log(document);
    const docRef = await addDoc(collection(db, collectionName), document);
    console.log(docRef);
    return docRef.id;
  } catch (error) {
    console.log("Error creating documents!!!!@");
    console.log("Error creating document", error);
  }
};
