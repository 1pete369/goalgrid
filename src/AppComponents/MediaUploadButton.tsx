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
    <>
      <AlertDialog
        open={popoverClose}
        onOpenChange={() => setPopOverClose((prev) => !prev)}
      >
        <AlertDialogTrigger>
          <ImageIcon size={30} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col justify-center">
            <div className="flex justify-between">
              <AlertDialogTitle>Upload Image/Video </AlertDialogTitle>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </div>
            <FileUpload
              setMediaType={setMediaType}
              setMediaUrl={setMediaUrl}
            />
          </AlertDialogHeader>
          <AlertDialogFooter></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
