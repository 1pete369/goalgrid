// next-auth.d.ts
import NextAuth, {
  DefaultSession,
  DefaultUser,
  DefaultProfile
} from "next-auth"

declare module "next-auth" {
  interface Profile extends DefaultProfile {
    email_verified?: boolean // Add email_verified to the Profile type
  }
}
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      provider: string
      accountVerified: boolean
      subscriptionPlan: string; // Add subscriptionPlan to the Session type
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string
    provider: string
    accountVerified: boolean
    subscriptionPlan: string; // Add subscriptionPlan to the User type
  }
}
