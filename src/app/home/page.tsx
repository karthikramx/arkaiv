// import { SignupForm } from "@/components/signup-form";

"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Dashboard from "../dashboard/page";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <Dashboard>
      {
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm">{/* <SignupForm /> */}</div>
        </div>
      }
    </Dashboard>
  );
}
