"use server";

import { api, HydrateClient } from "@/trpc/server";
import Read from "../_components/Read";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  await api.info.get.prefetch({ id: id });

  return (
    <HydrateClient>
      <Read id={id} />
    </HydrateClient>
  );
}
