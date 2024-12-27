"use server";

import { api, HydrateClient } from "@/trpc/server";
import Aufgaben from "./_components/Aufgaben";
import { auth } from "@/server/auth";

export default async function Page() {
  const session = await auth();
  await api.aufgaben.getUndone.prefetch();

  return (
    <HydrateClient>
      <h1>Aufgaben</h1>
      <Aufgaben userName={session?.user.name} />
    </HydrateClient>
  );
}
