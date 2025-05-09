"use client"

import { getSignedURL } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Media } from "@/types/mediaType"
import axios from "axios"
import { Plus, Upload } from "lucide-react"
import Image from "next/image"
import React, { SetStateAction, useState } from "react"

type PropsType = {
  setMediaUrl: React.Dispatch<SetStateAction<string>>
  setMediaType: React.Dispatch<SetStateAction<string>>
}

const FileUpload = ({ setMediaType, setMediaUrl }: PropsType) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")

  const { user } = useUserContext()

  const [progress, setProgress] = useState<number>(0)

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const createMediaObject = (file: File, signedUrl: string) => {
    if (user === null) return
    const Media: Media = {
      id: crypto.randomUUID(),
      uid: user.uid,
      type: file.type.startsWith("image") ? "image" : "video",
      url: signedUrl.split("?")[0],
      createdAt: new Date().toISOString()
    }

    return Media
  }

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer()
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
    return hashHex
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setStatusMessage("uploading")
    setIsUploading(true)

    try {
      const checksum = await computeSHA256(selectedFile)
      const signedURLResult = await getSignedURL(
        selectedFile.type,
        selectedFile.size,
        checksum
      ) // Await here

      // Debugging the result from the server
      console.log("signedURLResult", signedURLResult)

      if (signedURLResult.failure) {
        console.log(signedURLResult.failure)
        setStatusMessage(signedURLResult.failure)
        setIsUploading(false)
        console.log("Error: User not authenticated or failed to get signed URL")
        return
      }

      const url = signedURLResult.success?.url
      console.log("signedUrl", { url })

      if (!url) {
        setStatusMessage("Error generating signed URL")
        setIsUploading(false)
        return
      }

      const response = await axios.put(url, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            setProgress(percentCompleted)
            console.log(`Upload Progress: ${percentCompleted}%`)
          }
        }
      })

      if (response.status === 200) {
        setStatusMessage("uploaded")
        if (signedURLResult.success?.url) {
          const mediaObject = createMediaObject(
            selectedFile,
            signedURLResult.success?.url
          )
          console.log(mediaObject)
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/medias/create-media`,
            { mediaObject }
          )
          setMediaUrl(mediaObject?.url as string)
          console.log("MediaUploadButton -> mediaUrl:", mediaObject?.url)
          setMediaType(mediaObject?.type as string)
          console.log("MediaUploadButton -> mediaType:", mediaObject?.type)
      
          console.log("Response of media created", response.data)
        }
      } else {
        setStatusMessage("Error uploading")
      }
    } catch (error) {
      console.error("Error during upload process:", error)
      setStatusMessage("Error during upload, Retry!")
    } finally {
      setIsUploading(false)
    }
  }
  
  return (
    <Card className="max-w-md w-full p-4 rounded-lg shadow-md mx-auto">
    <CardContent className="p-2 flex flex-col items-center">
      {/* Image/Video Preview */}
      {previewUrl && selectedFile && (
        <div className="relative w-full">
          <p className="text-center text-sm truncate">{selectedFile.name}</p>
          {selectedFile.type.startsWith("image/") ? (
            <Image
              height={200}
              width={200}
              src={previewUrl}
              alt="Preview"
              className="rounded-lg w-full h-48 object-contain"
            />
          ) : (
            <div className="flex rounded-lg w-full h-48 justify-center items-center">
              <video
                className="w-auto h-48"
                src={previewUrl}
                autoPlay
                loop
                muted
                controls={false}
              />
            </div>
          )}
          <Button
            variant="destructive"
            className="absolute right-2 top-2"
            onClick={() => {
              setPreviewUrl(null)
              setSelectedFile(null)
            }}
          >
            <Plus className="rotate-45" />
          </Button>
        </div>
      )}

      {/* File Input & Upload */}
      <div className="w-full flex flex-col items-center gap-4 mt-4">
        <label htmlFor="file-input" className="cursor-pointer flex items-center bg-black text-white py-2 px-4 rounded-lg">
          <Upload size={16} />
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
          id="file-input"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading || statusMessage === "Uploaded"}
          className="w-full relative overflow-hidden"
        >
          <p className={`z-10 ${isUploading ? "text-black animate-pulse" : "text-white"}`}>
            {statusMessage || "Send"}
          </p>
          {statusMessage !== "" && (
            <Progress value={progress} className={`absolute h-full w-full ${isUploading ? "bg-green-100" : "bg-black"}`} />
          )}
        </Button>
      </div>
    </CardContent>
  </Card>
  )
}

export default FileUpload
