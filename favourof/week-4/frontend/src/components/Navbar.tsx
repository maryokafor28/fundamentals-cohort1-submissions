"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          DevConnect
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center space-x-2 hover:text-gray-300"
              >
                <Avatar className="h-8 w-8 text-black font-extrabold">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </Link>
              <Button
                variant="outline"
                onClick={logout}
                className="text-black border-white hover:bg-gray-800"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link href="/signup" className="hover:text-gray-300">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
