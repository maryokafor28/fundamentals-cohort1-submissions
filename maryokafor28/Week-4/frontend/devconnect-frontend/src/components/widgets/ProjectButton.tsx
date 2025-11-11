"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function CreateProjectButton() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  // ✅ Only render after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Return null during SSR and initial hydration
  if (!mounted) return null;

  // ✅ After hydration, check if user exists
  if (!user) return null;

  return (
    <div className="flex justify-end mb-6">
      <Button
        onClick={() => router.push("/projects/newproject")}
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        + Create New Project
      </Button>
    </div>
  );
}
