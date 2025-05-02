import { Link } from "react-router";
import { ModeToggle } from "@/components/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/context/auth-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import React from "react";
import { GraduationCap, Menu } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const links = {
    student: [{ label: "Upcoming Classes", path: "/student" }],
    instructor: [
      { label: "Stats", path: "/instructor" },
      { label: "Create Schedule", path: "/instructor/schedule" },
    ],
    admin: [{ label: "All Batches", path: "/admin" }],
  };

  const userLinks = user ? links[user.user.role] || [] : [];

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden">
      <header className="sm:px-16 px-8 border-b shadow-sm w-full">
        <div className="flex items-center justify-between py-3">
          {/* Logo + Nav */}
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground">
              <GraduationCap className="h-6 w-6" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-4">
              {userLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side: Toggle + Avatar + Mobile menu */}
          <div className="flex items-center gap-3">
            <ModeToggle />

            {/* Mobile menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {userLinks.map((link) => (
                    <DropdownMenuItem key={link.path} asChild>
                      <Link to={link.path}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User avatar */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarFallback>{user.user.full_name[0]}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    {user.user.full_name}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/logout" className="w-full">
                      Logout
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-col flex-1 overflow-y-auto">
        {children}

        <footer className="w-full border-t mt-auto py-4 text-center text-sm text-muted-foreground bg-background">
          <div className="container mx-auto px-4">
            <p>&copy; 2025 Smart Attendance. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
