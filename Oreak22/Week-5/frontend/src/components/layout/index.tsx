import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ToastProvider } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import type React from "react";

const Layout = ({
  page,
  children,
}: {
  page: string;
  children: React.ReactNode;
}) => {
  return (
    <ToastProvider>
      <SidebarProvider>
        <AppSidebar
          Dashboard={page == "Dashboard"}
          Doctor={page == "Doctor"}
          Doctor_Schedule={page == "Doctor_Schedule"}
          Patient={page == "Patient"}
          Patient_Appointment={page == "Patient_Appointment"}
          Patient_Case={page == "Patient_Case"}
          Prescription={page == "Prescription"}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <>{children}</>
        </SidebarInset>
      </SidebarProvider>
    </ToastProvider>
  );
};

export default Layout;
