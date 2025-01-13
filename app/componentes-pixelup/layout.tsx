"use client";
import { RevalidationProvider } from "@/app/Context/RevalidationContext";
import Navbar from "@/components/PIXELUP/Navbar/Navbar02/cdgnavbar";
import { getActiveNavbar, getActiveFooter } from "../config/GlobalConfig";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ActiveNavbar = getActiveNavbar();
  const ActiveFooter = getActiveFooter();
  return (
    
    <RevalidationProvider>
      <div>
        <ActiveNavbar />
        {children}
        <ActiveFooter />
      </div>
    </RevalidationProvider>
  );
}
