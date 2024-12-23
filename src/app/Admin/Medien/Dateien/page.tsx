"use server";

import BackButton from "@/components/BackButton";
import { api, HydrateClient } from "@/trpc/server";

export default async function Page() {
  await api.file.getAll.prefetch();

  return (
    <HydrateClient>
      <BackButton href="/Admin/Medien" />
      <h1>Admin - Medien - Dateien</h1>
    </HydrateClient>
  );
}
