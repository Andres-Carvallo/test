/* eslint-disable @next/next/no-img-element */

"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import { useAPI } from "@/app/Context/ProductTypeContext";
import Loader from "@/components/common/Loader";
import ProductCard from "@/components/PIXELUP/ProductCards/ProductCards01/ProductCard01";
import Link from "next/link";

interface BannerColeccion01BOProps {
  title?: string;
  text?: string;
  imageUrl?: string;
  previewImageUrl?: string;
  showTexts?: boolean;
}

const BannerColeccion01: React.FC<BannerColeccion01BOProps> = ({
  title,
  text,
  imageUrl,
  previewImageUrl,
  showTexts = false,
}) => {
  return (
    <div className="relative w-full ">
      <img
        src={previewImageUrl || imageUrl}
        alt={title || "Collection banner"}
        className="w-full h-full object-cover block md:hidden"
      />
      <img
        src={imageUrl}
        alt={title || "Collection banner"}
        className="w-full h-full object-cover hidden md:block"
      />
      {showTexts && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
          {title && (
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          )}
          {text && <p className="text-lg md:text-xl">{text}</p>}
        </div>
      )}
    </div>
  );
};

export default BannerColeccion01;
