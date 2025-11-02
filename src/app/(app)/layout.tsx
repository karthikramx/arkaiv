// app/(app)/layout.tsx
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
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header Section */}
          <header className="flex h-16 items-center gap-2 px-4 border-b">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Current Page</BreadcrumbPage>
                </BreadcrumbItem>
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

// import "./globals.css";
// import Navbar from "@/components/navbar";
// import Link from "next/link";
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import { AuthProvider } from "@/context/AuthContext";
// import { Toaster } from "sonner";
// import { TeamProvider } from "@/context/TeamContext";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
//   BreadcrumbEllipsis,
// } from "@/components/ui/breadcrumb";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";

// import { AppSidebar } from "@/components/app-sidebar";
// import { Separator } from "@/components/ui/separator";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Arkaiv",
//   description: "Intelligent Document Vault",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <div className="flex flex-col h-screen overflow-hidden">
//           <AuthProvider>
//             <TeamProvider>
//               <Navbar />
//               <SidebarProvider>
//                 <AppSidebar />
//                 <SidebarInset>
//                   <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
//                     <div className="flex items-center gap-2 px-4">
//                       <SidebarTrigger className="-ml-1" />
//                       <Separator
//                         orientation="vertical"
//                         className="mr-2 data-[orientation=vertical]:h-4"
//                       />
//                       <Breadcrumb>
//                         <BreadcrumbList>
//                           <BreadcrumbItem>
//                             <BreadcrumbLink asChild>
//                               <Link href="/home">Home</Link>
//                             </BreadcrumbLink>
//                           </BreadcrumbItem>
//                           <BreadcrumbSeparator />
//                           <BreadcrumbItem>
//                             <DropdownMenu>
//                               <DropdownMenuTrigger className="flex items-center gap-1">
//                                 <BreadcrumbEllipsis className="size-4" />
//                                 <span className="sr-only">Toggle menu</span>
//                               </DropdownMenuTrigger>
//                               <DropdownMenuContent align="start">
//                                 <DropdownMenuItem>
//                                   Documentation
//                                 </DropdownMenuItem>
//                                 <DropdownMenuItem>Themes</DropdownMenuItem>
//                                 <DropdownMenuItem>GitHub</DropdownMenuItem>
//                               </DropdownMenuContent>
//                             </DropdownMenu>
//                           </BreadcrumbItem>
//                           <BreadcrumbSeparator />
//                           <BreadcrumbItem>
//                             <BreadcrumbLink asChild>
//                               <Link href="/docs/components">folder name</Link>
//                             </BreadcrumbLink>
//                           </BreadcrumbItem>
//                           <BreadcrumbSeparator />
//                           <BreadcrumbItem>
//                             <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
//                           </BreadcrumbItem>
//                         </BreadcrumbList>
//                       </Breadcrumb>
//                     </div>
//                   </header>
//                   {children}
//                 </SidebarInset>
//               </SidebarProvider>
//             </TeamProvider>
//           </AuthProvider>
//         </div>
//         <Toaster position="top-center"></Toaster>
//       </body>
//     </html>
//   );
// }
