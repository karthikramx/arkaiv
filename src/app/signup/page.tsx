"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDocument } from "@/lib/firestore";
import { serverTimestamp } from "firebase/firestore";

export default function Page() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.push("/home");
  }, [user, router]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm mt-[-50px]">
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const response = await signup(email, password, userName);
                if (response.user) {
                  toast("Sign up successful!");

                  // creating default team for each user
                  const teamId = await createDocument("teams", {
                    name: "My Archive", // self team
                    createdById: response?.user?.uid,
                    createdByEmail: response?.user?.email,
                    type: "self",
                    order: 0,
                    plan: "free",
                    imageUrl: "",
                    createdAt: serverTimestamp(),
                  });

                  // Creating new user in the users collections
                  await createDocument("users", {
                    name: userName,
                    userId: response?.user?.uid,
                    email: email,
                    avatar: "",
                    accountType: "",
                    plan: "",
                    cuurentTeam: teamId,
                    teams: [{ teamId: teamId, role: "admin" }],
                    createdAt: serverTimestamp(),
                  });

                  router.push("/home");
                } else if (!response.user) {
                  toast("Failed to Sign you up :/");
                }
              }}
            >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Mahesh Babu"
                    required
                    onChange={(e) => {
                      setUserName(e.target.value);
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="mb@example.com"
                    required
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  <FieldDescription>
                    We&apos;ll use this to contact you. We will not share your
                    email with anyone else.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input id="confirm-password" type="password" required />
                  <FieldDescription>
                    Please confirm your password.
                  </FieldDescription>
                </Field>
                <FieldGroup>
                  <Field>
                    <Button type="submit">Create Account</Button>
                    {/* <Button variant="outline" type="button">
                  Sign up with Google
                </Button> */}
                    <FieldDescription className="px-6 text-center">
                      Already have an account? <a href="/login">Sign in</a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
