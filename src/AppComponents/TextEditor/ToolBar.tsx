"use client"
import { List, Underline } from "lucide-react"
import { Toggle } from "../../components/ui/toggle"
import {
  Heading1,
  Heading2,
  Heading3,
  Code,
  Bold,
  Italic,
  Strikethrough,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Highlighter,
  Upload
} from "lucide-react"
import { ListOrdered } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChangeEvent, useState } from "react"

export default function ToolBar({ editor }: any) {
  if (!editor) return null

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const [imageUrl, setImageUrl] = useState("")

  const Options = [
    {
      icon: <Heading1 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      pressed: editor.isActive("heading", { level: 1 })
    },
    {
      icon: <Heading2 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      pressed: editor.isActive("heading", { level: 2 })
    },
    {
      icon: <Heading3 className="size-4" />,
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      pressed: editor.isActive("heading", { level: 3 })
    },
    {
      icon: <Bold className="size-4" />,
      onClick: () => editor.chain().focus().toggleBold().run(),
      pressed: editor.isActive("bold")
    },
    {
      icon: <Italic className="size-4" />,
      onClick: () => editor.chain().focus().toggleItalic().run(),
      pressed: editor.isActive("italic")
    },
    {
      icon: <Strikethrough className="size-4" />,
      onClick: () => editor.chain().focus().toggleStrike().run(),
      pressed: editor.isActive("strike")
    },
    {
      icon: <AlignLeft className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("left").run(),
      pressed: editor.isActive({ textAlign: "left" })
    },
    {
      icon: <AlignCenter className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("center").run(),
      pressed: editor.isActive({ textAlign: "center" })
    },
    {
      icon: <AlignRight className="size-4" />,
      onClick: () => editor.chain().focus().setTextAlign("right").run(),
      pressed: editor.isActive({ textAlign: "right" })
    },
    {
      icon: <List className="size-4" />,
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      pressed: editor.isActive("bulletList")
    },
    {
      icon: <ListOrdered className="size-4" />,
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      pressed: editor.isActive("orderedList")
    },
    {
      icon: <Code className="size-4" />,
      onClick: () => editor.chain().focus().toggleCodeBlock().run(),
      pressed: editor.isActive("code")
    },
    {
      icon: <Underline className="size-4" />,
      onClick: () => editor.chain().focus().toggleUnderline().run(),
      pressed: editor.isActive("code")
    },
    {
      icon: <Highlighter className="size-4" />,
      onClick: () => editor.chain().focus().toggleHighlight().run(),
      pressed: editor.isActive("highlight")
    }
  ]


  const AddImagePopover = () => {
    const handleAddImage = (url: string) => {
      if (url) {
        editor.chain().focus().setImage({ src: url, alt: "Image" }).run()
        const nextPos = editor.state.selection.$from + 1

        editor.chain().focus().setTextSelection(10).run()
      }
      setImageUrl("")
      setIsPopoverOpen(false)
    }

    const handleImageUrl = (e: ChangeEvent<HTMLInputElement>) => {
      setImageUrl(e.target.value)
    }

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="p-4">
            <Upload className=" size-6 " />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 mr-20">
          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              placeholder="Enter image URL"
              className="h-8"
              value={imageUrl}
              onChange={handleImageUrl}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  handleAddImage(imageUrl)
                }
              }}
            />
            <Button
              onClick={() => {
                handleAddImage(imageUrl)
              }}
              className="w-full"
            >
              Add Image
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <div className=" md:max-w-3xl w-full flex overflow-x-scroll scroll-smooth md:flex md:flex-wrap sm:flex sm:flex-wrap md:justify-center px-4 sm:px-8 mx-auto border rounded-md py-2 mb-1 bg-slate-50 space-x-1 gap-1 ">
      {Options.map((option, i) => (
        <Toggle
          key={i}
          size="sm"
          pressed={option.pressed}
          onPressedChange={option.onClick}
        >
          {option.icon}
        </Toggle>
      ))}
      <AddImagePopover />
    </div>
  )
}
