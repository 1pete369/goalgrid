import { NextResponse } from "next/server"
import axios from "axios"
import { getSecureAxios } from "@/lib/secureAxios"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/authOptions"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {

    const session = await getServerSession(authOptions) // ✅ Fetch once
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
  
    const { axiosInstance } = await getSecureAxios(session)
  

  const categoryId = (await params).categoryId
  if (!categoryId) {
    return NextResponse.json({ message: "Missing CategoryId" }, { status: 400 })
  }

  try {
    const response = await axiosInstance.delete(
      `/categories/delete-category/${categoryId}`
    )

    console.log(response.data)
    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Error Fetching categories", error)

    // Axios error handling
    if (error.response) {
      if (error.response.status === 404) {
        return NextResponse.json(
          { message: "Category not found" },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { message: error.response.data.message || "Error deleting category" },
        { status: error.response.status }
      )
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const session = await getServerSession(authOptions) // ✅ Fetch once
  
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  const { axiosInstance } = await getSecureAxios(session)

  console.log("Came to patch")
  
  const categoryId = (await params).categoryId

  console.log("Came to patch")
  
  if (!categoryId) {
    return NextResponse.json({ message: "Missing Category Id" }, { status: 400 })
  }
  try {
    const response = await axiosInstance.patch(
      `/categories/update-category-status/${categoryId}`
    )
    console.log(response.data)
    const updatedCategory = response.data.updatedCategory
    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error Updating Category:", error)
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    )
  }
}
