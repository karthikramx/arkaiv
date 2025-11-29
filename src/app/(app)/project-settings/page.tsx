"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import {
  Users,
  Copy,
  CheckCircle,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useTeam } from "@/context/TeamContext";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  role: string; // Main user role (admin/employee/contractor)
  teamRole: string; // Team-specific role (admin/member)
  joinedAt: string | null;
  lastActive: string | null;
}

export default function Account() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [showInviteLink, setShowInviteLink] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [userType, setUserType] = useState("");
  const [isGeneratingInvite, setIsGeneratingInvite] = useState(false);

  // Team members state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [membersError, setMembersError] = useState<string | null>(null);

  const { userDoc, teamDoc } = useTeam();

  // Check if current user is admin in current team
  const isCurrentUserAdmin =
    userDoc?.teams?.find((team) => team.teamId === userDoc?.currentTeam)
      ?.role === "admin";

  // Fetch team members
  const fetchTeamMembers = async (teamId: string) => {
    if (!teamId) return;

    setIsLoadingMembers(true);
    setMembersError(null);

    try {
      const response = await fetch(`/api/teams/${teamId}/members`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch team members");
      }

      setTeamMembers(data.members || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setMembersError(
        error instanceof Error ? error.message : "Failed to fetch team members"
      );
    } finally {
      setIsLoadingMembers(false);
    }
  };

  // Fetch team members when component mounts or team changes
  useEffect(() => {
    if (userDoc?.currentTeam && teamDoc?.type === "team") {
      fetchTeamMembers(userDoc.currentTeam);
    } else {
      // Clear members for personal spaces
      setTeamMembers([]);
      setIsLoadingMembers(false);
      setMembersError(null);
    }
  }, [userDoc?.currentTeam, teamDoc?.type]);

  // Validate email format
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Copy link to clipboard
  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      toast("Invite link copied to clipboard!");

      // Reset the copied state after 3 seconds
      setTimeout(() => {
        setLinkCopied(false);
      }, 3000);
    } catch {
      toast("Failed to copy link");
    }
  };

  const generateInvitationLink = async () => {
    // Validate email first
    if (!inviteEmail.trim()) {
      toast("Please enter an email address");
      return;
    }

    if (!isValidEmail(inviteEmail)) {
      toast("Please enter a valid email address");
      return;
    }

    // Validate user type selection
    if (!userType) {
      toast("Please select whether you're inviting an employee or contractor");
      return;
    }

    setIsGeneratingInvite(true);

    try {
      // Call the API endpoint to create invitation
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteEmail,
          userType: userType,
          teamId: userDoc?.currentTeam || "default-team",
          invitedBy: userDoc?.email || "unknown",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast(data.error || "Failed to create invitation");
        return;
      }

      // Only show invitation link if it's actually created (not for existing users)
      if (data.skipInvitation) {
        toast(`${inviteEmail} has been added to the team directly!`);
        // Clear form but don't show link
        setInviteEmail("");
        setUserType("");
        setShowInviteLink(false);
        setInviteLink("");
      } else {
        // Set the invitation link from API response
        setInviteLink(data.invitation.invitationLink);
        setShowInviteLink(true);
        toast(`Invite link generated for ${userType}: ${inviteEmail}`);

        // Clear form
        setInviteEmail("");
        setUserType("");
      }
    } catch (error) {
      console.error("Error creating invitation:", error);
      toast("Failed to create invitation. Please try again.");
    } finally {
      setIsGeneratingInvite(false);
    }
  };

  return (
    <div className="bg-gray-50/50 p-5 min-h-screen">
      <div className="max-w-full mx-auto space-y-5">
        {/* Main Content Grid */}
        <div className="flex justify-center">
          {/* Only show Team Management if not in personal space */}
          {teamDoc?.type !== "self" ? (
            /* Team Management Card */
            <Card className="w-full max-w-none rounded-sm">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {isCurrentUserAdmin ? "Team Management" : "Team Overview"}
                    </CardTitle>
                    <CardDescription>
                      {isCurrentUserAdmin
                        ? "Invite and manage team members"
                        : "View team members and details"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Only show invite section if user is admin */}
                {isCurrentUserAdmin && (
                  <>
                    {/* Invite Section */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold leading-none tracking-tight">
                          Invite New Member
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Send an invitation to join your project workspace
                        </p>
                      </div>

                      {/* User Type Selection */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold leading-none tracking-tight">
                          Select User Type
                        </h3>
                        <RadioGroup
                          value={userType}
                          onValueChange={setUserType}
                          className="text-sm text-muted-foreground"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="employee" id="employee" />
                            <Label
                              htmlFor="employee"
                              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              Employee
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="contractor"
                              id="contractor"
                            />
                            <Label
                              htmlFor="contractor"
                              className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              Contractor
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Email Input */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="invite-email"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Email Address
                        </Label>
                        <div className="flex space-x-2">
                          <Input
                            id="invite-email"
                            type="email"
                            placeholder="Enter email address"
                            value={inviteEmail}
                            className="flex-1"
                            onChange={(e) => setInviteEmail(e.target.value)}
                          />
                          <Button
                            onClick={() => {
                              generateInvitationLink();
                            }}
                            disabled={isGeneratingInvite}
                            className="shrink-0"
                          >
                            {isGeneratingInvite ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              "Generate Link"
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Invite Link Display */}
                      {showInviteLink && inviteLink && (
                        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <LinkIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold leading-none tracking-tight">
                                Invitation Link Generated
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Share this link with {inviteEmail} to join as a{" "}
                                <span className="font-medium text-foreground">
                                  {userType}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium leading-none">
                              Invitation Link
                            </Label>
                            <div className="flex space-x-2">
                              <Input
                                value={inviteLink}
                                readOnly
                                className="flex-1 font-mono text-sm bg-muted"
                              />
                              <Button
                                onClick={copyInviteLink}
                                variant={linkCopied ? "default" : "outline"}
                                size="sm"
                                className="shrink-0 min-w-[80px]"
                              >
                                {linkCopied ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-2" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3 mr-2" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              This link will expire in 7 days
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />
                  </>
                )}

                {/* Team Members Section - Always visible */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Team Members</div>
                    <Badge variant="secondary">
                      {isLoadingMembers
                        ? "Loading..."
                        : `${teamMembers.length} members`}
                    </Badge>
                  </div>

                  {isLoadingMembers ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2">Loading team members...</span>
                    </div>
                  ) : membersError ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      Error loading team members: {membersError}
                    </div>
                  ) : teamMembers.length === 0 ? (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                      No team members found.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={member.imageUrl} />
                              <AvatarFallback>
                                {member.name
                                  ? member.name.slice(0, 2).toUpperCase()
                                  : member.email
                                  ? member.email.slice(0, 2).toUpperCase()
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {member.name || member.email}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {member.email}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                member.role === "admin"
                                  ? "default"
                                  : member.role === "employee"
                                  ? "secondary"
                                  : member.role === "contractor"
                                  ? "outline"
                                  : "secondary"
                              }
                              className={
                                member.role === "employee"
                                  ? "bg-blue-100 text-blue-800 border-blue-200"
                                  : member.role === "contractor"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : member.role === "admin"
                                  ? "bg-orange-100 text-orange-800 border-orange-200"
                                  : ""
                              }
                            >
                              {member.role === "admin"
                                ? "Admin"
                                : member.role === "employee"
                                ? "Employee"
                                : member.role === "contractor"
                                ? "Contractor"
                                : "Member"}
                            </Badge>
                            {member.teamRole === "admin" &&
                              member.role !== "admin" && (
                                <Badge variant="default" className="text-xs">
                                  Team Admin
                                </Badge>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Personal Space Message */
            <Card className="w-full max-w-none rounded-sm">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Personal Space</CardTitle>
                    <CardDescription>
                      This is your personal workspace
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-dashed border-muted-foreground/25 p-6 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="p-3 bg-muted rounded-full">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">No Team Management</h3>
                      <p className="text-sm text-muted-foreground">
                        Team invitations are not available in personal spaces.
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground max-w-xs">
                      Switch to a team workspace or create a new team to invite
                      members and collaborate.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
