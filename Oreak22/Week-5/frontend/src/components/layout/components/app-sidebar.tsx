import * as React from "react";

// import { SearchForm } from "@/components/search-form";
// import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { GalleryVerticalEnd } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";

// This is sample data.

export function AppSidebar({
  Dashboard,
  Doctor,
  Patient,
  Prescription,
  Patient_Appointment,
  Patient_Case,
  Doctor_Schedule,
  ...props
}: {
  Dashboard?: boolean;
  Doctor?: boolean;
  Patient?: boolean;
  Prescription?: boolean;
  Doctor_Schedule?: boolean;
  Patient_Appointment?: boolean;
  Patient_Case?: boolean;
  props?: React.ComponentProps<typeof Sidebar>;
}) {
  const { user, logout } = useAuth();
  const data = {
    versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
    navMain: [
      {
        title: "Navigation",
        url: "#",
        items: [
          {
            title: "Dashboard",
            url: "/Dashboard",
            isActive: Dashboard,
          },
          {
            title: "Doctor",
            url: "/Doctor",
            isActive: Doctor,
          },
          {
            title: "Patient",
            url: "/patient",
            isActive: Patient,
          },
          {
            title: "Patient Appointment",
            url: "/patient_appointment",
            isActive: Patient_Appointment,
          },
          {
            title: "Reports & Case",
            url: "/report",
            isActive: Patient_Case,
          },
          {
            title: "Prescription",
            url: "/prescription",
            isActive: Prescription,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">PulseTrack</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupContent>
              {/*  */}
              <SidebarMenuItem className="h-fit bg-gray-100 rounded-md mb-4">
                <SidebarMenuButton asChild className="h-fit">
                  <Link to={"/"} className="py-3 h-fit">
                    {" "}
                    <div className="flex space-x-2 justify-center items-center">
                      <Avatar>
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col justify-center items-start space-y-0">
                        <h4 className="font-semibold">{user?.name}</h4>
                        <small className=" text-sm overflow-x-hidden text-ellipsis">
                          {user?.email}
                        </small>
                      </div>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/*  */}
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button className="text-red-600" onClick={() => logout()}>
                      Logout
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
