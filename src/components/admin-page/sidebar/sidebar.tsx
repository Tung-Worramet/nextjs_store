"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/providers/SidebarProvider";
import { UserType } from "@/types/user";
import { FolderTree, LayoutDashboard, LogOut, X } from "lucide-react";
import Link from "next/link";
import SidebarLink from "./sidebar-link";
import { usePathname } from "next/navigation";
import { useSignout } from "./../../../hooks/use-sign-out";

interface SidebarAdminProps {
  user: UserType;
}

const SidebarAdmin = ({ user }: SidebarAdminProps) => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const pathname = usePathname();
  const { isPending, handleSignout } = useSignout();

  const sidebarLinks = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: <FolderTree size={20} />,
    },
    // { href: "/admin/orders", label: "Orders", icon: "orders" },
    // { href: "/admin/users", label: "Users", icon: "users" },
  ];

  return (
    <div>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-svh w-64 border-r flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {/* Logo */}
          <Link href="/admin" className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1">
              <div className="size-6 text-primary-foreground font-bold flex items-center justify-center">
                A
              </div>
            </div>
            <span className="text-xl font-bold">Admin</span>
          </Link>

          {/* Toggle Sidebar Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <X size={20} />
          </Button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-[calc(100vh-128px)] overflow-y-auto">
          <ScrollArea className="flex-1">
            <div className="p-4">
              {/* Profile Box */}
              <div className="mb-6 flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="size-10">
                  <AvatarImage
                    src={user.picture || undefined}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              {/* Menu */}
              <nav className="space-y-1.5">
                {sidebarLinks.map((link, index) => (
                  <SidebarLink
                    key={index}
                    label={link.label}
                    href={link.href}
                    icon={link.icon}
                    isActive={pathname === link.href}
                  />
                ))}
              </nav>
            </div>
          </ScrollArea>
        </div>

        {/* Signout Button */}
        <div className="border-t p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={handleSignout}
            disabled={isPending}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </div>
  );
};

export default SidebarAdmin;
