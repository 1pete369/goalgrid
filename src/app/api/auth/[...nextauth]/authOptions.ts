import bcrypt from "bcrypt"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import {
  createUserCredentials,
  credentialsUserType,
  fetchUserSubscription,
  findUserByEmail,
  sessionUserType
} from "./authAction"

export const authOptions: AuthOptions = {
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    // Credentials Provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        type: { label: "Type", type: "text" } // "login" or "register"
      },
      async authorize(credentials) {
        if (
          !credentials ||
          !credentials.email ||
          !credentials.password ||
          !credentials.type
        ) {
          throw new Error("All fields are required.")
        }

        const { email, password, type } = credentials

        try {
          if (type === "login") {
            // Login logic
            const userFromDb = await findUserByEmail(email)
            if (!userFromDb.flag || !userFromDb.user) {
              throw new Error("User not found.")
            }

            const user = userFromDb.user

            if (!user.hashedPassword) {
              throw new Error("Password not set for this user.")
            }

            const isPasswordValid = await bcrypt.compare(
              password,
              user.hashedPassword
            )
            if (!isPasswordValid) {
              throw new Error("Invalid email or password.")
            }

            const subscriptionPlan = await fetchUserSubscription(user.id)

            return {
              id: user.id,
              email: user.email,
              image: user.image || `https://picsum.photos/seed/${user.id}/200`,
              name: user.name || email.split("@")[0],
              provider: "credentials",
              accountVerified: user.accountVerified || false,
              subscriptionPlan: subscriptionPlan ?? "free"
            }
          } else if (type === "register") {
            // Registration logic
            const userFromDb = await findUserByEmail(email)

            if (userFromDb.flag) {
              console.log("user already exists")
              throw new Error("User already exists.")
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            const uid = crypto.randomUUID()

            const newUser: credentialsUserType = {
              id: uid,
              email,
              hashedPassword,
              name: email.split("@")[0],
              image: `https://picsum.photos/seed/${uid}/200`,
              provider: "credentials",
              accountVerified: false
            }

            const newUserCreated: sessionUserType = await createUserCredentials(
              newUser
            )

            // Fetch subscription info after registration

            return {
              id: newUserCreated.id,
              email: newUserCreated.email,
              image: newUserCreated.image,
              name: newUserCreated.name,
              provider: "credentials",
              accountVerified: false,
              subscriptionPlan: "free"
            }
          } else {
            throw new Error("Invalid request type.")
          }
        } catch (error) {
          console.error("Error in authorize function:", error)
          throw new Error(
            error instanceof Error ? error.message : "Authentication error."
          )
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      console.log("Before fetching:", token);
  
      if (user) {
        // Assign basic user details when signing in
        token.uid = user.id;
        token.provider = account?.provider;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
        token.accountVerified = profile?.email_verified || false;
      }
  
      // Always fetch the latest subscription plan
      try {
        console.log("Fetching updated subscription plan...");
        const subscriptionPlan = await fetchUserSubscription(token.sub as string);
        token.subscriptionPlan = subscriptionPlan || "free";
        console.log(`Fetched subscriptionPlan for user ${token.uid}: ${token.subscriptionPlan}`);
      } catch (error) {
        console.error("Error fetching subscription plan:", error);
        token.subscriptionPlan = "free"; // Default fallback
      }
  
      console.log("Final JWT token:", token);
      return token; // Ensure token is returned correctly
    },
  
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid as string
        session.user.provider = token.provider as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.image as string
        session.user.accountVerified =
          (token.accountVerified as boolean) || false
        session.user.subscriptionPlan = token.subscriptionPlan as string // Include subscription plan in session
      }
      console.log("session", session)
      return session
    }
  },  
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login"
  }
  
}