"use client"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"

import { ImageIcon } from "lucide-react"
import { SetStateAction } from "react"
import FileUpload from "./FileUpload"

type PropsType = {
  setMediaUrl: React.Dispatch<SetStateAction<string>>
  setMediaType: React.Dispatch<SetStateAction<string>>
  popoverClose: boolean
  setPopOverClose: React.Dispatch<SetStateAction<boolean>>
}

export default function MediaUploadButton({
  setMediaType,
  setMediaUrl,
  popoverClose,
  setPopOverClose
}: PropsType) {
  return (
    <AlertDialog open={popoverClose} onOpenChange={() => setPopOverClose(prev => !prev)}>
      <AlertDialogTrigger className="h-12 mx-2 text-muted-foreground hover:text-foreground transition">
        <ImageIcon size={26} />
      </AlertDialogTrigger>
  
      <AlertDialogContent className="w-full max-w-lg p-6 rounded-xl border border-border shadow-xl bg-background space-y-6">
        <div className="flex justify-between items-center border-b pb-3">
          <AlertDialogTitle className="text-lg font-semibold">
            Upload Media
          </AlertDialogTitle>
          <AlertDialogCancel className="text-sm text-muted-foreground hover:text-destructive transition">
            Cancel
          </AlertDialogCancel>
        </div>
  
        <div className="pt-2">
          <FileUpload setMediaType={setMediaType} setMediaUrl={setMediaUrl} />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
  
}
