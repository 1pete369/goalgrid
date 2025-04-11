import { NextResponse } from "next/server"
import axios from "axios"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/authOptions"
import { getSecureAxios } from "@/lib/secureAxios"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ journalId: string }> }
) {
  try {
    const session = await getServerSession(authOptions) // ✅ Fetch once

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { axiosInstance } = await getSecureAxios(session)

    const journalId = (await params).journalId

    const { journalObj } = await req.json()

    if (!journalId) {
      return NextResponse.json(
        { message: "Missing journal id" },
        { status: 400 }
      )
    }
    const response = await axiosInstance.patch(
      `/journals/update-journal/${journalObj.id}`,
      { journalObj }
    )
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 504 }
    )
  }
}

export async function DELETE(
  req: Request,
  {
    params
  }: {
    params: Promise<{ journalId: string }>
  }
) {
  try {
    const session = await getServerSession(authOptions) // ✅ Fetch once

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { axiosInstance } = await getSecureAxios(session)
    const journalId = (await params).journalId
    if (!journalId) {
      return NextResponse.json(
        { message: "Missing journal id" },
        { status: 400 }
      )
    }
    const response = await axiosInstance.delete(
      `/journals/delete-journal/${journalId}`
    )
    return NextResponse.json(response.data)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 504 }
    )
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ journalId: string }> }
) {
  const session = await getServerSession(authOptions) // ✅ Fetch once

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)
  try {
    const journalId = (await params).journalId
    console.log("journalId", journalId)
    if (!journalId) {
      return NextResponse.json(
        { message: "Missing journal id" },
        { status: 400 }
      )
    }
    const response = await axiosInstance.get(
      `/journals/get-journal/${journalId}`
    )
    console.log("journal", response.data.journal)
    return NextResponse.json(response.data.journal)
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 504 }
    )
  }
}
