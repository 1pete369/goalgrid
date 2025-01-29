// pages/work/personal/notes/[id].tsx
"use client"

import { useRouter } from "next/router"
import { use, useEffect, useState } from "react"
import { Note } from "@/types/noteFeatureTypes"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BiLeftArrow } from "react-icons/bi"
import { ArrowLeft } from "lucide-react"
import { getNote } from "@/utils/notes"

export default function FullNote({params} : {params :Promise<{ id: string }>}) {
  const { id } = use(params)
  const [note, setNote] = useState<Note | null>(null)
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    async function loadNote(){
      if (id) {
        setLoading(true)
        const noteFetched = await getNote(id)
        setNote(noteFetched)
        setLoading(false)
      }
    }
    loadNote()
  }, [id])

  if (!note) return <p>Note not found.</p>

  return (
    <div className="container md:px-24 p-4 pt-6 mt-10">
      <div className="mx-auto max-w-5xl">
        <Link href={"."}>
          <Button className="text-sm mb-6"><ArrowLeft /> All Notes</Button>
        </Link>

        <div className="flex items-center justify-between mx-auto p-6 max-w-3xl border-solid border-b-2">
          <p className="text-xl font-semibold">{note.name}</p>
          <p className="text-right text-slate-700 dark:text-slate-400">
            Date: {note.createdDate}
          </p>
        </div>

        <div
          className="mx-auto px-6 py-4 max-w-3xl dark:prose-invert markdown prose"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
      </div>
    </div>
  )
}
