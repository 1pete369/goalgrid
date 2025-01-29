"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import ToolBar from "./ToolBar";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ImageResize from "tiptap-extension-resize-image";
import Underline from "@tiptap/extension-underline";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";

type TextEditorPropsType = {
  editorContent: string;
  setEditorContent: React.Dispatch<React.SetStateAction<string>>;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (name: string, content: string) => void;
  type: "note" | "journal";
};

export default function TextEditor({
  editorContent,
  setEditorContent,
  name,
  setName,
  onSubmit,
  type,
}: TextEditorPropsType) {
  const [nameError, setNameError] = useState("");
  const [contentError, setContentError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const pathname = usePathname();
  const isEdit = pathname.split("/")[5] === "edit";

  const { toast } = useToast();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Heading.configure({ levels: [1, 2, 3] }),
      OrderedList.configure({ HTMLAttributes: { class: "list-decimal ml-3" } }),
      BulletList.configure({ HTMLAttributes: { class: "list-disc ml-3" } }),
      Highlight,
      Image.configure({ inline: true, allowBase64: true }),
      ImageResize, // Keep the ImageResize extension enabled
      Underline,
    ],
    content: editorContent,
    editorProps: {
      attributes: {
        class:
          "prose w-full h-full max-w-3xl mx-auto py-2 px-3 overflow-y-auto focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      if (!isFocused) {
        const content = editor.getHTML();
        setEditorContent(content); // Update content only if not focused
      }
    },
    onFocus: () => {
      setIsFocused(true); // Set focused state to true
    },
    onBlur: () => {
      if(editor){
        // Prevent resetting image sizes
        const content = editor.getHTML();
        setEditorContent(content); // Save current content including image sizes
        setIsFocused(false); // Mark editor as unfocused
      }
    },
  });

  useEffect(() => {
    if (editor && editorContent && !isFocused) {
      editor.commands.setContent(editorContent); // Prevent overwriting when focused
    }
  }, [editor, editorContent, isFocused]);

  const validateAndSubmit = () => {
    const nameErr = name.trim().length === 0 ? "Name is required" : "";
    const contentErr = editor && editor.isEmpty ? "Content is empty" : "";
    setNameError(nameErr);
    setContentError(contentErr);
    if (!nameErr && !contentErr) {
      onSubmit(name, editorContent); // Pass data to the parent component or API
      toast({
        description: isEdit
          ? type === "note"
            ? "Note updated!"
            : "Journal updated!"
          : type === "note"
          ? "Note saved!"
          : "Journal saved!",
      });
    }
  };

  return (
    <div className="relative">
      {editor && (
        <div className="flex flex-col items-center w-full whitespace-normal break-words">
          <ToolBar editor={editor} className="w-full max-w-3xl mb-4" />
          <div className="w-full max-w-3xl mt-2">
            <Input
              type="text"
              value={name}
              placeholder="Enter Name"
              required
              onChange={(e) => setName(e.target.value)}
              className="mb-2"
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">{nameError}</p>
            )}
            <div className="w-full max-w-3xl mt-2 h-[400px] border-solid border-2 rounded-lg overflow-hidden focus:ring-0">
              <EditorContent
                editor={editor}
                className="h-full overflow-auto focus:outline-none"
              />
            </div>
            {contentError && (
              <p className="text-red-500 text-sm mt-1">{contentError}</p>
            )}
          </div>
          <Button
            className="mt-4 w-full max-w-xs py-2 text-lg text-white"
            onClick={validateAndSubmit}
          >
            {isEdit ? "Update" : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
}
