"use server";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import DeletePage from "./_components/DeletePage";

export default async function Page({
  params,
}: {
  params: Promise<{
    userId: string;
    aufgabenId: string;
  }>;
}) {
  const session = await auth();
  const param = await params;

  await api.user.getAdmin.prefetch({ id: param.userId });
  await api.aufgaben.get.prefetch({ id: param.aufgabenId });

  console.log(param);

  if (!session?.user.admin) redirect("/");

  return (
    <HydrateClient>
      <DeletePage user={param.userId} aufgabe={param.aufgabenId} />
    </HydrateClient>
  );
}
