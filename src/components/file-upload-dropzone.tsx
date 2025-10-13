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
import { CloudUploadIcon, Trash2Icon } from "lucide-react";

export function MultiFileUpload() {
  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        status: "success",
        result: URL.createObjectURL(file),
      };
    },
    validation: {
      accept: {
        "pdf/*": [".pdf"],
      },
      maxSize: 10 * 1024 * 1024,
      maxFiles: 10,
    },
  });

  return (
    <div className="not-prose flex flex-col">
      <Dropzone {...dropzone}>
        <div>
          {/* <div className="flex justify-between"> */}
          {/* <DropzoneDescription>
              Please select up to 10 images
            </DropzoneDescription> */}
          {/* <DropzoneMessage /> */}
          {/* </div> */}

          <DropzoneFileList className="grid gap-3 p-0 md:grid-cols-2 lg:grid-cols-3">
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

          <DropZoneArea>
            <DropzoneTrigger className="flex flex-col items-center gap-4 bg-transparent p-10 text-center text-sm">
              <CloudUploadIcon className="size-8" />
              <div>
                <p className="font-semibold">Upload Files</p>
                <p className="text-sm text-muted-foreground">
                  Click here or drag and drop to upload
                </p>
              </div>
            </DropzoneTrigger>
          </DropZoneArea>
        </div>
      </Dropzone>
    </div>
  );
}
