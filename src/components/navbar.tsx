"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleAuthAction = async () => {
    console.log("clicking the button");
    if (user) {
      // Logout user
      await logout();
      console.log("User logged out successfully");
    } else {
      // Redirect to login
      router.push("/login");
    }
  };

  return (
    <nav
      className={`w-full flex items-center justify-between ${
        user ? "pl-14" : "pl-2"
      } pr-4 py-2 bg-white dark:bg-gray-900 shadow`}
    >
      <div className="flex items-center space-x-2">
        <Image
          src="/arkaiv.png"
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
          Arkaiv
        </span>
      </div>
      <Button
        onClick={handleAuthAction}
        className="text-sm font-medium"
        size="sm"
        variant={user ? "outline" : "default"}
      >
        {user ? "Logout" : "Login"}
      </Button>
    </nav>
  );
}
