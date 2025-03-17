"use client"
import TextEditor from "@/AppComponents/TextEditor/TextEditor"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { useCustomToast } from "@/hooks/useCustomToast"
import { Journal } from "@/types/journalTypes"
import { getTodayDate } from "@/utils/basics"
import { createJournal } from "@/utils/journals"
import { getResourceCount } from "@/utils/resource-limits"
import { redirect } from "next/navigation"
import React, { useState } from "react"

export default function Page() {
  const [editorContent, setEditorContent] = useState("")
  const [name, setName] = useState("")
  const { user } = useUserContext()
  const { showToast } = useCustomToast()

  const onSubmit = async (name: string, content: string) => {
    if (user !== null) {
      const resourceResult = await getResourceCount(
        user?.uid as string,
        "journals"
      )
      if (resourceResult.success) {
        const todayDate = getTodayDate()
        const journalObject: Journal = {
          name,
          content,
          id: crypto.randomUUID(),
          uid: user?.uid,
          createdDate: todayDate,
          createdAt: new Date()
        }
        console.log("journalObject", journalObject)
        const result = await createJournal(journalObject)
        if (result.success) {
          showToast("Journal Created!", 200)
        } else {
          showToast(result.message, result.status)
        }
      } else {
        showToast("Limit Reached. upgrate plan!", resourceResult.status)
      }

      redirect(".")
    }
  }

  return (
    <div className="container md:px-24 p-4 pt-20  space-y-4">
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
