"use client";

import Dropzone from "@/components/dropzone";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col overflow-auto">
      <Dropzone />
      {/* <FoldersViewPort /> */}
    </div>
  );
}
