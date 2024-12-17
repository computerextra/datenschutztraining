import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import NavigationMenu from "./_components/NavigationMenu";
import AcceptTestPage from "./_components/AcceptTestPage";

export const metadata: Metadata = {
  title: "TRISTAN",
  description: "Ein Datenschutz Training",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <AcceptTestPage />
          <NavigationMenu />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
