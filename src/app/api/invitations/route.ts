import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

interface InviteRequestBody {
  email: string;
  userType: "employee" | "contractor";
  teamId: string;
  invitedBy?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: InviteRequestBody = await request.json();

    // Validate required fields
    if (!body.email || !body.userType || !body.teamId) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["email", "userType", "teamId"],
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate user type
    if (!["employee", "contractor"].includes(body.userType)) {
      return NextResponse.json(
        { error: "Invalid user type. Must be 'employee' or 'contractor'" },
        { status: 400 }
      );
    }

    // Check if the team is a personal space (type: "self")
    try {
      const teamDoc = await adminDb.collection("teams").doc(body.teamId).get();
      if (teamDoc.exists) {
        const teamData = teamDoc.data();
        if (teamData?.type === "self") {
          return NextResponse.json(
            { error: "Cannot invite users to personal workspace" },
            { status: 400 }
          );
        }
      }
    } catch (error) {
      console.error("Error checking team type:", error);
      // Continue with invitation if team check fails
    }

    // Check if user already exists in the system
    const usersQuery = await adminDb
      .collection("users")
      .where("email", "==", body.email)
      .limit(1)
      .get();

    if (!usersQuery.empty) {
      // User is already registered - check if they're already in this team
      const userDoc = usersQuery.docs[0];
      const userData = userDoc.data();

      const existingTeam = (userData.teams || []).find(
        (team: {
          teamId: string;
          role: string;
          name: string;
          imageUrl: string;
        }) => team.teamId === body.teamId
      );

      if (existingTeam) {
        return NextResponse.json(
          { error: "User is already a member of this team" },
          { status: 409 }
        );
      }

      // Fetch team name for the new team entry
      let teamName = `Team ${body.teamId.substring(0, 8)}`;
      try {
        const teamDoc = await adminDb
          .collection("teams")
          .doc(body.teamId)
          .get();
        if (teamDoc.exists) {
          const teamData = teamDoc.data();
          teamName = teamData?.name || teamName;
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }

      // Add new team to user's teams array
      const newTeamEntry = {
        teamId: body.teamId,
        role: body.userType,
        name: teamName,
        imageUrl: "",
      };

      await adminDb
        .collection("users")
        .doc(userDoc.id)
        .update({
          teams: FieldValue.arrayUnion(newTeamEntry),
        });

      // Also add user to the team's members array
      await adminDb
        .collection("teams")
        .doc(body.teamId)
        .update({
          members: FieldValue.arrayUnion(userData.userId),
        });

      return NextResponse.json(
        {
          success: true,
          message: "User added to team successfully.",
          skipInvitation: true,
        },
        { status: 200 }
      );
    }

    // Check if user is already invited to this team
    const existingInvitesQuery = await adminDb
      .collection("invitations")
      .where("email", "==", body.email)
      .where("teamId", "==", body.teamId)
      .where("accepted", "==", false)
      .get();

    if (!existingInvitesQuery.empty) {
      return NextResponse.json(
        { error: "User already has a pending invitation for this team" },
        { status: 409 }
      );
    }

    // Generate unique invite code
    const inviteCode = crypto.randomUUID();

    // Create invite document data
    const inviteData = {
      email: body.email,
      inviteCode: inviteCode,
      userType: body.userType,
      teamId: body.teamId,
      invitedBy: body.invitedBy || "system",
      invitedAt: new Date(),
      accepted: false,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      status: "pending",
    };

    // Save to Firestore using Admin SDK
    const docRef = await adminDb.collection("invitations").add(inviteData);

    // Generate invitation link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const invitationLink = `${baseUrl}/join?invite=${inviteCode}&email=${encodeURIComponent(
      body.email
    )}&type=${body.userType}`;

    // Return success response
    return NextResponse.json(
      {
        success: true,
        invitation: {
          id: docRef.id,
          inviteCode: inviteCode,
          invitationLink: invitationLink,
          email: body.email,
          userType: body.userType,
          teamId: body.teamId,
          expiresAt: inviteData.expiresAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const inviteCode = url.searchParams.get("code");

    if (!inviteCode) {
      return NextResponse.json(
        { error: "Invite code is required" },
        { status: 400 }
      );
    }

    // Query Firestore to find invitation by code using Admin SDK
    const invitationsQuery = await adminDb
      .collection("invitations")
      .where("inviteCode", "==", inviteCode)
      .where("accepted", "==", false)
      .limit(1)
      .get();

    if (invitationsQuery.empty) {
      return NextResponse.json(
        {
          error: "Invalid or expired invitation code",
          valid: false,
        },
        { status: 404 }
      );
    }

    const inviteDoc = invitationsQuery.docs[0];
    const inviteData = inviteDoc.data();

    // Check if invitation has expired
    const expiresAt = inviteData.expiresAt.toDate();
    const now = new Date();

    if (now > expiresAt) {
      return NextResponse.json(
        {
          error: "Invitation has expired",
          valid: false,
        },
        { status: 410 }
      );
    }

    // Fetch team information
    let teamName = `Team ${inviteData.teamId.substring(0, 8)}`;
    try {
      const teamDoc = await adminDb
        .collection("teams")
        .doc(inviteData.teamId)
        .get();
      if (teamDoc.exists) {
        const teamData = teamDoc.data();
        teamName = teamData?.name || teamName;
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      // Continue with default team name
    }

    // Return invitation details
    return NextResponse.json({
      valid: true,
      invitation: {
        id: inviteDoc.id,
        email: inviteData.email,
        userType: inviteData.userType,
        teamId: inviteData.teamId,
        teamName: teamName,
        invitedBy: inviteData.invitedBy,
        invitedAt: inviteData.invitedAt.toDate(),
        expiresAt: inviteData.expiresAt.toDate(),
      },
    });
  } catch (error) {
    console.error("Error retrieving invitation:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        valid: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviteCode, userId } = body;

    if (!inviteCode) {
      return NextResponse.json(
        { error: "Invite code is required" },
        { status: 400 }
      );
    }

    // Find the invitation
    const invitationsQuery = await adminDb
      .collection("invitations")
      .where("inviteCode", "==", inviteCode)
      .where("accepted", "==", false)
      .limit(1)
      .get();

    if (invitationsQuery.empty) {
      return NextResponse.json(
        { error: "Invalid or expired invitation code" },
        { status: 404 }
      );
    }

    const inviteDoc = invitationsQuery.docs[0];
    const inviteData = inviteDoc.data();

    // Check if invitation has expired
    const expiresAt = inviteData.expiresAt.toDate();
    const now = new Date();

    if (now > expiresAt) {
      return NextResponse.json(
        { error: "Invitation has expired" },
        { status: 410 }
      );
    }

    // Mark invitation as accepted
    await adminDb
      .collection("invitations")
      .doc(inviteDoc.id)
      .update({
        accepted: true,
        acceptedAt: new Date(),
        acceptedBy: userId || null,
        status: "accepted",
      });

    return NextResponse.json({
      success: true,
      message: "Invitation marked as accepted",
    });
  } catch (error) {
    console.error("Error updating invitation:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
