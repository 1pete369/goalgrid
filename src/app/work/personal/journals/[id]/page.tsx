"use client"

import { Button } from "@/components/ui/button"
import { Journal } from "@/types/journalTypes"
import { getJournal } from "@/utils/journals"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { use, useEffect, useState } from "react"

export default function FullJournal({params} : {params :Promise<{ id: string }>}) {
  const { id } = use(params)
  const [journal, setJournal] = useState<Journal | null>(null)

  useEffect(() => {
    async function loadJournal(){
      if (id) {
        const journalFetched = await getJournal(id)
        setJournal(journalFetched)
      }
    }
    loadJournal()
  }, [id])

  if (!journal) return <p>Journal not found.</p>

  return (
    <div className="container md:px-24 p-4 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mx-auto p-3 max-w-6xl border-solid border-b-2">
          <p className="text-lg font-semibold">{journal.name}</p>
          <div className="flex gap-1 items-center">
            <p className="text-sm  text-slate-700 dark:text-slate-400">
              Date: {journal.createdDate}
            </p>
            <Link href={"."}>
              <Button className="text-sm border ml-1" variant="link">
                <ArrowLeft />
              </Button>
            </Link>
          </div>
        </div>

        <div
          className="mx-auto px-6 py-4 max-w-6xl dark:prose-invert markdown prose"
          dangerouslySetInnerHTML={{ __html: journal.content }}
        />
      </div>
    </div>
  )
}
