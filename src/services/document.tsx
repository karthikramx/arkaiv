import { db, storage } from "@/lib/firebase";
import { deleteObject, ref } from "firebase/storage";
import { doc, deleteDoc } from "firebase/firestore";

// Delete Document from Arkaiv
export async function deleteStoredDocument(
  collectionName: string,
  id: string,
  filePath: string
) {
  try {
    // 1. Delete file from firebase storage
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);

    // 2. Delete Document from Firestore
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.log("Error deleting file or document:", error);
  }
}
