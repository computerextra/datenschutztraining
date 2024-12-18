import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { db } from "@/server/db";
import { env } from "@/env";

const allowedDomains = ["computer-extra.de", "aem-gruppe.de"];

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
      admin: boolean;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    Nodemailer({
      server: {
        host: env.EMAIL_SERVER_HOST,
        port: env.EMAIL_SERVER_PORT,
        auth: {
          user: env.EMAIL_SERVER_USER,
          pass: env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: env.EMAIL_FROM,
      normalizeIdentifier(identifier: string): string {
        // Get the first two elements only,
        // separated by `@` from user input.
        // eslint-disable-next-line prefer-const
        let [local, domain] = identifier.toLowerCase().trim().split("@");
        if (identifier.split("@").length > 2) {
          throw new Error("Only one email allowed");
        }
        // The part before "@" can contain a ","
        // but we remove it on the domain part
        if (domain == null) throw new Error("No Domain");
        domain = domain.split(",")[0];
        if (domain == null) throw new Error("No Domain");
        if (!allowedDomains.includes(domain))
          throw new Error("Domain not allowed");

        return `${local}@${domain}`;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
} satisfies NextAuthConfig;
