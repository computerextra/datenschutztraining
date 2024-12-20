"use server";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import Edit from "../_components/Edit";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await auth();
  await api.info.get.prefetch({ id: id });

  if (!session?.user.admin) redirect("/");

  return (
    <HydrateClient>
      <Edit id={id} />
    </HydrateClient>
  );
}
