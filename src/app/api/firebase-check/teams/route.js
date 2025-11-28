import { NextResponse } from "next/server";
import { adminDb } from "../../../../lib/firebase-admin";

export async function GET() {
    try {
        const teamsRef = adminDb.collection("teams");
        const querySnapshot = await teamsRef.get();

        // get all the teams
        const teams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (querySnapshot.empty) {
            return NextResponse.json({ exists: false });
        } else {
            return NextResponse.json({ exists: true, teams });
        }
    } catch (error) {
        console.error("Error checking teams existence:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}