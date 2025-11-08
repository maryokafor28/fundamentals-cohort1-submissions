import { Search } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";
import api from "@/api/axiosClient";
import { useState } from "react";
import { Separator } from "../separator";
import { Link } from "react-router-dom";

interface userProps {
  userName: string;
  name: string;
  _id: string;
}
export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const [user, setUser] = useState<userProps[]>([]);
  const search = async (query: string) => {
    try {
      const res = await api.post("/project/search", {
        query,
      });
      console.log(res);
      setUser(res.data.user);
      console.log(res.data.users);
      setUser(res.data.users);
    } catch (error) {
      setUser([]);
      console.error(error);
    }
  };

  return (
    <>
      <form {...props}>
        <SidebarGroup className="py-0">
          <SidebarGroupContent className="relative">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <SidebarInput
              id="search"
              placeholder="Search the dev..."
              className="pl-8"
              onChange={(e) => search(e.target.value)}
            />
            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
          </SidebarGroupContent>
        </SidebarGroup>
      </form>
      <div className="h-[100px] max-h-[100px] overflow-y-scroll border-l w-[90%] mx-auto">
        {user.length > 0 ? (
          <div className="px-3">
            {user?.map((userInfo, i) => {
              return (
                <p
                  className="shadow rounded px-2 py-2 w-[100%] bg-gray-50 my-1"
                  key={i}
                >
                  <Link className=" " to={`/${userInfo.userName}`}>
                    <span>{userInfo.userName}</span>
                    <span className="text-xs block">{userInfo.name}</span>
                  </Link>
                </p>
              );
            })}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center w-full">
            Search account
          </p>
        )}
      </div>

      <Separator />
    </>
  );
}
