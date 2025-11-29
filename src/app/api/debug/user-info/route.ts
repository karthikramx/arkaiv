import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

interface TeamInfo {
  teamId: string;
  role: string;
  name: string;
  imageUrl: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Query user by email
    const userQuery = await adminDb
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return NextResponse.json({
        found: false,
        message: "User not found in system",
      });
    }

    const userData = userQuery.docs[0].data();
    const userTeams: TeamInfo[] = userData.teams || [];

    return NextResponse.json({
      found: true,
      userId: userData.userId || userData.id,
      email: userData.email,
      name: userData.name,
      teams: userTeams.map((team: TeamInfo) => ({
        teamId: team.teamId,
        role: team.role,
        name: team.name,
      })),
      allRoles: [...new Set(userTeams.map((team: TeamInfo) => team.role))],
      rawTeamsData: userTeams,
    });
  } catch (error) {
    console.error("Error in debug user API:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
