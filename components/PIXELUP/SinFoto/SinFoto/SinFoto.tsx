"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// Definir interfaces para el tipado
interface BoxContent {
  title: string;
  contentText: string;
}

interface ContentData {
  epigrafe: string;
  titulo: string;
  contenido: string;
  box1: BoxContent;
  box2: BoxContent;
  box3: BoxContent;
}

interface ApiResponse {
  code: number;
  message: string;
  contentBlock: {
    title: string;
    contentText: string;
  };
}

const SinFoto: React.FC = () => {
  const ContentBlockId = process.env.NEXT_PUBLIC_SINFOTO_CONTENTBLOCK || "";
  const [contentData, setContentData] = useState<ContentData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${ContentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
        );

        if (response.data.code === 0 && response.data.contentBlock) {
          try {
            const parsedData = JSON.parse(response.data.contentBlock.contentText);
            setContentData(parsedData);
          } catch (error) {
            console.error("Error al parsear JSON:", error);
          }
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [ContentBlockId]);

  if (!contentData) {
    return null;
  }

  const getIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-star"
          >
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </svg>
        );
      case 1:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-trending-up"
          >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        );
      case 2:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-truck"
          >
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
            <path d="M15 18H9" />
            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
            <circle cx="17" cy="18" r="2" />
            <circle cx="7" cy="18" r="2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section id="propuesta-valor" className="pt-16 pb-8">
      <div className="mx-auto px-4 md:px-8 max-w-7xl text-center">
        <h2 className="text-xl md:text-3xl font-lora font-light text-[#10375d] mb-2">
          {contentData.epigrafe}
        </h2>
        <p className="text-lg italic font-lora text-[#10375d] mb-8 max-w-3xl mx-auto">
          {contentData.contenido}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[contentData.box1, contentData.box2, contentData.box3].map((box, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center relative p-4"
            >
              <div className="mb-3">
                <svg
                  className="w-8 h-8 text-[#10375d] stroke-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  {getIcon(index)}
                </svg>
              </div>
              <h3 className="text-lg font-medium text-[#ca2b63] mb-2 font-lora">
                {box.title}
              </h3>
              <p className="text-sm text-[#10375d] leading-relaxed max-w-xs">
                {box.contentText}
              </p>
              {index < 2 && (
                <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-[#ca2b63] opacity-30 -mx-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SinFoto;
