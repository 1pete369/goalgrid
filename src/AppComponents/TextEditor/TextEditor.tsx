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
import { Button } from "../../components/ui/button"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

type TextEditorPropsType = {
  editorContent: string
  setEditorContent: React.Dispatch<React.SetStateAction<string>>
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  onSubmit: (name: string, content: string) => void // Custom submission logic
  type: "private" | "community" // Define type of feature
}

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
  // const [isSubmitted,setIsSubmitted] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    const savedContent = localStorage.getItem("EditorData")
    if (savedContent) setEditorContent(savedContent)
  }, [setEditorContent])

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Heading.configure({ levels: [1, 2, 3] }),
      OrderedList.configure({ HTMLAttributes: { class: "list-decimal ml-3" } }),
      BulletList.configure({ HTMLAttributes: { class: "list-disc ml-3" } }),
      Highlight,
      Image.configure({ inline: true, allowBase64: true }),
      ImageResize,
      Underline
    ],
    content: editorContent,
    editorProps: {
      attributes: {
        class:
          "prose w-full h-full max-w-3xl mx-auto py-2 px-3 overflow-y-auto focus:outline-none"
      }
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML()
      setEditorContent(content)
      localStorage.setItem("EditorData", content)
    }
  })

  const validateAndSubmit = () => {
    const nameErr = name.trim().length === 0 ? "Name is required" : ""
    const contentErr = editor && editor.isEmpty ? "Content is empty" : ""
    setNameError(nameErr)
    setContentError(contentErr)
    if (!nameErr && !contentErr) {
      onSubmit(name, editorContent) // Pass data to the parent component or API
      console.log(`Submitting ${type} note:`, { name, editorContent })
      toast({ description: "Note saved!" })
    }
  }

  return (
    <div className="relative"> 
      {editor && (
        <div className="flex flex-col items-center w-full ">
          <ToolBar editor={editor} className="w-full max-w-3xl mb-4" />
          <div className="w-full max-w-3xl mt-2">
            <Input
              type="text"
              value={name}
              placeholder="Enter Name!"
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
                className="h-full overflow-auto  focus:outline-none"
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
            Save
          </Button>
        </div>
      )}
    </div>
  )
}
