"use server";

import BackButton from "@/components/BackButton";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import AufgabenForm from "../_components/AufgabenForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await auth();
  await api.aufgaben.get.prefetch({ id });
  await api.fragen.getAll.prefetch();

  if (!session?.user.admin) redirect("/");

  return (
    <HydrateClient>
      <BackButton href="/Admin/Aufgaben" />
      <AufgabenForm id={id} />
    </HydrateClient>
  );
}
