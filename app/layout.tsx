import type { Metadata } from "next";
import { Inter, Roboto_Mono, Kalam, Oswald } from "next/font/google";
import "./globals.css";
import { APIContextProvider } from "@/app/Context/ProductTypeContext";
import toast, { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });
const SiteId = process.env.NEXT_PUBLIC_API_URL_SITEID;

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});
const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-kalam",
});

const oswald = Oswald({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-oswald",
});
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
        <body
          className={` ${robotoMono.variable} ${kalam.variable} ${oswald.variable} `}
        >
          <Toaster />
          <div className="min-h-screen">{children}</div>
        </body>
      </APIContextProvider>
    </html>
  );
}
