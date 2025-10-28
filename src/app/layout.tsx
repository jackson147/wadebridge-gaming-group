import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { SessionProvider } from "next-auth/react";
import { auth } from "~/server/auth";
import { TopNav } from "./_components/TopNav";
import { ThemeProvider } from "~/components/context/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Wadebridge Gaming Group",
  description: "Community website for the Wadebridge Gaming Group",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${inter.variable} flex min-h-screen flex-col bg-linear-to-b from-gradientFrom to-gradientTo text-foreground`}
      >
        <SessionProvider session={session}>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system" // Changed to system for better user preference handling
              disableTransitionOnChange // Keeps transitions smooth
            >
              <TopNav />
              {children}
            </ThemeProvider>
          </TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
