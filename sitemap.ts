import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://fbmjoyas.cl";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${siteUrl}/tienda`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
