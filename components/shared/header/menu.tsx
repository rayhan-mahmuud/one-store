import { Button } from "@/components/ui/button";
import ThemeToggle from "./theme-toggle";
import Link from "next/link";
import { EllipsisVerticalIcon, ShoppingCart, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Menu() {
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ThemeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingCart /> Cart
          </Link>
        </Button>
        <Button asChild>
          <Link href="/sign-in">
            <UserIcon /> Sign In
          </Link>
        </Button>
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVerticalIcon />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
            <ThemeToggle />
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingCart /> Cart
              </Link>
            </Button>
            <Button asChild>
              <Link href="/sign-in">
                <UserIcon /> Sign In
              </Link>
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
