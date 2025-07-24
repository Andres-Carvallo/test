"use client";
import { RevalidationProvider } from "@/app/Context/RevalidationContext";
import {
  DynamicNavbar,
  DynamicFooter,
} from "@/app/components/LayoutComponents";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RevalidationProvider>
      <div>

        {children}
 
      </div>
    </RevalidationProvider>
  );
}
