"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality here
      console.log("Searching for:", searchQuery);
      // You can implement search logic or navigation here
    }
  };

  return (
    <nav
      className={`w-full flex items-center justify-between ${
        user ? "pl-14" : "pl-2"
      } pr-4 py-1.5 bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800`}
    >
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
        <Image
          src="/arkaiv.png"
          alt="App Logo"
          width={32}
          height={32}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
        <span
          onClick={() => router.push("/")}
          className="text-xl font-semibold text-gray-900 dark:text-white cursor-pointer"
        >
          Ark
          <span className="bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
            ai
          </span>
          v
        </span>
      </div>

      {/* Search Bar - Only show when user is logged in */}
      {user && (
        <div className="flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Let’s find that needle in your haystack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 rounded-lg"
            />
          </form>
        </div>
      )}

      {/* Auth Button */}
      <Button
        onClick={handleAuthAction}
        className={`text-sm font-medium ${
          user
            ? "bg-gray-700 hover:bg-gray-600 text-white"
            : "bg-gray-700 hover:bg-gray-600 text-white"
        }`}
        size="sm"
      >
        {user ? "Logout" : "Login"}
      </Button>
    </nav>
  );
}
