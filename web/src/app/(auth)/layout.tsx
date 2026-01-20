// app/(auth)/layout.tsx
import Navbar from "@/components/navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <Navbar />
      {children}
    </main>
  );
}
