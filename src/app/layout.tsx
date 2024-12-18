import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "@/trpc/react";
import NavigationMenu from "./_components/NavigationMenu";
import AcceptTestPage from "./_components/AcceptTestPage";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "TRISTAN",
  description: "Ein Datenschutz Training",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${GeistSans.variable}`}
    >
      <body>
        <TRPCReactProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AcceptTestPage />
            <NavigationMenu />
            <div className="container mx-auto mt-12">{children}</div>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
