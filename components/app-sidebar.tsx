import { Home } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { MdVideoLibrary } from "react-icons/md";
import { FaFileVideo } from "react-icons/fa";

// Menu items.
const adminItems = [
  {
    title: "Home",
    url: "/admins",
    icon: Home,
  },
];

const tutorItems = [
  {
    title: "Quản lý khóa học",
    url: "/manage/manage-courses",
    icon: MdVideoLibrary,
  },
  {
    title: "Quản lý khóa gia sư",
    url: "/manage/manage-tutor-courses",
    icon: FaFileVideo,
  },
];

export function AppSidebar({ role }: { role?: string }) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="pt-20">
          <SidebarGroupContent>
            <SidebarMenu>
              {role === "tutor"
                ? tutorItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                : adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
