"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <h1>Admin - Medien Verwaltung</h1>
      <div className="mt-12 flex w-full justify-around">
        <Button asChild className="px-12 py-6">
          <Link href="/Admin/Medien/Bilder">Bilder</Link>
        </Button>
        <Button asChild className="px-12 py-6">
          <Link href="/Admin/Medien/Dateien">Dateien</Link>
        </Button>
      </div>
    </>
  );
}
