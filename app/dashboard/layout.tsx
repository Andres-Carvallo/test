import Header from "@/components/Header/Header";
import MarqueeTop from "@/components/Header/MarqueeTop";
import Footer from "@/components/Footer/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MarqueeTop />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
