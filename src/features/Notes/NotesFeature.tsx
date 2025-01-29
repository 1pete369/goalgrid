"use client"

import { Button } from "@/components/ui/button"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Note } from "@/types/noteFeatureTypes"
import { deleteNote, getNotes } from "@/utils/notes"
import { Edit, ExternalLink, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function NotesFeature() {
  const { user } = useUserContext()
  const [notes, setNotes] = useState<Note[]>([])

  // Fetch notes from localStorage (or from a backend, if needed)
  useEffect(() => {
    if (user !== null) {
      async function loadNotes() {
        const notesReturned: Note[] = await getNotes(user?.uid as string)
        setNotes(notesReturned)
      }
      loadNotes()
    }
  }, [user])

  const handleDeleteNote = async (noteId: string) => {
    setNotes(notes.filter((note) => note.id !== noteId))
    await deleteNote(noteId)
  }

  if (user === null)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    )

  return (
    <div className="container md:px-24 p-4 pt-6 min-w-full">
      <header className="text-4xl font-semibold my-3 md:flex gap-20">
        <div>
          Hello, {user?.personalInfo.name.split(" ")[0]}!
          <p className="text-lg text-neutral-500">Create Notes here!</p>
        </div>

        <Link href={"/work/personal/notes/create-note"}>
          <Button className="font-semibold text-lg">
            <Plus />
            Add new Note!
          </Button>
        </Link>
      </header>
      <div className="mt-6 flex flex-wrap gap-5">
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes available.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="max-w-sm w-full p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col"
            >
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {note.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(note.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-x-2">
                  <Link href={`/work/personal/notes/${note.id}/edit`}>
                    <Button>
                      <Edit />
                    </Button>
                  </Link>
                  <Button onClick={() => handleDeleteNote(note.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <Link href={`/work/personal/notes/${note.id}`}>
                <Button className="mt-4 w-full text-sm text-white rounded px-4 py-2">
                  View Note <ExternalLink />
                </Button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
