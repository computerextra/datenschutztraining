"use server";

import BackButton from "@/components/BackButton";
import { api, HydrateClient } from "@/trpc/server";
import ImageBrowser from "./_components/Browser";
import UploadImage from "./_components/Uoload";

export default async function Page() {
  await api.image.getAll.prefetch();

  return (
    <HydrateClient>
      <BackButton href="/Admin/Medien" />
      <h1>Admin - Medien - Bilder</h1>
      <UploadImage />
      <ImageBrowser />
    </HydrateClient>
  );
}
