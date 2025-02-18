"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon, SunMoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          {theme === "light" ? (
            <SunIcon />
          ) : theme === "dark" ? (
            <MoonIcon />
          ) : (
            <SunMoonIcon />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuCheckboxItem
          className="space-x-2 pl-4"
          checked={theme == "light"}
          onClick={() => setTheme("light")}
        >
          <SunIcon /> <span>Light</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          className="space-x-2 pl-4"
          checked={theme == "dark"}
          onClick={() => setTheme("dark")}
        >
          <MoonIcon /> <span>Dark</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          className="space-x-2 pl-4"
          checked={theme == "system"}
          onClick={() => setTheme("system")}
        >
          <SunMoonIcon /> <span>System</span>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
