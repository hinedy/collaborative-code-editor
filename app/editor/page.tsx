"use client";

import { CodeEditor } from "@/components/editor/code-editor";
import { LanguageSelect } from "@/components/editor/language-select";
import { ThemeToggle } from "@/components/editor/theme-toggle";
import { useClerk } from "@clerk/nextjs";

export default function EditorPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-end gap-4 mb-4">
        <LanguageSelect />
        <ThemeToggle />
      </div>
      <div className="flex-1 rounded-lg border bg-card">
        <CodeEditor />
      </div>
    </div>
  );
}
