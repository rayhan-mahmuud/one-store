import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userSignOut } from "@/lib/actions/user-actions";
import { UserIcon } from "lucide-react";
import Link from "next/link";

export default async function UserButton() {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitialName = session?.user?.name?.charAt(0) ?? "U";

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="flex justify-center items-center relative w-8 h-8 rounded-full bg-gray-200"
            >
              {firstInitialName}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="text-normal border-b">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session?.user?.name}
              </p>
              <p className="text-sm  mb-2 text-muted-foreground leading-none">
                {session?.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem className="w-full mb-1">
            <Link href="/user/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full mb-1">
            <Link href="/user/orders">Order History</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-0 mb-1">
            <form action={userSignOut}>
              <Button
                variant="ghost"
                className="w-full justify-start px-2 py-4 h-4 "
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
