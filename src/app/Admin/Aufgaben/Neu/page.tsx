"use server";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import BackButton from "@/components/BackButton";
import AufgabenForm from "../_components/AufgabenForm";

export default async function Page() {
  const session = await auth();
  await api.fragen.getAll.prefetch();

  if (!session?.user.admin) redirect("/");

  return (
    <HydrateClient>
      <BackButton href="/Admin/Aufgaben" />
      <h1>Admin - Neue Aufgabe anlegen</h1>
      <AufgabenForm id={undefined} />
    </HydrateClient>
  );
}
