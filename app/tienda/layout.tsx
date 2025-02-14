/* eslint-disable @next/next/no-img-element */
"use client";
import { RevalidationProvider } from "@/app/Context/RevalidationContext";
import Navbar from "@/components/PIXELUP/Navbar/Navbar02/cdgnavbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RevalidationProvider>
      <div>
        <Navbar />
        {children}
        <a
          href={`https://wa.me/56978334123`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed right-6 bottom-[30px] z-50 bg-green-500 rounded-full p-3 hover:bg-green-600 transition-colors animate-pulse-whatsapp"
          style={{ zIndex: 999 }}
        >
          <img
            src="/whatsapp.svg"
            alt="WhatsApp"
            className="w-8 h-8 hover:scale-110 transition-transform duration-200"
          />
        </a>
      </div>
    </RevalidationProvider>
  );
}
