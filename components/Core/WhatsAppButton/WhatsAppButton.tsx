"use client";
import { useWhatsAppConfig } from "@/hooks/useWhatsAppConfig";

const WhatsAppButton = () => {
  const { config, loading, generateWhatsAppLink } = useWhatsAppConfig();

  // No mostrar si está cargando o si no está activo
  if (loading || !config.isActive) return null;

  const whatsappLink = generateWhatsAppLink();
  
  // No mostrar si no hay enlace válido
  if (!whatsappLink) return null;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-6 bottom-[30px] z-50 bg-green-500 rounded-full p-3 hover:bg-green-600 transition-colors animate-pulse-whatsapp"
      style={{ zIndex: 999 }}
    >
      <img
        src="/whatsapp.svg"
        alt="WhatsApp"
        className="w-8 h-8 hover:scale-110 transition-transform duration-200"
      />
    </a>
  );
};

export default WhatsAppButton; 