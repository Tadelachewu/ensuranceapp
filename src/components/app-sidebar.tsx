"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Shield,
  FileText,
  Folder,
  User,
  Settings,
  CircleHelp,
  LogOut,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const InsureAiLogo = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19.1213 12.8787C20.6834 14.4408 20.6834 16.9592 19.1213 18.5213C17.5592 20.0834 15.0408 20.0834 13.4787 18.5213C11.9166 16.9592 11.9166 14.4408 13.4787 12.8787C15.0408 11.3166 17.5592 11.3166 19.1213 12.8787"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

export function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/policies", icon: Shield, label: "Policies" },
    { href: "/claims", icon: FileText, label: "Claims" },
    { href: "/documents", icon: Folder, label: "Documents" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <InsureAiLogo />
            <span className="font-semibold text-lg">InsureAI</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-0">
        <SidebarMenu className="p-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 border-t">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" alt="@shadcn" data-ai-hint="person photo" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm">Alex Doe</span>
            <span className="text-xs text-muted-foreground">alex@insureai.com</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
