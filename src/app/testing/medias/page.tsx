"use client"

import { deleteMedia } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Media } from "@/types/mediaType"
import axios from "axios"
import { Trash2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function MediaComponent() {
  const [medias, setMedias] = useState<Media[] | []>([])
  const { user } = useUserContext()

  useEffect(() => {
    if (user !== null) {
      async function fetchMedia() {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/medias/get-media/${user?.uid}`
        )
        setMedias(response.data.medias)
      }
      fetchMedia()
    }
  }, [user])

  const handleMediaDelete = async (media: Media) => {

    await deleteMedia(media.url)

    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/medias/delete-media/${media.id}`
    )
    console.log(response.data)
    setMedias((prev) => prev.filter((m) => m.id !== media.id))
  }

  if (user === null) {
    return <p className="text-center text-gray-500">Loading...</p>
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <Card className="p-6 max-w-4xl w-full shadow-lg border border-gray-200 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-center mb-4">
            Your Media Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(medias) && medias.length > 0 ? (
              medias.map((media) => (
                <div
                  key={media.id}
                  className="flex flex-col bg-white shadow-md rounded-xl overflow-hidden"
                >
                  {media.type === "image" ? (
                    <Image
                      height={400}
                      width={400}
                      src={media.url}
                      alt="media"
                      quality={100}
                      className="h-[200px] w-full object-cover"
                    />
                  ) : (
                    <div className="h-[200px] w-full bg-black flex items-center justify-center">
                      <video
                        className="h-full w-auto rounded-lg"
                        src={media.url}
                        autoPlay
                        loop
                        muted
                        controls={false}
                      />
                    </div>
                  )}
                  <div className="p-4 flex justify-between items-center">
                    <Button
                      variant="outline"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleMediaDelete(media)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No Media Found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


