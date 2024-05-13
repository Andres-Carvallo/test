import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APIContextProvider } from "@/app/Context/ProductTypeContext";
import toast, { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
export const metadata: Metadata = {
  title: "PixelUP - PRO",
  description: "buff your bussiness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <APIContextProvider SiteId={SiteId}>
        <body className={inter.className}>
          <Toaster />
          <div className="min-h-screen">{children}</div>
        </body>
      </APIContextProvider>
    </html>
  );
}
