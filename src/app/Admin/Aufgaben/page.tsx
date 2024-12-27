"use server";

import { api, HydrateClient } from "@/trpc/server";
import All from "./_components/All";
import DieAntwoord from "./_components/DieAntwoord";
import AlleFragen from "./_components/AlleFragen";

export default async function Page() {
  await api.aufgaben.getAll.prefetch();
  await api.fragen.getAll.prefetch();
  await api.antwort.getAll.prefetch();

  return (
    <HydrateClient>
      <h1>Admin - Aufgaben</h1>
      <All />
      <AlleFragen />
      <DieAntwoord />
    </HydrateClient>
  );
}
