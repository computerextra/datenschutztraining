"use server";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";
import AdminUserOverview from "./_components/User";

export default async function AdminUser() {
  const session = await auth();
  await api.user.getAll.prefetch();

  if (!session?.user.admin) redirect("/");

  return (
    <HydrateClient>
      <h1>Admin - Benutzer</h1>
      <AdminUserOverview />
    </HydrateClient>
  );
}
