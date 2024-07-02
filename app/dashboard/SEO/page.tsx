import React from "react";
import type { Metadata } from "next";
import SEO from "./SEO";

export const metadata: Metadata = {
  title: "SEO | PixelUP",
  description: "Dashboard Pixelup",
};
function SEOPage() {
  return <SEO />;
}

export default SEOPage;
