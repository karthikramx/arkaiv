"use client";

// TODO: This will have a dashboard and the usual home folders and drop zones,
// TODO : 1. Search Bar,
// TODO : 2. Recent Files,
// TODO : 3. Secure Upload Portal link
// TODO : 4. Quick Access Folders etc..

import Dropzone from "@/components/dropzone";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col overflow-auto">
      <Dropzone></Dropzone>
    </div>
  );
}
