"use server";

import BackButton from "@/components/BackButton";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import FrageForm from "../_components/FrageForm";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const session = await auth();
  await api.fragen.get.prefetch({ id });
  await api.antwort.getAll.prefetch();

  if (!session?.user.admin) redirect("/");

  return (
    <HydrateClient>
      <BackButton href="/Admin/Aufgaben" />
      <FrageForm id={id} />
    </HydrateClient>
  );
}
