"use server";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import User from "./_components/user";

export default async function UserPage() {
  const session = await auth();
  await api.user.get.prefetch();
  await api.aufgaben.getByUser.prefetch({ id: undefined });

  if (!session) redirect("/");

  return (
    <HydrateClient>
      <User userId={session.user.id} />
    </HydrateClient>
  );
}
