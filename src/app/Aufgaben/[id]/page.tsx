"use server";

import BackButton from "@/components/BackButton";
import { api, HydrateClient } from "@/trpc/server";
import Aufgabe from "../_components/Aufgabe";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  await api.aufgaben.get.prefetch({ id });

  return (
    <HydrateClient>
      <BackButton href="/Aufgaben" />
      <Aufgabe id={id} />
    </HydrateClient>
  );
}
