"use client";

import SidebarLayout from "@/components/SidebarLayout";
import "@/components/SidebarLayout/SidebarLayout.module.css";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
