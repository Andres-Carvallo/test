import { useState, useEffect } from "react";
import axios from "axios";
import { COMPONENT_IDS } from "@/app/config/componentEnums";

interface WhatsAppConfig {
  isActive: boolean;
  phoneNumber: string;
  message: string;
}

export function useWhatsAppConfig() {
  const [config, setConfig] = useState<WhatsAppConfig>({
    isActive: false,
    phoneNumber: "",
    message: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contentBlockId = COMPONENT_IDS.WHATSAPP_CONFIG();

  const fetchConfig = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      if (response.data.code === 0 && response.data.contentBlock?.contentText) {
        try {
          const savedConfig = JSON.parse(response.data.contentBlock.contentText);
          setConfig(savedConfig);
        } catch (error) {
          console.error("Error al parsear configuración de WhatsApp:", error);
          // Usar configuración por defecto si hay error
          setConfig({
            isActive: false,
            phoneNumber: "",
            message: "",
          });
        }
      }
    } catch (error) {
      console.error("Error al cargar configuración de WhatsApp:", error);
      setError("Error al cargar la configuración de WhatsApp");
    } finally {
      setLoading(false);
    }
  };

  const generateWhatsAppLink = () => {
    if (!config.phoneNumber || !config.isActive) return "";
    
    const phone = config.phoneNumber.replace(/\s+/g, "").replace(/[^\d+]/g, "");
    const message = encodeURIComponent(config.message || "Hola, necesito información");
    return `https://wa.me/${phone}?text=${message}`;
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return {
    config,
    loading,
    error,
    generateWhatsAppLink,
    refetch: fetchConfig,
  };
}
