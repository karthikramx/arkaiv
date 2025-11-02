// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // i only want to match /home or /folder paths
  if (url.pathname.startsWith("/home") || url.pathname.startsWith("/folder")) {
    console.log("Matched path:", url.pathname);
  }

  // Let everything else pass through
  return NextResponse.next();
}
