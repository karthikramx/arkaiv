"use client";

import { AuthProvider } from "@/context/AuthContext";

export default function ClientProviders({ children }) {
    return <AuthProvider>{children}</AuthProvider>;
}
