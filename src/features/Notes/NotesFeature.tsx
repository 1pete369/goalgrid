"use client"

import Greetings from "@/AppComponents/Greetings"
import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { useCustomToast } from "@/hooks/useCustomToast"
import NoteSkeleton from "@/skeletons/NoteSkeleton"
import { Note } from "@/types/noteFeatureTypes"
import { deleteNote, getNotes } from "@/utils/notes"
import { Edit, EllipsisIcon, EllipsisVertical, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function NotesFeature() {
  const { user } = useUserContext()
  const [notes, setNotes] = useState<Note[]>([])
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const { showToast } = useCustomToast()

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
    if (user !== null) {
      setDeleteLoading(true)
      // Optimistically remove the note from UI
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId))
      const result = await deleteNote(noteId)
      if (result.success) {
        showToast("Note deleted!", 200)
        // Reset deletion state
        setNoteToDelete(null)
      } else {
        showToast(result.message, result.status)
      }
      setDeleteLoading(false)
    }
  }

  if (user === null) return <FullPageLoading />

  return (
    <div className="container md:px-16 p-4 pt-20 min-w-full">
      <header className="flex md:flex-row gap-2 md:gap-4 items-center justify-between">
        <Greetings feature="Notes" />
        <Link href={"/work/personal/notes/create-note"}>
          <Button
            className="font-semibold text-base flex items-center"
            aria-label="Add Note"
          >
            <Plus />
            <span className="ml-1">
              Add <span className="hidden md:inline">Note!</span>
            </span>
          </Button>
        </Link>
      </header>

      <div className="mt-6 flex flex-wrap gap-4">
        {loading ? (
          <NoteSkeleton />
        ) : Array.isArray(notes) && notes.length === 0 ? (
          <p className="text-gray-500">No notes available.</p>
        ) : (
          Array.isArray(notes) &&
          notes.length > 0 &&
          notes.map((note) => (
            <Card
              key={note.id}
              className="w-[290px] p-4 border rounded-sm shadow-none flex flex-col bg-transparent dark:bg-transparent"
            >
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold">{note.name}</h3>
                  <p className="text-xs">
                    {new Date(note.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="shadow-none rounded-sm"
                        aria-label="More Actions"
                      >
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/work/personal/notes/${note.id}/edit`}
                          aria-label="Edit Note"
                        >
                          <div className="flex items-center gap-2">
                            <Edit size={14} />
                            <span>Edit Note</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setNoteToDelete(note)}
                        className="text-red-600"
                      >
                        <div className="flex items-center gap-2">
                          <Trash2 size={14} />
                          <span>Delete Note</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <Link href={`/work/personal/notes/${note.id}`}>
                <Button
                  variant="outline"
                  className="shadow-none rounded-sm mt-4 w-full text-sm px-4 py-2"
                  aria-label="View Note"
                >
                  View Note <ExternalLink />
                </Button>
              </Link>
              {/* Alert Dialog for confirming deletion */}
              <AlertDialog
                open={noteToDelete?.id === note.id}
                onOpenChange={(open) => {
                  if (!open) setNoteToDelete(null)
                  else setNoteToDelete(note)
                }}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the Note!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={deleteLoading}
                      aria-label="Confirm Delete"
                    >
                      {deleteLoading ? (
                        <p className="flex gap-1 items-center">
                          Deleting <Loader2 className="animate-spin" />
                        </p>
                      ) : (
                        "Continue"
                      )}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
