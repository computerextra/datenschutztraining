"use server";

import { HydrateClient } from "@/trpc/server";

export default async function Page() {
  // Prefetch All Media

  return (
    <HydrateClient>
      <>
        <h1>Admin - Medien Verwaltung</h1>
        <p>Hier werden Bilder und co. angezeigt.</p>
      </>
    </HydrateClient>
  );
}
