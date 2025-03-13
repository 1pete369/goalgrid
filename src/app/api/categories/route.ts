import { NextResponse } from "next/server"
import axios from "axios"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get("uid")
  if (!uid) {
    return NextResponse.json({ message: "Missing uid" }, { status: 400 })
  }
  try {
    const response = await axios.get(
      `${process.env.API_URL}/categories/get-categories/${uid}`
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
  const {category} = await req.json()
  console.log("Category",category)
  try {
    const response = await axios.post(
      `${process.env.API_URL}/categories/create-category`,
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


