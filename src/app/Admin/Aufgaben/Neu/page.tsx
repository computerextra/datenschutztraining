"use server";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import New from "../_components/New";
import BackButton from "@/components/BackButton";

export default async function Page() {
  const session = await auth();
  await api.fragen.getAll.prefetch();

  if (!session?.user.admin) redirect("/");

  return (
    <HydrateClient>
      <BackButton href="/Admin/Aufgaben" />
      <h1>Admin - Neue Aufgabe anlegen</h1>
      <New />
    </HydrateClient>
  );
}