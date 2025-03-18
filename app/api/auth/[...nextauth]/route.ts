import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// This is a simple auth configuration - in a real application, you'd store these
// credentials securely, ideally in a database with encrypted passwords
const adminCredentials = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'kaizen2024!'
};

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        // Check if credentials match the admin credentials
        if (
          credentials.username === adminCredentials.username &&
          credentials.password === adminCredentials.password
        ) {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@kaizendigital.com",
            role: "admin"
          };
        }
        
        // Invalid credentials
        return null;
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
});

export { handler as GET, handler as POST }; 