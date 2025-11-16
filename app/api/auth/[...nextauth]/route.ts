export const runtime = "nodejs";

import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import User, { IUser } from "@/models/User";

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    // ONE unified auth flow
    async signIn({ user }) {
      try {
        await connectDB();

        if (!user.email) {
          console.error("❌ No email from Google");
          return false; // only block in this rare case
        }

        const existingUser = (await User.findOne({
          email: user.email,
        })) as IUser | null;

        // first time: create user, mark as NOT onboarded, send to onboarding
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
            onboarded: false,
          });

          // 👇 redirect new user to onboarding page
          return "/onboarding";
        }

        // user exists:
        if (!existingUser.onboarded) {
          // not finished onboarding yet → send to onboarding again
          return "/onboarding";
        }

        // fully onboarded → allow normal redirect (e.g. dashboard)
        return true;
      } catch (error) {
        console.error("❌ ERROR IN signIn callback:", error);
        // If Mongo breaks, block sign in (you'll see AccessDenied)
        return false;
      }
    },

    async session({ session }) {
      try {
        await connectDB();

        if (!session.user?.email) return session;

        const dbUser = (await User.findOne({
          email: session.user.email,
        })) as IUser | null;

        if (dbUser) {
          (session.user as any).id = dbUser._id.toString();
          (session.user as any).onboarded = dbUser.onboarded;
        }

        return session;
      } catch (err) {
        console.error("❌ ERROR IN session callback:", err);
        return session;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
