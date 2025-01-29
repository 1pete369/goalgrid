"use client"
import TextEditor from "@/AppComponents/TextEditor/TextEditor"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Journal } from "@/types/journalTypes"
import { getTodayDate } from "@/utils/basics"
import { createJournal } from "@/utils/journals"
import { redirect } from "next/navigation"
import React, { useState } from "react"

export default function Page() {
  const [editorContent, setEditorContent] = useState("")
  const [name, setName] = useState("")
  const { user } = useUserContext()

  const onSubmit = async (name: string, content: string) => {
    if (user !== null) {
      const todayDate = getTodayDate()

      const journalObject: Journal = {
        name,
        content,
        id: crypto.randomUUID(),
        uid: user?.uid,
        createdDate: todayDate,
        createdAt: new Date().toISOString()
      }
      console.log("journalObject", journalObject)
      await createJournal(journalObject)
      redirect(".")
    }
  }

  return (
    <div className="container md:px-24 p-4 pt-6  space-y-4">
      <header className="text-4xl font-semibold my-3">
        Create Journal here!
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
