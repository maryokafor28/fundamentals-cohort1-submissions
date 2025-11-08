import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import type { FC } from "react";
import React from "react";

const Layer: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger className="my-5" />
        <main className="w-full">
          <div className="md:py-5 md:px-5">{children}</div>
        </main>
      </SidebarProvider>
    </>
  );
};

export default Layer;
