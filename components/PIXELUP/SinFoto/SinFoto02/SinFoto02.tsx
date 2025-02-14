"use client";

import React, { useState, useEffect } from "react";

interface Welcome01Props {
  WelcomeData: {
    BannerId: string;
    Box1Id?: string;
    Box2Id?: string;
    Box3Id?: string;
  };
}

interface BoxContent {
  title: string;
  contentText: string;
}

interface BannerContent {
  title: string;
  buttonText: string;
  landingText: string;
}

const SinFoto02: React.FC<Welcome01Props> = ({ WelcomeData }) => {
  const { BannerId, Box1Id, Box2Id, Box3Id } = WelcomeData;
  const [bannerData, setBannerData] = useState<BannerContent | null>(null);
  const [box1Data, setBox1Data] = useState<BoxContent | null>(null);
  const [box2Data, setBox2Data] = useState<BoxContent | null>(null);
  const [box3Data, setBox3Data] = useState<BoxContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch banner data
      const bannerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${BannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        { next: { revalidate: 60 } }
      );
      const bannerData = await bannerResponse.json();
      setBannerData(bannerData.banner.images[0]);

      // Fetch data for boxes
      const [box1Response, box2Response, box3Response] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${Box1Id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          { next: { revalidate: 60 } }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${Box2Id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          { next: { revalidate: 60 } }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${Box3Id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          { next: { revalidate: 60 } }
        ),
      ]);

      const [box1Data, box2Data, box3Data] = await Promise.all([
        box1Response.json(),
        box2Response.json(),
        box3Response.json(),
      ]);

      setBox1Data(box1Data.contentBlock);
      setBox2Data(box2Data.contentBlock);
      setBox3Data(box3Data.contentBlock);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <section className="px-4 text-center container mx-auto pt-20 animate-pulse">
        {/* Esqueleto de carga similar al diseño original */}
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded max-w-2xl mx-auto mb-2"></div>
        <div className="h-4 bg-gray-200 rounded max-w-xl mx-auto mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-lg border shadow-sm"
            >
              <div className="h-6 bg-gray-200 rounded-full w-6 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 text-center  mx-4 bg-gray-100 py-12">
      <h2 className="text-4xl font-bold text-gray-800 mb-4 font-kalam">
        {bannerData?.buttonText}
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-2">
        {bannerData?.landingText}
      </p>
      <p className="text-lg text-gray-600 font-kalam mb-8">
        {bannerData?.title}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {/* Box 1 */}
        {box1Data && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-2 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-[16px] font-semibold text-primary mb-2">
              {box1Data.title}
            </h3>
            <p className="text-gray-600 text-[14px] leading-6">
              {box1Data.contentText}
            </p>
          </div>
        )}

        {/* Box 2 */}
        {box2Data && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-2 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 0 1-.657.643 48.39 48.39 0 0 1-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 0 1-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 0 0-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 0 1-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 0 0 .657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 0 1-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 0 0 5.427-.63 48.05 48.05 0 0 0 .582-4.717.532.532 0 0 0-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.96.401v0a.656.656 0 0 0 .658-.663 48.422 48.422 0 0 0-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 0 1-.61-.58v0Z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-[16px] font-semibold text-primary mb-2">
              {box2Data.title}
            </h3>
            <p className="text-gray-600 text-[14px] leading-6">
              {box2Data.contentText}
            </p>
          </div>
        )}

        {/* Box 3 */}
        {box3Data && (
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-2 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-[16px] font-semibold text-primary mb-2">
              {box3Data.title}
            </h3>
            <p className="text-gray-600 text-[14px] leading-6">
              {box3Data.contentText}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SinFoto02;