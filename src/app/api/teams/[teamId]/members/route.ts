import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;

    // 1. Validate teamId
    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    // 2. Get the team document to verify it exists and get members
    const teamDoc = await adminDb.collection("teams").doc(teamId).get();

    if (!teamDoc.exists) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const teamData = teamDoc.data();
    const memberIds = teamData?.members || [];

    if (memberIds.length === 0) {
      return NextResponse.json({
        success: true,
        members: [],
        count: 0,
      });
    }

    // 3. Get all user documents for the member IDs
    // Using batched reads for efficiency
    // 3. Get all user documents for the member IDs
    // Using a single query with whereIn for efficiency
    const usersSnapshot = await adminDb
      .collection("users")
      .where("userId", "in", memberIds)
      .get();
    const memberDocs = usersSnapshot.docs;

    // 4. Format the response with user details
    const members = memberDocs
      .filter((doc) => doc.exists)
      .map((doc) => {
        const userData = doc.data();
        const userTeamInfo = userData?.teams?.find(
          (team: { teamId: string; role: string }) => team.teamId === teamId
        );

        return {
          id: doc.id,
          name: userData?.name || "",
          email: userData?.email || "",
          imageUrl: userData?.imageUrl || "",
          role: userData?.role || "member", // Use user's main role instead of team role
          teamRole: userTeamInfo?.role || "member", // Keep team role for admin permissions
          joinedAt: userData?.createdAt || null,
          lastActive: userData?.lastActive || null,
        };
      });

    return NextResponse.json({
      success: true,
      members,
      count: members.length,
      teamId,
      teamName: teamData?.name || "Unknown Team",
    });
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// Optional: Add a new member to the team
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;
    const body = await request.json();
    const { userId, role = "member" } = body;

    // Add member to team's members array
    await adminDb
      .collection("teams")
      .doc(teamId)
      .update({
        members: FieldValue.arrayUnion(userId),
      });

    // Add team to user's teams array
    await adminDb
      .collection("users")
      .doc(userId)
      .update({
        teams: FieldValue.arrayUnion({
          teamId,
          role,
          name: "Team Name", // You might want to fetch this
          imageUrl: "",
        }),
      });

    return NextResponse.json({
      success: true,
      message: "Member added to team successfully",
    });
  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json(
      { error: "Failed to add team member" },
      { status: 500 }
    );
  }
}
