"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { CodeIcon } from "lucide-react";
import { CreateJoinRoomDialog } from "@/components/room/create-join-room-dialog";

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <CodeIcon className="h-6 w-6" />
          <span className="font-bold">Code Editor</span>
        </Link>

        <nav className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <CreateJoinRoomDialog />
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/projects">Projects</Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
