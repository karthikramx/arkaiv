"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Dropzone from "@/components/dropzone";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <AuthProvider>
      <div className="w-full h-full flex flex-col overflow-auto">
        <Dropzone></Dropzone>
      </div>
    </AuthProvider>
  );
}
