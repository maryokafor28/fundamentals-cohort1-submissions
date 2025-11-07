import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/user"; 
export const useRequireAuth = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    
    if (!isLoading && !user) {
      router.push("/register"); 
    }
  }, [user, isLoading, router]);

  return { user, isLoading }; 
};
