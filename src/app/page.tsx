"use server";

import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <>
      <div className="text-center">
        <h1>TRISTAN</h1>
        <p>
          T - TRPC <br />
          R - React (impliziert durch Next.js) <br />
          I - Integrity (bezogen auf Datenschutz) <br />
          S - Schulungen <br />
          T - Tailwind CSS <br />
          A - Auth (von Next Auth) <br />
          N - Next.js <br />
        </p>
      </div>
      {!session && (
        <div className="mt-8 text-center">
          <Button asChild>
            <Link href="/api/auth/signin">Anmelden</Link>
          </Button>
        </div>
      )}
      {session?.user && (
        <div className="mt-8 text-center">
          {session.user.name && session.user.name.length > 2 ? (
            <>
              <h2>Hallo {session.user.name}</h2>
            </>
          ) : (
            <h3>
              Du hast noch keinen Namen angegeben. <br />
              Bitte gebe diesen in deinem{" "}
              <Link href="/Benuzter" className="text-primary underline">
                Profil
              </Link>{" "}
              ein.
            </h3>
          )}
        </div>
      )}
    </>
  );
}
