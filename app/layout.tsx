import type { Metadata } from "next";
import "./globals.css";
import { DndContext } from "@dnd-kit/core";

export const metadata: Metadata = {
  title: "Task Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
