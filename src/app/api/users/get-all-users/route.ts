import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req:Request) {
  try {
    const response = await axios.get(`${process.env.API_URL}/users/get-all-users`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
