// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Apelează backendul tău pe portul 4000
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Invalid credentials");
        }

        // întoarcem userul; tokenul îl punem mai jos în jwt
        return {
          id: String(data.user.id),
          name: data.user.name,
          email: data.user.email,
          accessToken: data.token, // JWT primit de la backend
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      // la login, mutăm JWT-ul în tokenul NextAuth
      if (user?.accessToken) {
        (token as any).accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      // expunem JWT-ul în session (util pentru fetch-uri din client)
      (session as any).accessToken = (token as any).accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// v5: exportăm explicit metodele HTTP
export const GET = handlers.GET;
export const POST = handlers.POST;
