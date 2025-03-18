"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CodeIcon, LogOut } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) router.push("/auth");
  };
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <CodeIcon className="h-6 w-6" />
          <span className="font-bold">Code Editor</span>
        </Link>

        <nav className="flex items-center gap-4">
          <>
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/projects">Projects</Link>
            </Button>
            {user && (
              <Button variant="outline" onClick={logout}>
                <LogOut /> Log out
              </Button>
            )}
          </>
        </nav>
      </div>
    </header>
  );
}
