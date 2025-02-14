"use client";

import BannerTienda02BO from "./cdgBannerTienda02BO";
import { useState, useEffect } from "react";

export default function hero() {
  const BannerAbout02 = {
    BannerId: "24eed87b-2b78-4922-836a-9d860f878350",
    BannerImageId: "62ef3e11-da1d-47ef-8332-f00aa953d181",
  };

  return <BannerTienda02BO BannerAboutBOData={BannerAbout02} />;
}
