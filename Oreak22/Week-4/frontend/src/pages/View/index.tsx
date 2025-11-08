// import React from "react";
import { useEffect, useState } from "react";
// import api from "@/api/axiosClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProjectTable } from "../dashboard/components/ProjectTable";
import type { projectData } from "../dashboard/types";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@/context/type";

const View = () => {
  const [Data, setData] = useState<[projectData] | []>([]);
  const [user, setUser] = useState<User | null>(null);
  const { userName } = useParams();
  useEffect(() => {
    const getProjects = async () => {
      await axios
        .get(`${import.meta.env.VITE_SERVER_PORT}/project/view/${userName}`)
        .then((res) => {
          setUser(res.data.user);
          setData(res.data.project);
        })
        .catch(() => {});
    };
    getProjects();
  }, []);
  return (
    <>
      <div className="flex flex-col gap-6 p-6 bg-muted/30 min-h-screen">
        {/* Profile + Project Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-1 bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Card className="w-full aspect-video rounded-2xl border border-border bg-background shadow-none hover:shadow-none transition-all flex flex-col justify-center items-center text-center p-6 space-y-4">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-md">
                    <AvatarImage
                      src={"https://github.com/shadcn.png"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="text-lg font-semibold">
                      {user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* User Info */}
                <div className="space-y-1">
                  <h1 className="text-xl font-bold capitalize text-foreground">
                    {user?.name || "Anonymous User"}
                  </h1>
                  <p className="text-sm text-muted-foreground capitalize">
                    {user?.role || "Member"}
                  </p>
                </div>

                <Separator className="w-1/3" />

                <div className="flex gap-2">
                  <Badge
                    variant="secondary"
                    className="text-xs font-medium px-3 py-1"
                  >
                    Active
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-xs font-medium px-3 py-1"
                  >
                    {user?.role || "User"}
                  </Badge>
                </div>
              </Card>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects Section */}
        <Card className="bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Recent Projects
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <ProjectTable Data={Data} user={user} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default View;
