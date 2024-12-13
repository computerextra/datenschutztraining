"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <>
      <main>
        <div className="container mx-auto mt-16 text-center">
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
        <div className="container mx-auto mt-16">
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle className="large">ACHTUNG!</AlertTitle>
            <AlertDescription>
              Diese Seite ist für den internen Gebraucht der Firmen
              Computer-Extra und AEM Communication gedacht! <br />
              <span className="large">
                Diese Seite setzt ungefragt Cookies! <br />
              </span>
              Wenn dies nicht gewollt ist, muss die Seite verlassen werden!
              <div className="mt-4 flex justify-between">
                <Button asChild>
                  <Link href="/Start">Verstanden</Link>
                </Button>
                <Button asChild>
                  <Link href="/Impressum">Impressum</Link>
                </Button>

                <Button asChild>
                  <Link href="/Datenschutz">Datenschutz</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </>
  );
}
