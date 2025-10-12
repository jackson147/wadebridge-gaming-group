import { type DefaultSession } from "next-auth";
import { type UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole; // Add role here
    } & DefaultSession["user"];
  }
}
