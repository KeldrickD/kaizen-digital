import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';

// Define schemas for validation
const customerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  isCustomer: z.boolean().optional(),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isCustomer: { label: 'IsCustomer', type: 'boolean' },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            throw new Error('No credentials provided');
          }

          // Validate credentials
          const result = customerSchema.safeParse(credentials);
          if (!result.success) {
            throw new Error('Invalid credentials format');
          }

          const { email, password, isCustomer } = result.data;

          // Check if it's an admin login
          if (!isCustomer && email === process.env.ADMIN_USERNAME) {
            if (password === process.env.ADMIN_PASSWORD) {
              return {
                id: 'admin',
                email: process.env.ADMIN_EMAIL || email,
                name: 'Administrator',
                role: 'admin',
              };
            } else {
              throw new Error('Invalid admin credentials');
            }
          }

          // For customer login
          const customer = await prisma.customer.findFirst({
            where: { email },
            include: {
              subscriptions: {
                orderBy: { createdAt: 'desc' },
                take: 1,
              },
            },
          });

          if (!customer || !customer.passwordHash) {
            throw new Error('Invalid email or password');
          }

          const isValid = await bcryptjs.compare(
            password,
            customer.passwordHash
          );

          if (!isValid) {
            throw new Error('Invalid email or password');
          }

          return {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            role: 'customer',
            stripeCustomerId: customer.stripeCustomerId || undefined,
          };
        } catch (error: any) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.stripeCustomerId = user.stripeCustomerId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.stripeCustomerId = token.stripeCustomerId as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}; 