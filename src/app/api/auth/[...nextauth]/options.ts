// import { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// // import { findUserByEmail, createUser } from './yourDbUtils'; // Adjust to your actual DB functions
// // import { getTimeZoneAndCountryCode } from './yourLocationUtils'; // Adjust to your actual location functions

// export const options: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: {
//           label: "Email",
//           type: "text",
//           placeholder: "email@example.com",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials) {
//           return null;
//         }

//         const { email, password } = credentials;
//         const user = {
//           id: "1",
//           name: "mikaylah",
//           email: "kureddy@gmail.com",
//           password: "mika",
//         };

//         if (email === user.email && password === user.password) {
//           return { id: user.id, name: user.name, email: user.email };
//         }

//         return null; // Authentication failed
//       },
//     }),
//   ],

//   session: {
//     strategy: "jwt",
//   },

//   pages: {
//     signIn: "/app/auth/signin",
//     error: "/auth/error",
//   },

//   callbacks: {
//     async signIn({ user, account, profile }) {
//       const { email, id, name,image } = user;
//       const provider = account?.provider;
      
//       console.log("user",user)
//       console.log("provider",provider)
//       console.log("profile",profile)

//       // Safe access to emailVerified property
//     //   const emailVerified = user?.emailVerified;


//       // Check if user exists in the database
//     //   const existingUser = await findUserByEmail(email);

//     //   if (!existingUser) {
//     //     const placeHolderForUserName = `_${crypto.randomUUID().slice(1, 10)}`;
//     //     const data = await getTimeZoneAndCountryCode();
//     //     const isGoogleProvider = provider === "google";

//     //     const newUser = {
//     //       uid: id,
//     //       personalInfo: {
//     //         email,
//     //         name: isGoogleProvider ? name?.toLowerCase() : "",
//     //         username: isGoogleProvider
//     //           ? name?.replace(/\s+/g, "").toLowerCase().concat(placeHolderForUserName)
//     //           : "",
//     //         photoURL: isGoogleProvider ? image : `https://picsum.photos/seed/${id}/200`,
//     //         provider: isGoogleProvider ? "google" : "email",
//     //         isEmailVerified: emailVerified,
//     //         dob: "",
//     //         profession: "",
//     //         intendedUseCases: [],
//     //         referralSource: "",
//     //         gender: "",
//     //       },
//     //       isOnboardingComplete: false,
//     //       customData: {
//     //         timezone: {
//     //           timezoneName: data.timezone,
//     //           countryCode: data.countryCode,
//     //         },
//     //         preferences: {
//     //           notification: false,
//     //         },
//     //         streak: 0,
//     //         goals: [],
//     //         days: [],
//     //         friends: [],
//     //         subscriptions: "",
//     //       },
//     //       updates: {
//     //         profileUpdatedAt: new Date(),
//     //       },
//     //       timings: {
//     //         createdAt: new Date(),
//     //         lastLoginAt: new Date(),
//     //       },
//     //     };

//     //     await createUser(newUser);
//     //   }

//       return true;
//     },

//     async jwt({ token, user }) {
//       if (user) {
//         token.user = user;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (token?.user) {
//         session.user = token.user;
//       }
//       return session;
//     },

//     async redirect({ url, baseUrl }) {
//       return url.startsWith(baseUrl) ? url : baseUrl;
//     },
//   },
// };
