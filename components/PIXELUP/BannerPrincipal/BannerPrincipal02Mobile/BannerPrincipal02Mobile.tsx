import { Suspense } from "react";
import dynamic from "next/dynamic";
import BannerSkeleton from "../BannerSkeleton";

const BannerContent = dynamic(
  () => import("./BannerPrincipal02MobileContent"),
  {
    loading: () => <BannerSkeleton />,
    ssr: true,
  }
);

const BannerPrincipal02Mobile: React.FC = () => {
  return (
    <Suspense fallback={<BannerSkeleton />}>
      <BannerContent />
    </Suspense>
  );
};

export default BannerPrincipal02Mobile;
