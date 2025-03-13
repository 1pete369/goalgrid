"use client"
import TextEditor from "@/AppComponents/TextEditor/TextEditor"
import { useUserContext } from "@/contexts/UserDataProviderContext"
import { Note } from "@/types/noteFeatureTypes"
import { getTodayDate } from "@/utils/basics"
import { createNote } from "@/utils/notes"
import { redirect } from "next/navigation"
import React, { use, useState } from "react"

export default function Page() {
  const [editorContent, setEditorContent] = useState("")
  const [name, setName] = useState("")
  const { user } = useUserContext()

  const onSubmit = async (name: string, content: string) => {
    if (user !== null) {
      const todayDate = getTodayDate()
      const noteObject: Note = {
        name,
        content,
        id: crypto.randomUUID(),
        uid: user?.uid,
        createdDate: todayDate,
        createdAt: new Date().toISOString()
      }
      console.log("noteObject", noteObject)
    
      await createNote(noteObject)
      redirect(".")
    }
  }

  return (
    <div className="container md:px-24 p-4 pt-20 space-y-4">
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

// // {
//   "name": "sample",
//   "content": "<img src=\"https://ci3.googleusercontent.com/meips/ADKq_Nalyx5V5Q_wbhJSy5V0QfOyWPs03mAQoY5L3q4hA3Hr6J6TUNz-Uw-MdcphWeABPXoB-DlyCJ3JZu_dLRA9gPZFrzET6815zUz-_U2o3dxs8dXB17w7BeLhH9CevlNdwtMgeU_8msNvZuYadYr_E0DWL05XDJiao88jOnChLDtSL-tOZ5U6vX7zKjTRb67X_20Vfd5-PTOq2owwvX0c4M-D_5P9yGSjmSNhcF4zEMqTeh2-DCyCz7DTJJnSVtjV-ZZE7tqSR9DOLqGLdawoe1rbFwpjo4gc8jD1sn0mlCpQzm0bTCD7HUu-yxbN3QHa0UMATAc6zPCOqPYD=s0-d-e1-ft#https://mx.technolutions.net/proxy/V7rENby-I3dRIKMcLT7ieOthm0veNcvNSQGN3qDqofPCc3O-II0TThs4ceHsEkaP3GUSCUtYR9AzV5khO2BXL80iV0DRWlHFZms4qScdEVplXG3zaeSWBmxqkuIiOtZ9/eeE41w13pzijvVuS6aC2Cokrojanyon66agLo6GP-k74ew3LofQK4asgWPVmPU7i\" alt=\"Image\" style=\"width: 100%; height: auto; cursor: pointer;\" draggable=\"true\"><p><strong>Hi Uday Kumar Reddy</strong></p><p><br>Graduate Admissions at Stevens Institute of Technology would like to invite you to join us online on Thursday, January 23 for a <strong>Stevens Graduate Virtual Open House</strong>.<br><br><strong>What to expect:</strong></p><ul class=\"list-disc ml-3\"><li><p>Meet with our distinguished faculty to identify which of our leading 50+ Master’s, PhD or graduate certificate programs fits your career goals.</p></li><li><p>Learn about the graduate funding opportunities available to incoming students with competitive academic profiles.</p></li><li><p>Work with Graduate Admissions&nbsp;to discuss admissions requirements, the application process or submit an application.</p></li></ul><p style=\"text-align: center\"><strong>Join us virtually to learn about how a graduate degree from Stevens Institute of Technology can help to accelerate your career aspirations.​​</strong></p><p>Additionally, as a thank you we will be waiving the Application Fee for any attendee that submits a graduate application for the upcoming Fall 2025 Semester. Please be advised that if you have already submitted the Application Fee, we will be unable to refund this amount.<br><br>We look forward to seeing you there!<br><br><strong>Graduate Admissions</strong><br>Stevens Institute of Technology</p>",
//   "id": "1b633fb0-64ef-4715-8dd6-dea2a217d4fc",
//   "createdDate": "2025-01-23",
//   "createdAt": "2025-01-23T02:35:54.124Z"
// }
