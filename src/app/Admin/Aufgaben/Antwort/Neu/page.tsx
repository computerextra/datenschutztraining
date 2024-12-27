"use server";

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import BackButton from "@/components/BackButton";
import AntwortForm from "../_components/AntwortForm";

export default async function Page() {
  const session = await auth();

  if (!session?.user.admin) redirect("/");

  return (
    <HydrateClient>
      <BackButton href="/Admin/Aufgaben" />
      <h1>Admin - Neue Antwort anlegen</h1>
      <AntwortForm id={undefined} />
    </HydrateClient>
  );
}
