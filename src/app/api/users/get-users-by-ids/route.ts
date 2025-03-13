import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const { userIds } = await req.json(); // Extract userIds from the request body

  try {
    const response = await axios.post(
      `${process.env.API_URL}/users/get-users-by-ids`,
      { userIds }
    );
    return NextResponse.json({ users: response.data.users });
  } catch (error) {
    console.error("Error fetching users by IDs:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
