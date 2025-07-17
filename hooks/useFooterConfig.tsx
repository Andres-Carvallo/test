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
  // Redes sociales se cargan dinámicamente desde el componente RedesSociales
  socialNetworks?: any[];
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

      // Cargar configuración del footer y redes sociales en paralelo
      const [footerResponse, socialNetworks] = await Promise.all([
        axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
        ),
        fetchSocialNetworksConfig(),
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
    loading,
    error,
    refreshConfig,
  };
}
