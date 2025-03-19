import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// This is a simple auth configuration - in a real application, you'd store these
// credentials securely, ideally in a database with encrypted passwords
const adminCredentials = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'kaizen2024!'
};

// Define schema for customer login credentials
const customerLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

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
    }),
    CredentialsProvider({
      id: 'customer-login',
      name: 'Customer Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const { email, password } = customerLoginSchema.parse(credentials);
          
          const customer = await prisma.customer.findUnique({
            where: { email },
          });
          
          if (!customer) return null;
          
          const passwordValid = await bcrypt.compare(password, customer.passwordHash);
          
          if (!passwordValid) return null;
          
          return {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            role: 'customer',
            stripeCustomerId: customer.stripeCustomerId
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/customer-login',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        if (user.stripeCustomerId) {
          token.stripeCustomerId = user.stripeCustomerId;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        if (token.stripeCustomerId) {
          session.user.stripeCustomerId = token.stripeCustomerId as string;
        }
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 