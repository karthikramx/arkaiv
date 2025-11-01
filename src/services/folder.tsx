import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export async function createFolder(
  name: string,
  parentFolderId: string | null,
  teamId: string
) {
  const newFolderRef = doc(collection(db, "folders"));

  let lineage: { id: string; name: string; parentFolderId: string | null }[] =
    [];
  let path = "home"; // default for top-level

  if (parentFolderId && parentFolderId !== "home") {
    const parentSnap = await getDoc(doc(db, "folders", parentFolderId));
    if (!parentSnap.exists()) throw new Error("Parent folder not found");

    const parentData = parentSnap.data();
    lineage = [
      ...(parentData.lineage || []),
      { id: newFolderRef.id, name, parentFolderId },
    ];

    path = `${parentData.path}/${name.replace(/\s+/g, "-").toLowerCase()}`;
  } else {
    lineage = [{ id: newFolderRef.id, name, parentFolderId: null }];
    path = name.replace(/\s+/g, "-").toLowerCase();
  }

  const folder = {
    id: newFolderRef.id,
    name,
    path,
    parentFolderId,
    lineage,
    teamId,
    createdAt: serverTimestamp(),
  };

  await setDoc(newFolderRef, folder);
  return folder;
}
