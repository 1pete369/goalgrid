import { NextResponse } from "next/server"
import axios from "axios"
import { getSecureAxios } from "@/lib/secureAxios"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/authOptions"

export async function GET(req: Request) {

  const session = await getServerSession(authOptions) // ✅ Fetch once
  
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  try {
    const response = await axiosInstance.get(
      `/categories/get-categories/${session.user.id}`
    )
    console.log(response.data.categories)
    const categories = response.data.categories
    console.log("Fetched Categories")
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error Fetching categories", error)
    return NextResponse.json(
      {
        message: "Internal Server Error"
      },
      {
        status: 500
      }
    )
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) // ✅ Fetch once
  
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  const {category} = await req.json()
  console.log("Category",category)
  try {
    const response = await axiosInstance.post(
      `/categories/create-category`,
      { category }
    )
    console.log(response.data)
    const data = response.data
    console.log("data",data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error Posting category", error)
    return NextResponse.json(
      {
        message: "Internal Server Error"
      },
      {
        status: 500
      }
    )
  }
}


