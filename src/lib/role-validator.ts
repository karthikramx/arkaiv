import { adminDb } from "@/lib/firebase-admin";

/**
 * Validates if a user has the required role for the login portal
 * @param email - User's email address
 * @param requiredRole - Required role (admin, employee, contractor)
 * @returns Promise<{isValid: boolean, userRole?: string, error?: string}>
 */
export async function validateUserRole(email: string, requiredRole: string) {
  try {
    console.log(
      `🔍 Validating user role for email: ${email}, required role: ${requiredRole}`
    );

    // Query user by email
    const userQuery = await adminDb
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userQuery.empty) {
      console.log(`❌ User not found: ${email}`);
      return {
        isValid: false,
        error: "User not found in system",
      };
    }

    const userData = userQuery.docs[0].data();
    const userRole = userData.role;

    console.log(`� User role: ${userRole}, Required role: ${requiredRole}`);

    // Simple role check - user.role must match requiredRole exactly
    if (userRole.toLowerCase() !== requiredRole.toLowerCase()) {
      console.log(`❌ Role mismatch: ${userRole} !== ${requiredRole}`);

      return {
        isValid: false,
        userRole: userRole,
        error: `Access denied. This portal is for ${requiredRole}s only. You are a ${userRole}.`,
      };
    }

    console.log(
      `✅ Role validation successful for ${email} as ${requiredRole}`
    );

    return {
      isValid: true,
      userRole: userRole,
    };
  } catch (error) {
    console.error("Error validating user role:", error);
    return {
      isValid: false,
      error: "System error during role validation",
    };
  }
}
