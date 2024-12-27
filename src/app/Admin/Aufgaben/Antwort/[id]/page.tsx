"use server";

import BackButton from "@/components/BackButton";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import AntwortForm from "../_components/AntwortForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await auth();
  await api.antwort.get.prefetch({ id });

  if (!session?.user.admin) redirect("/");

  return (
    <HydrateClient>
      <BackButton href="/Admin/Aufgaben" />
      <AntwortForm id={id} />
    </HydrateClient>
  );
}
