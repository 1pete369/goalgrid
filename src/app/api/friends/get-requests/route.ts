import { NextResponse } from "next/server";
import axios from "axios";
import { getSecureAxios } from "@/lib/secureAxios";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function GET(req: Request) {
  try {
    
    
    const session = await getServerSession(authOptions) // ✅ Fetch once
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
  
    const { axiosInstance } = await getSecureAxios(session)

    const response = await axiosInstance.get(
        `/friends/get-requests/${session.user.id}`
      )
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    return NextResponse.json({ error: "Failed to fetch friend requests" },
       { status: 500 });
  }
}
