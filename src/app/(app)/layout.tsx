// app/(app)/layout.tsx
"use client";

import Navbar from "@/components/navbar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { FolderProvider, useFolder } from "@/context/FolderContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function AppContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const { currentFolderLineage } = useFolder();

  useEffect(() => {
    if (!router) return;
    if (!user) router.push("/login");
  }, [user, router]);

  useEffect(() => {
    if (currentFolderLineage?.length >= 0) {
      console.log("📚 FolderContext lineage updated:", currentFolderLineage);
    }
  }, [currentFolderLineage]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header Section */}
          <header className="flex h-12 items-center gap-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/home">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {currentFolderLineage.length < 4 &&
                  currentFolderLineage.map((lineage, idx) => (
                    <div key={idx} className="flex items-center">
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href={`/folder/${lineage.id}`}>
                            {lineage.name}
                          </Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </div>
                  ))}
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FolderProvider>
        <AppContent>{children}</AppContent>
      </FolderProvider>
    </AuthProvider>
  );
}
