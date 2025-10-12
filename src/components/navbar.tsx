"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  console.log("this is from Nav Bar, user value:", user);

  const handleAuthAction = async () => {
    if (user) {
      // Logout user
      const response = await logout();
      if (response.resp) {
        console.log("User logged out successfully");
      } else {
        console.error("Logout failed");
      }
    } else {
      // Redirect to login
      router.push("/login");
    }
  };

  return (
    <nav className="w-full flex items-center justify-between pl-14 pr-4 py-2 bg-white dark:bg-gray-900 shadow-sm">
      {/* Logo Section */}

      <div className="flex items-center space-x-2">
        <Image
          src="/rocket.png"
          alt="App Logo"
          width={30}
          height={30}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
        <span
          onClick={() => router.push("/")}
          className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer"
        >
          LaunchPad
        </span>
      </div>

      <div className="flex-1" />

      {/* Auth Button */}
      <div>
        <Button
          onClick={handleAuthAction}
          className="text-sm font-medium"
          variant={user ? "outline" : "default"}
        >
          {user ? "Logout" : "Login"}
        </Button>
      </div>
    </nav>
  );
}
