// import React from "react";
import { useAuth } from "@/context/AuthContext";
import Profile from "./components/Profile";
import Projects from "./components/Projects";
import { ProjectTable } from "./components/ProjectTable";
import { useEffect, useState } from "react";
import type { projectData } from "./types";
import api from "@/api/axiosClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Dashboard = () => {
  const [Data, setData] = useState<[projectData] | []>([]);

  const { user } = useAuth();
  useEffect(() => {
    const getProjects = () => {
      api
        .get("/project/getProject")
        .then((res) => {
          setData(res.data.project);
        })
        .catch(() => {
        });
    };
    getProjects();
  }, []);
  return (
    <>
      <div className="flex flex-col gap-6 p-6 bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, <span className="capitalize">{user?.name}</span> 👋
            </h1>
            <p className="text-muted-foreground text-sm">
              Here’s an overview of your profile and recent projects.
            </p>
          </div>
        </div>

        {/* Profile + Project Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-1 bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <Profile />
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-background border border-border rounded-xl shadow-sm hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                Projects Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Projects totalProject={Data?.length || 0} />
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

export default Dashboard;
