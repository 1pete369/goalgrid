"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import Greetings from "@/AppComponents/Greetings"
import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import { Button } from "@/components/ui/button"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { useCustomToast } from "@/hooks/useCustomToast"
import JournalSkeleton from "@/skeletons/JournalSkeleton"
import { Journal } from "@/types/journalTypes"
import { deleteJournal, getJournals } from "@/utils/journals"
import { Edit, EllipsisVertical, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export default function JournalFeature() {
  const { user } = useUserContext()
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [journalToDelete, setJournalToDelete] = useState<Journal | null>(null)

  const { showToast } = useCustomToast()

  useEffect(() => {
    if (user !== null) {
      async function loadJournals() {
        setLoading(true)
        const journalsReturned: Journal[] = await getJournals(
          user?.uid as string
        )
        setJournals(journalsReturned)
        setLoading(false)
      }
      loadJournals()
    }
  }, [user])

  const handleDeleteJournal = async (journalId: string) => {
    if (user !== null) {
      setDeleteLoading(true)
      // Optimistically update the UI
      setJournals(journals.filter((journal) => journal.id !== journalId))
      const result = await deleteJournal(journalId)
      if (result.success) {
        showToast("Journal Deleted", 200)
        setJournalToDelete(null)
      } else {
        showToast(result.message, result.status)
      }
      setDeleteLoading(false)
    }
  }

  if (user === null) return <FullPageLoading />

  return (
    <div className="container md:px-16 p-4 pt-20 min-w-full ">
      <header className="flex md:flex-row gap-2 md:gap-4 items-center justify-between">
        <Greetings feature="Journals" />
        <Link href={"/work/personal/journals/create-journal"}>
          <Button className="font-semibold text-base flex items-center">
            <Plus />
            Add <span className="hidden md:inline">Journal!</span>
          </Button>
        </Link>
      </header>
      <div className="mt-6 flex flex-wrap gap-4">
        {loading ? (
          <JournalSkeleton />
        ) : Array.isArray(journals) && journals.length === 0 ? (
          <p className="text-gray-500">No Journals available.</p>
        ) : (
          journals.map((journal) => (
            <div
              key={journal.id}
              className="w-full sm:w-[290px] p-4 border rounded-sm shadow-none flex flex-col"
            >
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold">{journal.name}</h3>
                  <p className="text-xs">
                    {new Date(journal.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-sm shadow-none"
                      aria-label="More Actions"
                    >
                      <EllipsisVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/work/personal/journals/${journal.id}/edit`}
                        aria-label="Edit Journal"
                      >
                        <div className="flex items-center gap-2">
                          <Edit size={14} />
                          <span>Edit Journal</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setJournalToDelete(journal)}
                      className="text-red-600"
                    >
                      <div className="flex items-center gap-2">
                        <Trash2 size={14} />
                        <span>Delete Journal</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link href={`/work/personal/journals/${journal.id}`}>
                <Button
                  variant="outline"
                  className="mt-4 w-full text-sm rounded-sm shadow-none px-4 py-2"
                >
                  View Journal <ExternalLink />
                </Button>
              </Link>
              {/* AlertDialog for Delete Confirmation */}
              <AlertDialog
                open={journalToDelete?.id === journal.id}
                onOpenChange={(open) => {
                  if (!open) setJournalToDelete(null)
                  else setJournalToDelete(journal)
                }}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the Journal!
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button
                      onClick={() => handleDeleteJournal(journal.id)}
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
            </div>
          ))
        )}
      </div>
    </div>
  )
}
