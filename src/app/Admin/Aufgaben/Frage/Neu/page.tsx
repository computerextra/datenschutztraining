"use server";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import FrageForm from "../_components/FrageForm";
import BackButton from "@/components/BackButton";

export default async function Page() {
  const session = await auth();
  await api.antwort.getAll.prefetch();

  if (!session?.user.admin) redirect("/");

  return (
    <HydrateClient>
      <BackButton href="/Admin/Aufgaben" />
      <h1>Admin - Neue Frage anlegen</h1>
      <FrageForm id={undefined} />
    </HydrateClient>
  );
}
