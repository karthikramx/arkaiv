import { NextRequest, NextResponse } from "next/server";
import { validateUserRole } from "@/lib/role-validator";

export async function POST(request: NextRequest) {
  try {
    const { email, requiredRole } = await request.json();

    if (!email || !requiredRole) {
      return NextResponse.json(
        { error: "Email and requiredRole are required" },
        { status: 400 }
      );
    }

    const validation = await validateUserRole(email, requiredRole);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          isValid: false,
          error: validation.error,
          userRole: validation.userRole,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      isValid: true,
      userRole: validation.userRole,
    });
  } catch (error) {
    console.error("Error in role validation API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
