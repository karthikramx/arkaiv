
import { NextResponse } from "next/server";
import { adminDb } from "../../../../lib/firebase-admin";

export async function GET() {
    try {
        const usersRef = adminDb.collection("users");
        const querySnapshot = await usersRef.get();

        // get all the users
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (querySnapshot.empty) {
            return NextResponse.json({ exists: false });
        } else {
            return NextResponse.json({ exists: true, users });
        }
    } catch (error) {
        console.error("Error checking user existence:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message
        }, { status: 500 });
    }
}   