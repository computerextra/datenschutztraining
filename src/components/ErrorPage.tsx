"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { usePathname } from "next/navigation";

export default function ErrorPage({
  Error,
}: {
  Error: string | undefined | null;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-[30vw]">
      <Alert className="text-primary">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Es ist ein Fehler aufgetreten</AlertTitle>
        <AlertDescription>
          Bitte wende dich per{" "}
          <a
            href="mailto:johannes.kirchner@computer-extra.de?subject=Fehler%20auf%20Datenschutztraining"
            className="underline"
          >
            Mail an den Administrator
          </a>{" "}
          mit folgendem Text:
          <div className="select-all">
            <blockquote className="mt-6 border-l-2 pl-6 italic">
              Fehler auf Pfad: {pathname} <br />
              Code: {Error}
            </blockquote>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
