import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // Restrict to VIT email domain
          hd: "vitstudent.ac.in",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Verify that the user's email is from VIT domain
      const email = user.email || "";
      if (!email.endsWith("@vitstudent.ac.in")) {
        return false; // Deny sign-in if not a VIT email
      }
      return true;
    },
    async session({ session, token }) {
      // Add user id to session if needed
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect errors to login page
  },
  session: {
    strategy: "jwt",
  },
});
