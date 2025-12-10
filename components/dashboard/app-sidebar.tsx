"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Library, Settings } from "lucide-react";
import { NavUser } from "./nav-user";
import type { Profile } from "@/lib/types";

interface AppSidebarProps {
  profile: Profile | null;
  email: string | null;
}

const navItems = [
  {
    title: "Home",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Stories",
    icon: Library,
    href: "/dashboard/blogs",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function AppSidebar({ profile, email }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar className="border-r-0 bg-stone-50/50 dark:bg-stone-900/50">
      <SidebarHeader className="h-16 justify-center px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image
            src="/logo.svg"
            alt="Serif Logo"
            width={24}
            height={24}
            className="transition-opacity"
          />
          <span className="font-serif font-medium tracking-tight">Serif</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 py-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const Icon = item.icon;

            // Logic to determine active state
            let isActive = false;

            if (item.href === "/dashboard") {
              isActive = pathname === "/dashboard";
            } else {
              isActive = pathname.startsWith(item.href);
            }

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="h-9 px-3 font-medium text-muted-foreground transition-all hover:bg-stone-200/50 hover:text-foreground data-[active=true]:bg-stone-200 data-[active=true]:text-foreground data-[active=true]:shadow-sm dark:hover:bg-stone-800/50 dark:data-[active=true]:bg-stone-800"
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4 opacity-70" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <NavUser profile={profile} email={email} />
      </SidebarFooter>
    </Sidebar>
  );
}
