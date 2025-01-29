"use client"
import TextEditor from "@/AppComponents/TextEditor/TextEditor"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Journal } from "@/types/journalTypes"
import { Note } from "@/types/noteFeatureTypes"
import { getTodayDate } from "@/utils/basics"
import { getJournal, updateJournal } from "@/utils/journals"
import { updateNote } from "@/utils/notes"
import { redirect } from "next/navigation"
import { use, useEffect, useState } from "react"

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const [editorContent, setEditorContent] = useState("")
  const [name, setName] = useState("")
  const [journalId, setJournalId] = useState("")
  const { user } = useUserContext()
  const { id } = use(params)

  useEffect(() => {
    async function loadJournal() {
      if (id) {
        const journalFetched: Journal = await getJournal(id)
        setJournalId(journalFetched.id)
        setName(journalFetched.name)
        setEditorContent(journalFetched.content)
      }
    }
    loadJournal()
  }, [id])

  const onSubmit = async (name: string, content: string) => {
    if (user !== null) {
      const todayDate = getTodayDate()
      const journalObject: Journal = {
        name,
        content,
        id: journalId,
        uid: user?.uid,
        createdDate: todayDate,
        createdAt: new Date().toISOString()
      }

      await updateJournal(journalObject)
      redirect(".")
    }
  }

  return (
    <div className="container md:px-24 p-4 pt-6  space-y-4">
      <header className="text-4xl font-semibold my-3">
        Update Journal here!
      </header>
      <TextEditor
        editorContent={editorContent}
        setEditorContent={setEditorContent}
        name={name}
        setName={setName}
        onSubmit={onSubmit}
        type="journal"
      />
    </div>
  )
}
