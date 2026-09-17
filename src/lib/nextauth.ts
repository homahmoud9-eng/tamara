import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { customer: true }
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return user;
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    }
  },
  events: {
    // When a user is created (e.g. via Google), create or link a Customer profile
    async createUser({ user }) {
      try {
        if (!user.email) return;

        const existingCustomer = await prisma.customer.findUnique({
          where: { email: user.email }
        });

        if (existingCustomer) {
          if (!existingCustomer.userId) {
            // Customer exists but is not linked to any User (e.g. Guest checkout). Safe to link.
            await prisma.customer.update({
              where: { id: existingCustomer.id },
              data: { userId: user.id }
            });
          } else if (existingCustomer.userId === user.id) {
            // Already linked correctly, do nothing.
          } else {
            // Customer is linked to a different User account.
            // Do not overwrite it, and do not create a duplicate customer.
            console.warn(`Customer with email ${user.email} is already linked to User ${existingCustomer.userId}. Skipping customer link for User ${user.id}.`);
          }
        } else {
          // Create a new customer
          await prisma.customer.create({
            data: {
              name: user.name || "User",
              email: user.email,
              phone: `GOOGLE_${user.id}`, // Placeholder
              userId: user.id
            }
          });
        }
      } catch (error) {
        console.error("Error creating/linking customer in NextAuth:", error);
      }
    }
  }
};
