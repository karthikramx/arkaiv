// import { SignupForm } from "@/components/signup-form";

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Dashboard from "../dashboard/page";
import { MultiFileUpload } from "@/components/file-upload-dropzone";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  return <Dashboard>{<MultiFileUpload />}</Dashboard>;
}
