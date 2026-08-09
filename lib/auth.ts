import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUser } from "@/lib/users";
import { enforceAuthRateLimit } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Email e senha",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials.password) return null;
        await enforceAuthRateLimit(request.headers, credentials.email);
        return verifyUser(credentials.email, credentials.password);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
};
