"use server";

import { api, HydrateClient } from "@/trpc/server";
import Overview from "./_components/Overview";

export default async function Info() {
  await api.info.getAll.prefetch();
  await api.info.getLatest.prefetch();

  return (
    <HydrateClient>
      <h1>Informationen Übersicht</h1>
      <Overview />
    </HydrateClient>
  );
}
