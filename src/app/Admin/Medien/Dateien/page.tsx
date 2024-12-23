"use server";

import BackButton from "@/components/BackButton";
import { api, HydrateClient } from "@/trpc/server";
import Browser from "./_components/Browser";
import UploadFile from "./_components/Uoload";

export default async function Page() {
  await api.file.getAll.prefetch();

  return (
    <HydrateClient>
      <BackButton href="/Admin/Medien" />
      <h1>Admin - Medien - Dateien</h1>
      <UploadFile />
      <Browser />
    </HydrateClient>
  );
}
