"use client"

import TextEditor from "@/AppComponents/TextEditor/TextEditor"
import { Note } from "@/types/noteFeatureTypes"
import { getTodayDate } from "@/utils/basics"
import { redirect } from "next/navigation"
import React, { useState } from "react"

export default function page() {
  const [editorContent, setEditorContent] = useState("")
  const [name,setName] = useState("")

  const onSubmit = (name : string, content: string)=>{
    const todayDate = getTodayDate()
    const noteObject : Note= {
        name,
        content,
        id : crypto.randomUUID(),
        createdDate : todayDate,
        createdAt : new Date().toISOString()
    }

    const existingNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    existingNotes.push(noteObject);
    localStorage.setItem("notes", JSON.stringify(existingNotes));
    console.log("Note submitted:", noteObject);
    redirect(".")
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
        type ="private"
      />
    </div>
  )
}
