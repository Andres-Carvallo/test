import { useState, useEffect } from 'react';
import axios from 'axios';
import { useComponentId } from '@/hooks/useComponentId';
import { PIXELUPComponents, getComponentIdWithFallback } from '@/app/config/componentEnums';

interface ContactConfig {
  formTitle: string;
  submitButtonText: string;
  showContactInfo: boolean;
  contactInfoTitle: string;
  email: string;
  phone: string;
  emailLabelInfo: string;
  phoneLabelInfo: string;
}

const defaultConfig: ContactConfig = {
  formTitle: "Envíanos un mensaje",
  submitButtonText: "Enviar mensaje",
  showContactInfo: true,
  contactInfoTitle: "Información de contacto",
  email: "contacto@casarenteria.cl",
  phone: "+56 9 7533 0640",
  emailLabelInfo: "Email",
  phoneLabelInfo: "Teléfono"
};

export const useContactConfig = () => {
  const [config, setConfig] = useState<ContactConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerData, setBannerData] = useState<any | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      const bannerId = getComponentIdWithFallback('CONTACT_FORM_BANNER');

      // Obtener datos del banner base
      const bannerResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/banners/${bannerId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          cache: "no-store",
          next: { revalidate: 0 },
        }
      );

      if (!bannerResponse.ok) {
        throw new Error(`Error en la petición del banner: ${bannerResponse.status}`);
      }

      const responseData = await bannerResponse.json();
      console.log("Respuesta de la API del banner:", responseData);

      // Verificar que la respuesta tenga la estructura esperada
      if (!responseData || !responseData.banner) {
        throw new Error("La estructura de datos del banner no es válida");
      }

      // Configuración por defecto
      let configData: ContactConfig = defaultConfig;

      // Intentar extraer la configuración del JSON en landingText de la imagen del banner
      try {
        if (
          responseData.banner.images &&
          responseData.banner.images[0] &&
          responseData.banner.images[0].landingText &&
          responseData.banner.images[0].landingText.trim().startsWith("{")
        ) {
          const parsedConfig = JSON.parse(responseData.banner.images[0].landingText);
          if (parsedConfig && typeof parsedConfig === "object") {
            // Usar la configuración guardada
            configData = parsedConfig;
            console.log("Configuración extraída:", configData);
          }
        }
      } catch (error) {
        console.error("Error al parsear la configuración JSON:", error);
      }

      // Establecer los datos del banner y la configuración
      setBannerData(responseData);
      setConfig(configData);
    } catch (error) {
      console.error("Error al obtener los datos del banner:", error);
      setError("Error al cargar la configuración del formulario de contacto");
      // Usar configuración por defecto si hay error
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return { 
    config, 
    loading, 
    error,
    bannerData,
    refetch: fetchConfig 
  };
};
