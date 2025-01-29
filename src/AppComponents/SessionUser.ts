// app/utils/getAuthenticatedUser.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export const getAuthenticatedUser = async () => {
  const session = await getServerSession(authOptions);
  return session?.user || null; // Returns the user or null if not authenticated
};
