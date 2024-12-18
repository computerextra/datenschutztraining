"use server";

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import Link from "next/link";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
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
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    New Window <MenubarShortcut>⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem disabled>New Incognito Window</MenubarItem>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger>Share</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>Email link</MenubarItem>
                      <MenubarItem>Messages</MenubarItem>
                      <MenubarItem>Notes</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />
                  <MenubarItem>
                    Print... <MenubarShortcut>⌘P</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger>Find</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>Search the web</MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>Find...</MenubarItem>
                      <MenubarItem>Find Next</MenubarItem>
                      <MenubarItem>Find Previous</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />
                  <MenubarItem>Cut</MenubarItem>
                  <MenubarItem>Copy</MenubarItem>
                  <MenubarItem>Paste</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                  <MenubarCheckboxItem>
                    Always Show Bookmarks Bar
                  </MenubarCheckboxItem>
                  <MenubarCheckboxItem checked>
                    Always Show Full URLs
                  </MenubarCheckboxItem>
                  <MenubarSeparator />
                  <MenubarItem inset>
                    Reload <MenubarShortcut>⌘R</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem disabled inset>
                    Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem inset>Toggle Fullscreen</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem inset>Hide Sidebar</MenubarItem>
                </MenubarContent>
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
                    <Link href="/">Benutzer</Link>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </>
          )}
          <MenubarMenu>
            {!session ? (
              <MenubarTrigger asChild>
                <Link href="/api/auth/signin">Anmelden</Link>
              </MenubarTrigger>
            ) : (
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
