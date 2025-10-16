// import { SignupForm } from "@/components/signup-form";

"use client";

import { useAuth } from "@/context/AuthContext";
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

  console.log("this is from your home page");
  console.log("this is the user id : ", user.uid);
  console.log("this is the user object:", user);

  return (
    <Dashboard>
      <div className="w-full h-full flex flex-col">
        <Dropzone></Dropzone>
      </div>
    </Dashboard>
  );
}
