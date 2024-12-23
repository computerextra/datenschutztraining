"use server";

import { api, HydrateClient } from "@/trpc/server";
import All from "./_components/All";

export default async function Page() {
  await api.aufgaben.getAll.prefetch();

  return (
    <HydrateClient>
      <h1>Admin - Aufgaben</h1>
      <All />
    </HydrateClient>
  );
}
