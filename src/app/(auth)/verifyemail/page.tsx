"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Ask the user to verify their email - ask them to check their inbox
export default function VerifyEmailPage() {
  const router = useRouter();
  const { sendVerificationEmail, user } = useAuth();

  useEffect(() => {
    if (user?.emailVerified) {
      router.push("/home");
    }
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-semibold mb-4">Verify Your Email</h1>
        <p className="mb-6">
          We have sent a verification link to your email address. Please check
          your inbox and click the link to verify your email.
        </p>
        <p className="text-sm text-gray-500">
          If you haven&apos;t received the email, please check your spam folder
          or request a new verification email.
        </p>
      </div>
      <button
        className="mt-4 text-sm text-blue-500 hover:underline"
        onClick={sendVerificationEmail}
      >
        Resend Verification Email
      </button>
    </div>
  );
}
