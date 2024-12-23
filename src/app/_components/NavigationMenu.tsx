"use server";

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import Link from "next/link";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

export default async function NavigationMenu() {
  const session = await auth();

  return (
    <HydrateClient>
      <div className="mt-4 flex justify-center">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger asChild>
              <Link href="/">Startseite</Link>
            </MenubarTrigger>
          </MenubarMenu>
          {session?.user && (
            <>
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Link href="/Info">Informationen</Link>
                </MenubarTrigger>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <Link href="/Aufgaben">Aufgaben</Link>
                </MenubarTrigger>
              </MenubarMenu>
            </>
          )}
          <MenubarMenu>
            <MenubarTrigger asChild>
              <Link href="/Impressum">Impressum</Link>
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger asChild>
              <Link href="/Datenschutz">Datenschutz</Link>
            </MenubarTrigger>
          </MenubarMenu>
          {session?.user.admin && (
            <>
              <MenubarMenu>
                <MenubarTrigger>ADMIN</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem inset asChild>
                    <Link href="/Admin/Benutzer">Benutzer</Link>
                  </MenubarItem>
                  <MenubarItem inset asChild>
                    <Link href="/Admin/Info">Informationen</Link>
                  </MenubarItem>
                  <MenubarItem inset asChild>
                    <Link href="/Admin/Aufgaben">Aufgaben</Link>
                  </MenubarItem>
                  <MenubarItem inset asChild>
                    <Link href="/Admin/Medien">Medien</Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </>
          )}
          <MenubarMenu>
            {session && (
              <>
                <MenubarTrigger>
                  {session.user.name ?? session.user.email}
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem inset asChild>
                    <Link href="/Profil">Profil</Link>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem inset asChild>
                    <Link href="/api/auth/signout">Abmelden</Link>
                  </MenubarItem>
                </MenubarContent>
              </>
            )}
          </MenubarMenu>
        </Menubar>
      </div>
    </HydrateClient>
  );
}
