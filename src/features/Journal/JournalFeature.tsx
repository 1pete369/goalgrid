"use client"

import Greetings from "@/AppComponents/Greetings"
import FullPageLoading from "@/AppComponents/loaders/FullPageLoading"
import { Button } from "@/components/ui/button"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import JournalSkeleton from "@/skeletons/JournalSkeleton"
import { Journal } from "@/types/journalTypes"
import { deleteJournal, getJournals } from "@/utils/journals"
import { Edit, ExternalLink, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function JournalFeature() {
  const { user } = useUserContext()
  const [journals, setJournals] = useState<Journal[]>([])
  const [loading,setLoading]= useState(false)

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

  const handleDeletejournal = async (journalId: string) => {
    setJournals(journals.filter((journal) => journal.id !== journalId))
    await deleteJournal(journalId)
  }

  if (user === null) return <FullPageLoading />

  return (
    <div className="container md:px-16 p-4 pt-20 min-w-full ">
      <header className="flex md:flex-row gap-2 md:gap-4 items-center justify-between">
        <Greetings feature="Journals" />
        <Link href={"/work/personal/journals/create-journal"}>
          <Button className="font-semibold text-base flex items-center">
            <Plus />
            Add
            <p className="hidden md:flex">new Journal!</p>
          </Button>
        </Link>
      </header>
      <div className="mt-6 flex flex-wrap gap-4">
        { loading ? <JournalSkeleton />: (Array.isArray(journals) && journals.length === 0) ? (
          <p className="text-gray-500">No Journals available.</p>
        ) : (
          Array.isArray(journals) && journals.length > 0 && journals.map((journal) => (
            <div
              key={journal.id}
              className="w-[290px] p-4 border rounded-lg shadow-sm flex flex-col"
            >
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h3 className="text-base font-semibold ">
                    {journal.name}
                  </h3>
                  <p className="text-xs">
                    {new Date(journal.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Link href={`/work/personal/journals/${journal.id}/edit`}>
                    <Button variant="outline">
                      <Edit />
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => handleDeletejournal(journal.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
              <Link href={`/work/personal/journals/${journal.id}`}>
                <Button variant="outline" className="mt-4 w-full text-sm rounded px-4 py-2">
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
