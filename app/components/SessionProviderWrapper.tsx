/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; // This makes the component a Client Component

import { SessionProvider } from "next-auth/react";

export default function SessionProviderWrapper({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
