"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface FooterConfig {
  title: string;
  description: string;
  copyrightText: string;
  selectedTemplate: string;
  showLogo: boolean;
  showMenuLinks: boolean; // Enlaces del menú principal
  showLinks: boolean; // Enlaces personalizados
  showCollections: boolean;
  showSocial: boolean;
  showNewsletter: boolean;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  newsletterTitle: string;
  newsletterDescription: string;
  newsletterPlaceholder: string;
  customLinks: {
    title: string;
    url: string;
    enabled: boolean;
  }[];
  // Nuevos campos para imagen de fondo
  landingText: string;
  // Redes sociales se cargan dinámicamente desde el componente RedesSociales
  socialNetworks?: any[];
}

interface FooterDisplayConfig {
  backgroundImage: {
    enabled: boolean;
    url: string;
    overlay: {
      enabled: boolean;
      color: string;
      opacity: number;
    };
  };
}

const defaultConfig: FooterConfig = {
  title: "Footer",
  description: "Descripción del footer",
  copyrightText: `© ${new Date().getFullYear()} ${
    process.env.NEXT_PUBLIC_NOMBRE_TIENDA
  } | Todos los derechos reservados.`,
  selectedTemplate: "Footer01",
  showLogo: true,
  showMenuLinks: true,
  showLinks: true,
  showCollections: true,
  showSocial: true,
  showNewsletter: false,
  backgroundColor: "#1f2937",
  textColor: "#ffffff",
  accentColor: "#f59e0b",
  newsletterTitle: "Suscríbete a nuestro newsletter",
  newsletterDescription: "Recibe las últimas novedades y ofertas",
  newsletterPlaceholder: "Tu email",
  landingText: JSON.stringify({
    backgroundImage: {
      enabled: false,
      url: "",
      overlay: {
        enabled: true,
        color: "#000000",
        opacity: 0.7,
      },
    },
  }),
  customLinks: [
    {
      title: "Política de Privacidad",
      url: "/politica-privacidad",
      enabled: true,
    },
    {
      title: "Términos y Condiciones",
      url: "/terminos-condiciones",
      enabled: true,
    },
    { title: "Política de Devoluciones", url: "/devoluciones", enabled: true },
  ],
};

export function useFooterConfig() {
  const [config, setConfig] = useState<FooterConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displayConfig, setDisplayConfig] = useState<FooterDisplayConfig>({
    backgroundImage: {
      enabled: false,
      url: "",
      overlay: {
        enabled: true,
        color: "#000000",
        opacity: 0.7,
      },
    },
  });
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  // Función para parsear displayConfig desde landingText
  const parseFooterDisplayConfig = (
    landingText: string
  ): FooterDisplayConfig => {
    try {
      if (!landingText || landingText.trim() === "") {
        return {
          backgroundImage: {
            enabled: false,
            url: "",
            overlay: {
              enabled: true,
              color: "#000000",
              opacity: 0.7,
            },
          },
        };
      }

      const parsed = JSON.parse(landingText);
      return {
        backgroundImage: {
          enabled: parsed.backgroundImage?.enabled ?? false,
          url: parsed.backgroundImage?.url ?? "",
          overlay: {
            enabled: parsed.backgroundImage?.overlay?.enabled ?? true,
            color: parsed.backgroundImage?.overlay?.color ?? "#000000",
            opacity: parsed.backgroundImage?.overlay?.opacity ?? 0.7,
          },
        },
      };
    } catch (error) {
      console.error("Error al parsear displayConfig:", error);
      return {
        backgroundImage: {
          enabled: false,
          url: "",
          overlay: {
            enabled: true,
            color: "#000000",
            opacity: 0.7,
          },
        },
      };
    }
  };

  // Función para cargar imagen del banner del footer
  const fetchFooterBanner = async () => {
    try {
      const bannerId = process.env.NEXT_PUBLIC_FOOTER_BANNER_ID;

      if (!bannerId) {
        console.log("📝 Variable NEXT_PUBLIC_FOOTER_BANNER_ID no configurada");
        return null;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      // Seguir la misma estructura que BannerPrincipal01.tsx
      if (
        response.data?.banner?.images &&
        response.data.banner.images.length > 0
      ) {
        // Tomar la primera imagen del banner
        const firstImage = response.data.banner.images[0];
        if (firstImage?.mainImage?.url) {
          const imageUrl = firstImage.mainImage.url;
          setBannerImage(imageUrl);
          return imageUrl;
        }
      }
      return null;
    } catch (error) {
      console.error("Error al cargar imagen del banner del footer:", error);
      return null;
    }
  };

  // Cargar configuración de redes sociales
  const fetchSocialNetworksConfig = async () => {
    try {
      const contentBlockId =
        process.env.NEXT_PUBLIC_REDESSOCIALES_CONTENTBLOCK || "REDESSOCIALES";

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      if (response.data.contentBlock?.contentText) {
        const savedNetworks = JSON.parse(
          response.data.contentBlock.contentText
        );
        return savedNetworks;
      }
      return [];
    } catch (error) {
      console.error("Error cargando configuración de redes sociales:", error);
      return [];
    }
  };

  // Cargar configuración del footer
  const fetchFooterConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      const contentBlockId =
        process.env.NEXT_PUBLIC_FOOTER_CONFIG_CONTENTBLOCK ||
        "footer-config-default";

      // Cargar configuración del footer, redes sociales e imagen en paralelo
      const [footerResponse, socialNetworks, bannerImageUrl] =
        await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
          ),
          fetchSocialNetworksConfig(),
          fetchFooterBanner(),
        ]);

      let footerConfig = defaultConfig;

      if (footerResponse.data.contentBlock?.contentText) {
        try {
          const savedConfig = JSON.parse(
            footerResponse.data.contentBlock.contentText
          );
          footerConfig = { ...defaultConfig, ...savedConfig };
        } catch (error) {
          console.error("Error al parsear configuración del footer:", error);
        }
      }

      // Parsear displayConfig desde landingText
      const parsedDisplayConfig = parseFooterDisplayConfig(
        footerConfig.landingText
      );

      console.log("🔍 Footer Debug - footerConfig:", footerConfig);
      console.log("🔍 Footer Debug - landingText:", footerConfig.landingText);
      console.log(
        "🔍 Footer Debug - parsedDisplayConfig:",
        parsedDisplayConfig
      );

      // Si hay imagen del banner, actualizar la URL en displayConfig
      if (bannerImageUrl && parsedDisplayConfig.backgroundImage.enabled) {
        parsedDisplayConfig.backgroundImage.url = bannerImageUrl;
      }

      setDisplayConfig(parsedDisplayConfig);

      // Combinar configuración del footer con redes sociales
      const combinedConfig = {
        ...footerConfig,
        socialNetworks: socialNetworks,
      };

      setConfig(combinedConfig);
    } catch (error) {
      console.error("Error al cargar configuración del footer:", error);
      setError("Error al cargar la configuración del footer");
      setConfig({
        ...defaultConfig,
        socialNetworks: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFooterConfig();
  }, []);

  // Función para refrescar la configuración
  const refreshConfig = () => {
    fetchFooterConfig();
  };

  return {
    config,
    displayConfig,
    bannerImage,
    loading,
    error,
    refreshConfig,
  };
}
