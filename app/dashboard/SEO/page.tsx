import React from "react";
import type { Metadata } from "next";
import SEO from "./SEO";

export const metadata: Metadata = {
  title: "SEO | PixelUP",
  description: "Dashboard Pixelup",
};

const BannerAbout02 = {
  BannerId: "24eed87b-2b78-4922-836a-9d860f878350",
  BannerImageId: "62ef3e11-da1d-47ef-8332-f00aa953d181",
};
function SEOPage() {
  return <SEO BannerAboutBOData={BannerAbout02} />;
}

export default SEOPage;
