import { NextRequest, NextResponse } from "next/server";
import { getDocs, query, where, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

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

    // Query Firestore to find invitation by code
    const invitationsRef = collection(db, "invitations");
    const q = query(
      invitationsRef,
      where("inviteCode", "==", inviteCode),
      where("accepted", "==", false)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        {
          error: "Invalid or expired invitation code",
          valid: false,
        },
        { status: 404 }
      );
    }

    const inviteDoc = querySnapshot.docs[0];
    const inviteData = inviteDoc.data();

    // Check if invitation has expired
    const expiresAt = inviteData.expiresAt?.toDate();
    const now = new Date();

    if (expiresAt && now > expiresAt) {
      return NextResponse.json(
        {
          error: "Invitation has expired",
          valid: false,
        },
        { status: 410 }
      );
    }

    // Return invitation details
    return NextResponse.json({
      valid: true,
      invitation: {
        id: inviteDoc.id,
        email: inviteData.email,
        userType: inviteData.userType,
        teamId: inviteData.teamId,
        invitedBy: inviteData.invitedBy,
        invitedAt: inviteData.invitedAt?.toDate(),
        expiresAt: inviteData.expiresAt?.toDate(),
      },
    });
  } catch (error) {
    console.error("Error validating invitation:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        valid: false,
      },
      { status: 500 }
    );
  }
}
