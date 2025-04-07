import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request,{params}:{params: Promise<{emailId : string}>}) {
  try {
    const email=(await params).emailId
    console.log("Find by email called")
    
    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    
    const response = await axios.get(`${process.env.API_URL}/credentials/find-by-email/${email}`);
    
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error finding user by email:", error);
    return NextResponse.json({ error: "Failed to find user" }, { status: 500 });
  }
}
