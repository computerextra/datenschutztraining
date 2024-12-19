"use server";

import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import Overview from "./_components/All";

export default async function Info() {
  const session = await auth();

  if (!session?.user.admin) redirect("/");

  return (
    <HydrateClient>
      <h1>Admin - Info Übersicht</h1>
      <Button asChild className="my-4">
        <Link href="/Admin/Info/New">Neue Info anlegen</Link>
      </Button>
      <Overview />
    </HydrateClient>
  );
}
