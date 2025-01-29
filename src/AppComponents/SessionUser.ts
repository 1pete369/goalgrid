// app/utils/getAuthenticatedUser.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const getAuthenticatedUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user || null; // Returns the user or null if not authenticated
};
