// import { SignupForm } from "@/components/signup-form";

"use client";

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Dashboard from "../dashboard/page";
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
      <Dashboard>
        <div className="w-full h-full flex flex-col">
          <Dropzone></Dropzone>
        </div>
      </Dashboard>
    </AuthProvider>
  );
}
