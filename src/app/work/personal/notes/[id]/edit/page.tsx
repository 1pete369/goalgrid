"use client"
import TextEditor from "@/AppComponents/TextEditor/TextEditor"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Note } from "@/types/noteFeatureTypes"
import { getTodayDate } from "@/utils/basics"
import { getNote, updateNote } from "@/utils/notes"
import axios from "axios"
import { redirect } from "next/navigation"
import React, { use, useEffect, useState } from "react"

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const [editorContent, setEditorContent] = useState("")
  const [name, setName] = useState("")
  const [noteId, setNoteId] = useState("")
  const { user } = useUserContext()
  const { id } = use(params)

  useEffect(() => {
    async function loadNote() {
      if (id) {
        const noteFetched: Note = await getNote(id)
        setNoteId(noteFetched.id)
        setName(noteFetched.name)
        setEditorContent(noteFetched.content)
      }
    }
    loadNote()
  }, [id])

  const onSubmit = async (name: string, content: string) => {
    if (user !== null) {
      const todayDate = getTodayDate()
      const noteObject: Note = {
        name,
        content,
        id: noteId,
        uid: user?.uid,
        createdDate: todayDate,
        createdAt: new Date().toISOString()
      }

      await updateNote(noteObject)
      redirect(".")
    }
  }

  return (
    <div className="container md:px-24 p-4 pt-6  space-y-4">
      <header className="text-4xl font-semibold my-3">
        Create Notes here!
      </header>
      <TextEditor
        editorContent={editorContent}
        setEditorContent={setEditorContent}
        name={name}
        setName={setName}
        onSubmit={onSubmit}
        type="note"
      />
    </div>
  )
}
