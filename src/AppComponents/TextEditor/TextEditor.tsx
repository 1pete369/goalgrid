
type TextEditorPropsType = {
  editorContent: string
  setEditorContent: React.Dispatch<React.SetStateAction<string>>
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  onSubmit: (name: string, content: string) => void
  type: "note" | "journal"
}

"use client"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import ToolBar from "./ToolBar"
import Heading from "@tiptap/extension-heading"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ImageResize from "tiptap-extension-resize-image"
import Underline from "@tiptap/extension-underline"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function TextEditor({
  editorContent,
  setEditorContent,
  name,
  setName,
  onSubmit,
  type
}: TextEditorPropsType) {
  const [nameError, setNameError] = useState("")
  const [contentError, setContentError] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const pathname = usePathname()
  const isEdit = pathname.split("/")[5] === "edit"

  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      TextAlign.configure({
        types: ["heading", "paragraph"]
      }),
      Heading.configure({
        levels: [1, 2, 3]
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal ml-3"
        }
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc ml-3"
        }
      }),
      Highlight,
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          style:
            "display: inline-block; margin-right: 10px; max-width: 100%; height: auto;"
        }
      }),
      ImageResize,
      Underline
    ],
    content: editorContent,
    editorProps: {
      attributes: {
        class:
          "prose w-full min-h-[400px] dark:text-white max-w-7xl mx-auto py-2 px-3 overflow-y-auto focus:outline-none whitespace-pre-wrap break-words"
      }
    },
    onUpdate: ({ editor }) => {
      if (!isFocused) {
        const selection = editor.state.selection // Save cursor position
        const content = editor.getHTML()

        setEditorContent(content) // Update state

        editor.commands.focus() // Keep editor focused
        editor.view.dispatch(editor.state.tr.setSelection(selection)) // Restore selection
      }
    },

    onFocus: () => {
      setIsFocused(true) // Set focused state to true
    },
    onBlur: () => {
      if (editor) {
        // Prevent resetting image sizes
        const content = editor.getHTML()
        setEditorContent(content) // Save current content including image sizes
        setIsFocused(false) // Mark editor as unfocused
      }
    }
  })

  const validateAndSubmit = () => {
    const nameErr = name.trim().length === 0 ? "Name is required" : ""
    const contentErr = editor && editor.isEmpty ? "Content is empty" : ""
    setNameError(nameErr)
    setContentError(contentErr)
    if (!nameErr && !contentErr) {
      onSubmit(name, editorContent)
    }
  }

  useEffect(() => {
    if (editor && editor.getHTML() !== editorContent) {
      editor.commands.setContent(editorContent, false)
    }
  }, [editorContent,editor])

  return (
    <div className="relative w-full flex flex-col items-center px-4">
      {editor && (
        <div className="w-full max-w-6xl space-y-4 flex flex-col">
          {/* Toolbar */}
          <div className="w-full overflow-x-auto">
            <ToolBar editor={editor} className="w-full" />
          </div>

          {/* Input for Title */}
          <Input
            type="text"
            value={name}
            placeholder="Enter Name"
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full text-lg px-4 py-2 border rounded-md focus:ring focus:ring-blue-500"
          />
          {nameError && <p className="text-red-500 text-sm">{nameError}</p>}

          {/* Editor Box */}
          <div className="w-full h-[400px] md:h-[500px]  border rounded-md shadow-sm overflow-hidden ">
            <EditorContent
              editor={editor}
              className="w-full h-[400px] md:h-[500px]  px-3 py-2 overflow-y-auto focus:outline-none  "
            />
          </div>
          {contentError && (
            <p className="text-red-500 text-sm">{contentError}</p>
          )}

          {/* Submit Button */}
          <Button
            className="w-full md:w-[300px] mx-auto py-2 text-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={validateAndSubmit}
          >
            {isEdit ? "Update" : "Save"}
          </Button>
        </div>
      )}
    </div>
  )
}
