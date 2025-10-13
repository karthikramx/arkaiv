"use client";
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneFileListItem,
  DropzoneMessage,
  DropzoneRemoveFile,
  DropzoneTrigger,
  useDropzone,
} from "@/components/ui/dropzone";
import { CloudUploadIcon, Store, Trash2Icon } from "lucide-react";
import { storage, db } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export function MultiFileUpload() {
  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      // Firebase upload logic
      const storageRef = ref(storage, `uploads/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Optional: monitor progress
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => reject(error),
          async () => {
            // Once complete, get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Store metadata in Firestore
            await addDoc(collection(db, "files"), {
              name: file.name,
              url: downloadURL,
              size: file.size,
              uploadedAt: serverTimestamp(),
            });

            resolve({
              status: "success",
              result: downloadURL,
            });
          }
        );
      });
    },
    validation: {
      accept: {
        "application/pdf": [".pdf"],
      },
      maxSize: 10 * 1024 * 1024, // 10 MB
      maxFiles: 100,
    },
  });

  return (
    <div>
      <Dropzone {...dropzone}>
        <div className="h-150 overflow-y-scroll p-4">
          <DropzoneFileList className=" p-10 grid gap-10 md:grid-cols-4 lg:grid-cols-4">
            {dropzone.fileStatuses.map((file) => (
              <DropzoneFileListItem
                className="overflow-hidden rounded-md bg-secondary p-0 shadow-sm"
                key={file.id}
                file={file}
              >
                {file.status === "pending" && (
                  <div className="aspect-video animate-pulse bg-black/20" />
                )}
                {file.status === "success" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={file.result}
                    alt={`uploaded-${file.fileName}`}
                    className="aspect-video object-cover"
                  />
                )}
                <div className="flex items-center justify-between p-2 pl-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{file.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {(file.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <DropzoneRemoveFile
                    variant="ghost"
                    className="shrink-0 hover:outline"
                  >
                    <Trash2Icon className="size-4" />
                  </DropzoneRemoveFile>
                </div>
              </DropzoneFileListItem>
            ))}
          </DropzoneFileList>
        </div>

        <DropZoneArea className="absolute left-0 right-0">
          <DropzoneTrigger className="flex flex-col items-center gap-4 p-10 text-center text-sm">
            <CloudUploadIcon className="size-8" />
            <div>
              <p className="font-semibold">Upload Files</p>
              <p className="text-sm text-muted-foreground">
                Click here or drag and drop to upload
              </p>
            </div>
          </DropzoneTrigger>
        </DropZoneArea>
      </Dropzone>
    </div>
  );
}
