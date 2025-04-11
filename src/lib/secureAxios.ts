import axios from "axios"
import { getServerSession, Session } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import { createJWT } from "./createJWT"

// lib/secureAxios.ts
export const getSecureAxios = async (sessionParam?: Session) => {
  const session = sessionParam || await getServerSession(authOptions)
  if (!session?.user?.id) throw new Error("Unauthorized")

  const token = createJWT(session.user.id)

  const axiosInstance = axios.create({
    baseURL: process.env.API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return { axiosInstance, session }
}
