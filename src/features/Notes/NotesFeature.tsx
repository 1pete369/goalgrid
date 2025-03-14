"use client"

import Greetings from "@/AppComponents/Greetings"
import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import NoteSkeleton from "@/skeletons/NoteSkeleton"
import { Note } from "@/types/noteFeatureTypes"
import { deleteNote, getNotes } from "@/utils/notes"
import { Edit, ExternalLink, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function NotesFeature() {
  const { user } = useUserContext()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading,setLoading]= useState(false)

  // Fetch notes from localStorage (or from a backend, if needed)
  useEffect(() => {
    if (user !== null) {
      async function loadNotes() {
        setLoading(true)
        const notesReturned: Note[] = await getNotes(user?.uid as string)
        setNotes(notesReturned)
        setLoading(false)
      }
      loadNotes()
    }
  }, [user])

  const handleDeleteNote = async (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
    await deleteNote(noteId)
  }

  if (user === null) return <FullPageLoading />

  return (
    <div className="container md:px-16 p-4 pt-20 min-w-full">
      <header className="flex md:flex-row gap-2 md:gap-4 items-center justify-between">
        <Greetings feature="Notes" />
        <Link href={"/work/personal/notes/create-note"}>
          <Button className="font-semibold text-base flex items-center">
            <Plus />
            Add
            <p className="hidden md:flex">new Note!</p>
          </Button>
        </Link>
      </header>
      <div className="mt-6 flex flex-wrap gap-4">
        {
        loading ? <NoteSkeleton /> :
       Array.isArray(notes) && notes.length === 0 ? (
          <p className="text-gray-500">No notes available.</p>
        ) : (
          Array.isArray(notes) && notes.length> 0 && notes.map((note) => (
            <Card
              key={note.id}
              className="w-[290px] p-4 border rounded-lg shadow-sm flex flex-col bg-transparent dark:bg-transparent"
            >
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h3 className="text-base font-semibold">
                    {note.name}
                  </h3>
                  <p className="text-xs">
                    {new Date(note.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Link href={`/work/personal/notes/${note.id}/edit`}>
                    <Button variant="outline">
                      <Edit />
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => handleDeleteNote(note.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <Link href={`/work/personal/notes/${note.id}`}>
                <Button variant="outline" className="mt-4 w-full text-sm  rounded px-4 py-2 ">
                  View Note <ExternalLink />
                </Button>
              </Link>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
