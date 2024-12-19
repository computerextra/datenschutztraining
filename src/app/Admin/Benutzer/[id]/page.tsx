"use server";

import { api, HydrateClient } from "@/trpc/server";
import BenutzerBearbeiten from "../_components/Edit";

export default async function AdminBenutzerBearbeiten({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  await api.user.getAdmin.prefetch({ id });

  return (
    <HydrateClient>
      <BenutzerBearbeiten id={id} />
    </HydrateClient>
  );
}
