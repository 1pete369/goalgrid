"use client"

import { Button } from "@/components/ui/button"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Journal } from "@/types/journalTypes"
import { deleteJournal, getJournals } from "@/utils/journals"
import { Edit, ExternalLink, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function JournalFeature() {
  const { user } = useUserContext()
  const [journals, setJournals] = useState<Journal[]>([])

  useEffect(() => {
    if (user !== null) {
      async function loadJournals() {
        const journalsReturned: Journal[] = await getJournals(
          user?.uid as string
        )
        setJournals(journalsReturned)
      }
      loadJournals()
    }
  }, [user])

  const handleDeletejournal = async (journalId: string) => {
    setJournals(journals.filter((journal) => journal.id !== journalId))
    await deleteJournal(journalId)
  }

  if (user === null)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
      </div>
    )

  return (
    <div className="container md:px-24 p-4 pt-6 min-w-full ">
      <header className="text-4xl font-semibold my-3">
        Hello, {user?.personalInfo.name.split(" ")[0]}!
        <p className="text-lg text-neutral-500">Create Journals here!</p>
      </header>
      <Link href={"/work/personal/journals/create-journal"}>
        <Button className="font-semibold text-lg">
          <Plus />
          Add new Journal!
        </Button>
      </Link>

      <div className="mt-6 flex flex-wrap gap-5">
        {journals.length === 0 ? (
          <p className="text-gray-500">No Journals available.</p>
        ) : (
          journals.map((journal) => (
            <div
              key={journal.id}
              className="max-w-sm w-full p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col"
            >
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {journal.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(journal.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="space-x-2">
                  <Link href={`/work/personal/journals/${journal.id}/edit`}>
                    <Button>
                      <Edit />
                    </Button>
                  </Link>
                  <Button onClick={() => handleDeletejournal(journal.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <Link href={`/work/personal/journals/${journal.id}`}>
                <Button className="mt-4 w-full text-sm text-white rounded px-4 py-2">
                  View Journal <ExternalLink />
                </Button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
