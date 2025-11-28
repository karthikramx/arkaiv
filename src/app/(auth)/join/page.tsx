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
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { createDocument } from "@/lib/firestore";
import {
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Users, Building, CheckCircle } from "lucide-react";

interface InvitationData {
  id: string;
  email: string;
  userType: "employee" | "contractor";
  teamId: string;
  teamName: string;
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
}

export default function JoinPage() {
  const { signup } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");

  // Invitation states
  const [inviteValid, setInviteValid] = useState<boolean | null>(null);
  const [invitationData, setInvitationData] = useState<InvitationData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // URL parameters
  const inviteCode = searchParams.get("invite");
  const inviteEmail = searchParams.get("email");
  const userType = searchParams.get("type") as "employee" | "contractor";

  useEffect(() => {
    if (inviteEmail) {
      setEmail(decodeURIComponent(inviteEmail));
    }
  }, [inviteEmail]);

  useEffect(() => {
    const validateInvitation = async () => {
      if (!inviteCode) {
        setInviteValid(false);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/invitations?code=${inviteCode}`);
        const data = await response.json();

        if (data.valid) {
          setInviteValid(true);
          setInvitationData(data.invitation);
        } else {
          setInviteValid(false);
          toast(data.error || "Invalid invitation link");
        }
      } catch (error) {
        console.error("Error validating invitation:", error);
        setInviteValid(false);
        toast("Failed to validate invitation");
      } finally {
        setLoading(false);
      }
    };

    validateInvitation();
  }, [inviteCode]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!invitationData) {
      toast("Invalid invitation data");
      return;
    }

    if (password !== confirmPassword) {
      toast("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      toast("Password must be at least 8 characters long");
      return;
    }

    setSubmitting(true);

    try {
      // Create user account
      const response = await signup(email, password, userName);

      if (!response.user) {
        toast("Failed to create account");
        setSubmitting(false);
        return;
      }

      // Create "My Archive" team for the user
      const myArchiveTeamId = await createDocument("teams", {
        name: "My Archive",
        createdById: response.user.uid,
        createdByEmail: response.user.email,
        members: [response.user.uid],
        type: "self",
        imageUrl: "",
        createdAt: serverTimestamp(),
      });

      // Add user to the invited team
      const invitedTeamRef = doc(db, "teams", invitationData.teamId);
      await updateDoc(invitedTeamRef, {
        members: arrayUnion(response.user.uid),
      });

      // Fetch team information to get the actual team name
      let teamName =
        invitationData.teamName ||
        `Team ${invitationData.teamId.substring(0, 8)}`;
      let teamImageUrl = "";

      try {
        const teamDoc = await getDoc(invitedTeamRef);
        if (teamDoc.exists()) {
          const teamData = teamDoc.data();
          teamName = teamData?.name || teamName;
          teamImageUrl = teamData?.imageUrl || "";
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
        // Continue with team name from invitation data
      }

      // Create user document with both teams
      await createDocument("users", {
        name: userName,
        userId: response.user.uid,
        email: email,
        role: invitationData.userType, // Use role from invitation
        imageUrl: "",
        currentTeam: myArchiveTeamId, // Default to personal archive
        teams: [
          {
            teamId: myArchiveTeamId,
            role: "admin",
            name: "My Archive",
            imageUrl: "",
          },
          {
            teamId: invitationData.teamId,
            role: invitationData.userType,
            name: teamName,
            imageUrl: teamImageUrl,
          },
        ],
        createdAt: serverTimestamp(),
      });

      // Mark invitation as accepted
      await fetch("/api/invitations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inviteCode: inviteCode,
          userId: response.user.uid,
        }),
      });

      toast("Account created successfully!");
      router.push("/home");
    } catch (error) {
      console.error("Error during signup:", error);
      toast("Failed to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center">
        <div className="flex items-center space-x-2">
          <Spinner className="h-5 w-5" />
          <span>Validating invitation...</span>
        </div>
      </div>
    );
  }

  if (inviteValid === false) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link is invalid, expired, or has already been
              used.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/signup")} className="w-full">
              Create Account Instead
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        {/* Invitation Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                {userType === "employee" ? (
                  <Users className="h-5 w-5 text-blue-600" />
                ) : (
                  <Building className="h-5 w-5 text-green-600" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg">You&apos;re Invited!</CardTitle>
                <CardDescription>
                  Join as a{" "}
                  <Badge
                    variant={userType === "employee" ? "default" : "secondary"}
                    className={
                      userType === "employee" ? "bg-blue-600" : "bg-green-600"
                    }
                  >
                    {userType}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Team:</span>
                <span className="font-medium">{invitationData?.teamName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Invited by:</span>
                <span>{invitationData?.invitedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{invitationData?.email}</span>
              </div>
              {invitationData?.expiresAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expires:</span>
                  <span>
                    {new Date(invitationData.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Complete your registration to join the team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Full Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    className="bg-muted"
                  />
                  <FieldDescription>
                    This email was specified in your invitation
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FieldDescription>
                    Must be at least 8 characters long
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Field>

                <Field>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Accept Invitation & Create Account
                      </>
                    )}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
