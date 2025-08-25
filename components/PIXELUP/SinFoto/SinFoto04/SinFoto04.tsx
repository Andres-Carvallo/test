"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import * as LucideIcons from "lucide-react";

// Definir interfaces para el tipado
interface BoxContent {
  title: string;
  contentText: string;
  icon: string;
}

interface ContentData {
  title: string;
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

const SinFoto04: React.FC = () => {
  const ContentBlockId = process.env.NEXT_PUBLIC_SINFOTO04_CONTENTBLOCK || "";
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

  // Función para renderizar el icono dinámicamente
  const renderIcon = (iconName: string) => {
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<any>;
    if (IconComponent) {
      return <IconComponent />;
    }
    return <LucideIcons.Zap />; // Icono por defecto
  };

  if (!contentData) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {[contentData.box1, contentData.box2, contentData.box3].map((box, index) => (
            <div
              key={index}
              className="bg-white p-4 transition-all duration-300 hover:shadow-lg md:p-6 border border-gray-200 rounded-lg"
            >
              <div
                className="mx-auto mb-4 flex items-center justify-center h-16 w-16 bg-gray-50 rounded-lg"
                style={{ color: "var(--primary-color)" }}
              >
                <svg
                  className="h-10 w-10 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {renderIcon(box.icon)}
                </svg>
              </div>
              <h3 className="mb-3 text-center font-semibold text-xl">
                {box.title || `Título ${index + 1}`}
              </h3>
              <p className="text-center text-base text-gray-600">
                {box.contentText || `Descripción ${index + 1}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SinFoto04;
