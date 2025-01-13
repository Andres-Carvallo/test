"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import BannerSkeleton from "../BannerSkeleton";

// Importamos el componente principal de forma dinámica
const BannerContent = dynamic(() => import("./BannerPrincipal02Content"), {
  loading: () => <BannerSkeleton />,
  ssr: true,
});

const BannerPrincipal02: React.FC = () => {
  return (
    <Suspense fallback={<BannerSkeleton />}>
      <BannerContent />
    </Suspense>
  );
};

export default BannerPrincipal02;
