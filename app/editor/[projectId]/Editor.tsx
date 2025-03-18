"use client";
import { useCallback, useEffect, useState } from "react";

import { useEditorStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useDebounce } from "@/hooks/use-debounce";
import { CodeEditor } from "@/components/editor/code-editor";
import { ThemeToggle } from "@/components/editor/theme-toggle";
import { LanguageSelect } from "@/components/editor/language-select";

export default function Editor() {
  const { theme, activeFileId } = useEditorStore();
  const [editorContent, setEditorContent] = useState("");
  const [language, setLanguage] = useState("");

  const { toast } = useToast();
  const updateFile = useCallback(
    async (content: string, language: string) => {
      if (!activeFileId) return;
      const { error } = await supabase
        .from("files")
        .update({ content: content, language: language })
        .eq("id", activeFileId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save changes",
          variant: "destructive",
        });
      }
    },
    [activeFileId, toast],
  );
  const debouncedUpdate = useDebounce(updateFile, 1000);

  const handleEditorChange = useCallback(
    (value: string = "") => {
      setEditorContent(value);
      debouncedUpdate(value, language);
    },
    [debouncedUpdate, language],
  );
  const handleLanguageChange = useCallback(
    (value: string = "") => {
      setLanguage(value);
      debouncedUpdate(editorContent, value);
    },
    [debouncedUpdate, editorContent],
  );
  const loadEditorContent = async (fileId: string) => {
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .single();

    setLanguage(data.language);
    setEditorContent(data.content);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load file content",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (activeFileId) loadEditorContent(activeFileId);
  }, [activeFileId]);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <LanguageSelect
            language={language}
            handleLanguageChange={handleLanguageChange}
          />
          <ThemeToggle />
        </div>
      </div>
      <div className="flex-1 rounded-lg border bg-card">
        <CodeEditor
          activeFileId={activeFileId}
          language={language}
          theme={theme}
          editorContent={editorContent}
          handleEditorChange={handleEditorChange}
        />
      </div>
    </div>
  );
}
