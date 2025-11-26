export const runtime = "nodejs";

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/clientPromise";
import { connectDB } from "@/lib/mongodb";
import User, { IUser } from "@/models/User";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "database",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        (session.user as any).id = user.id;
        (session.user as any).role = (user as any).role;
        (session.user as any).isProfileComplete = (user as any).isProfileComplete;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      return true;
    },
  },
  pages: {
    signIn: '/login', // Optional: custom sign in page
    // newUser: '/onboarding' // This can be used to redirect new users
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
