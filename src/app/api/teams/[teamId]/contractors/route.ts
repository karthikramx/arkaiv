import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId } = await params;

    // Validate teamId
    if (!teamId) {
      return NextResponse.json(
        { error: "Team ID is required" },
        { status: 400 }
      );
    }

    // Get team document to find all members
    const teamDoc = await adminDb.collection("teams").doc(teamId).get();

    if (!teamDoc.exists) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const teamData = teamDoc.data();
    const memberIds = teamData?.members || [];

    if (memberIds.length === 0) {
      return NextResponse.json({
        success: true,
        contractors: [],
        count: 0,
      });
    }

    // Get all users who are members of this team
    const usersSnapshot = await adminDb
      .collection("users")
      .where("userId", "in", memberIds)
      .get();

    // Filter for contractors and format response
    const contractors = usersSnapshot.docs
      .filter((doc) => doc.exists)
      .map((doc) => {
        const userData = doc.data();
        return {
          id: doc.id,
          userId: userData.userId,
          name: userData.name,
          email: userData.email,
          imageUrl: userData.imageUrl,
          teams: userData.teams || [],
        };
      })
      .filter((user) =>
        user.teams.some(
          (team: { teamId: string; role: string }) =>
            team.teamId === teamId && team.role === "contractor"
        )
      )
      .map((user) => ({
        id: user.id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      }));

    return NextResponse.json({
      success: true,
      contractors,
      count: contractors.length,
    });
  } catch (error) {
    console.error("Error fetching contractors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
