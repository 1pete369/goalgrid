import { NextResponse } from "next/server"
import axios from "axios"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const categoryId = (await params).categoryId
  if (!categoryId) {
    return NextResponse.json({ message: "Missing CategoryId" }, { status: 400 })
  }

  try {
    const response = await axios.delete(
      `${process.env.API_URL}/categories/delete-category/${categoryId}`
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

  console.log("Came to patch")
  
  const categoryId = (await params).categoryId
  console.log("Came to patch")
  if (!categoryId) {
    return NextResponse.json({ message: "Missing Category Id" }, { status: 400 })
  }
  try {
    const response = await axios.patch(
      `${process.env.API_URL}/categories/update-category-status/${categoryId}`
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
