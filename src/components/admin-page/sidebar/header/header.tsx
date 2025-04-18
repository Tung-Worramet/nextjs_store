"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignout } from "@/hooks/use-sign-out";
import { useSidebar } from "@/providers/SidebarProvider";
import { UserType } from "@/types/user";
import { Menu } from "lucide-react";
import Link from "next/link";

interface HeaderAdminProps {
  user: UserType;
}

const HeaderAdmin = ({ user }: HeaderAdminProps) => {
  const { toggleSidebar } = useSidebar();
  const { isPending, handleSignout } = useSignout();

  return (
    <header className="fixed top-0 inset-x-0 md:left-64 h-16 border-b z-10 transition-all duration-100">
      <div className="flex items-center h-full justify-between px-4">
        {/* Toggle Sidebar Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Avatar>
                <AvatarImage
                  src={user.picture || undefined}
                  alt={user.name || "User"}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name?.slice(0, 2).toUpperCase() || "US"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex flex-col items-center gap-2">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/profile" className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignout}
              disabled={isPending}
              className="cursor-pointer text-red-500 hover:!text-red-400"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default HeaderAdmin;
