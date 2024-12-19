"use server";

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import New from "../_components/New";

export default async function Page() {
  const session = await auth();

  if (!session?.user.admin) redirect("/");

  return (
    <HydrateClient>
      <h1>Neue Info Anlegen</h1>
      <New />
    </HydrateClient>
  );
}
