"use client";

import { usePathname } from "next/navigation";
import SidebarLayout from "@/components/SidebarLayout";
import "@/components/SidebarLayout/SidebarLayout.module.css";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // List of pages where sidebar should NOT appear
  const noSidebarRoutes = ["/"];

  const pathname = usePathname();
  const showSidebar = !noSidebarRoutes.includes(pathname);

  return showSidebar ? (
    <SidebarLayout>{children}</SidebarLayout>
  ) : (
    <>{children}</>
  );
}
