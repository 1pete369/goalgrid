import { NextResponse } from "next/server"
import axios from "axios"

// ✅ Fetch subscription data from your backend API
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")
    console.log(userId)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/check-subscription-status/${userId}`
    )
    console.log(response.data)

    return NextResponse.json({ plan: response.data?.plan })
  } catch (error) {
    console.error("Subscription API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    )
  }
}
