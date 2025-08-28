"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

// Definir interfaces para el tipado
interface ContentData {
  title: string;
  paragraph: string;
  buttonText: string;
  buttonLink: string;
  mainImage?: {
    name: string;
    type: string;
    size: number;
    data: string;
  };
}

interface ApiResponse {
  code: number;
  message: string;
  contentBlock: {
    title: string;
    contentText: string;
  };
}

const Hero07: React.FC = () => {
  const ContentBlockId = process.env.NEXT_PUBLIC_HERO07_CONTENTBLOCK || "";
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

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* Columna de Imagen */}
          <div>
            <img
              src={contentData.mainImage?.data || "https://picsum.photos/800/600"}
              alt="Nuestra Empresa"
              className="w-full object-cover shadow-xl h-[600px]"
              style={{ borderRadius: "var(--radius)" }}
            />
          </div>
          
          {/* Columna de Texto */}
          <div>
            <h2 className="mb-6 font-bold text-4xl">
              {contentData.title}
            </h2>
            <div 
              className="mb-4 text-base"
              dangerouslySetInnerHTML={{ __html: contentData.paragraph }}
            />
            <div className="flex flex-col gap-4 pt-6 sm:flex-row">
              <Link 
                href={contentData.buttonLink}
                className="bg-primary text-white hover:bg-primary/80 inline-flex items-center justify-center border border-transparent px-6 py-2.5 text-base font-medium transition-colors duration-300"
                style={{
                  borderRadius: "var(--radius)",
                }}
              >
                {contentData.buttonText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero07;
