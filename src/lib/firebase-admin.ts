import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin SDK (singleton pattern)
if (!getApps().length) {
  try {
    // Debug environment variables
    console.log("Environment check:", {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    // Validate required environment variables
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error("FIREBASE_PROJECT_ID environment variable is required");
    }
    if (!process.env.FIREBASE_CLIENT_EMAIL) {
      throw new Error("FIREBASE_CLIENT_EMAIL environment variable is required");
    }
    if (!process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error("FIREBASE_PRIVATE_KEY environment variable is required");
    }

    // Format private key properly - handle both quoted and unquoted strings
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Remove quotes if present
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1);
    }

    // Replace literal \n with actual newlines
    privateKey = privateKey.replace(/\\n/g, "\n");

    console.log("Private key starts with:", privateKey.substring(0, 50));
    console.log(
      "Private key ends with:",
      privateKey.substring(privateKey.length - 50)
    );

    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log("Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("Firebase Admin SDK initialization error:", error);
    throw new Error(
      `Failed to initialize Firebase Admin SDK: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Export admin database instance
export const adminDb = getFirestore();

// Utility function to check if admin is initialized
export const isAdminInitialized = () => getApps().length > 0;
