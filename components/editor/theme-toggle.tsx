"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/store";

export function ThemeToggle() {
  const { theme, setTheme } = useEditorStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "vs-dark" ? "vs-light" : "vs-dark")}
    >
      {theme === "vs-dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
