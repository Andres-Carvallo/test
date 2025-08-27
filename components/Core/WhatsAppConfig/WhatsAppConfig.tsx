"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";
import { getComponentIdByEnvironment, PIXELUPComponents } from "@/app/config/componentEnums";

interface WhatsAppConfig {
  isActive: boolean;
  phoneNumber: string;
  message: string;
}

const WhatsAppConfig: React.FC = () => {
  const [config, setConfig] = useState<WhatsAppConfig>({
    isActive: false,
    phoneNumber: "",
    message: "",
  });
  const [originalConfig, setOriginalConfig] = useState<WhatsAppConfig>({
    isActive: false,
    phoneNumber: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const contentBlockId = getComponentIdByEnvironment(PIXELUPComponents.WHATSAPP_CONFIG);

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
          setOriginalConfig(savedConfig);
        } catch (error) {
          console.error("Error al parsear configuración de WhatsApp:", error);
          // Usar configuración por defecto si hay error
          const defaultConfig = {
            isActive: false,
            phoneNumber: "",
            message: "",
          };
          setConfig(defaultConfig);
          setOriginalConfig(defaultConfig);
        }
      }
    } catch (error) {
      console.error("Error al cargar configuración de WhatsApp:", error);
      setError("Error al cargar la configuración");
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async (configToSave: WhatsAppConfig, isAutoSave: boolean = false) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const token = getCookie("AdminTokenAuth");
      
      // Validar número de teléfono solo si está activo
      if (configToSave.isActive && !configToSave.phoneNumber.trim()) {
        setError("El número de teléfono es requerido cuando WhatsApp está activo");
        return;
      }

      // Formatear número de teléfono (remover espacios y caracteres especiales)
      const formattedPhone = configToSave.phoneNumber.replace(/\s+/g, "").replace(/[^\d+]/g, "");

      const finalConfig = {
        ...configToSave,
        phoneNumber: formattedPhone,
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          title: "Configuración de WhatsApp",
          contentText: JSON.stringify(finalConfig, null, 2),
          type: "whatsapp-config",
          isActive: finalConfig.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setOriginalConfig(finalConfig);
      setHasUnsavedChanges(false);
      setSuccess(true);
      
      // Mostrar toast para auto-save
      if (isAutoSave) {
        toast.success("WhatsApp desactivado y guardado automáticamente");
      } else {
        // Solo mostrar mensaje de éxito si no es auto-save
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error al guardar configuración de WhatsApp:", error);
      setError("Error al guardar la configuración");
      
      // Mostrar toast de error
      if (isAutoSave) {
        toast.error("Error al desactivar WhatsApp");
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  // Detectar cambios no guardados
  useEffect(() => {
    const hasChanges = JSON.stringify(config) !== JSON.stringify(originalConfig);
    setHasUnsavedChanges(hasChanges);
  }, [config, originalConfig]);

  const handleToggleChange = async (newIsActive: boolean) => {
    const newConfig = {
      ...config,
      isActive: newIsActive,
    };
    
    setConfig(newConfig);

    // Si se está desactivando, guardar automáticamente
    if (!newIsActive) {
      // Usar el nuevo valor directamente en lugar de depender del estado
      await saveConfig(newConfig, true);
    }
    // Si se está activando, no guardar automáticamente (esperar al botón)
  };

  const handleInputChange = (field: keyof WhatsAppConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveButton = async () => {
    await saveConfig(config, false);
  };

  const generateWhatsAppLink = () => {
    if (!config.phoneNumber || !config.isActive) return "";
    
    const phone = config.phoneNumber.replace(/\s+/g, "").replace(/[^\d+]/g, "");
    const message = encodeURIComponent(config.message || "Hola, necesito información");
    return `https://wa.me/${phone}?text=${message}`;
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Configuración de WhatsApp
      </h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between min-h-[2rem]">
                <label className="text-lg font-medium text-gray-700">
                  Activar botón de WhatsApp
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.isActive}
                    onChange={(e) => handleToggleChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {config.isActive && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="space-y-4">
                {/* Número de teléfono */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Número de teléfono
                  </label>
                  <input
                    type="text"
                    value={config.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="+56912345678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formato: +56912345678 (incluir código de país)
                  </p>
                </div>

                {/* Mensaje personalizado */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Mensaje personalizado
                  </label>
                  <textarea
                    value={config.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Hola, necesito información sobre sus productos..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Mensaje que aparecerá cuando el usuario haga clic en el botón
                  </p>
                </div>

                {/* Mensajes de error y éxito */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    Configuración guardada exitosamente
                  </div>
                )}

                {/* Indicador de cambios no guardados */}
                {hasUnsavedChanges && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
                    Tienes cambios sin guardar
                  </div>
                )}

                {/* Botón de guardar */}
                <div className="mt-4 flex justify-center w-full">
                  <button
                    onClick={handleSaveButton}
                    disabled={saving || !hasUnsavedChanges}
                    className="w-full max-w-md px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
                  >
                    {saving ? (
                      <>
                        <svg
                          aria-hidden="true"
                          role="status"
                          className="inline w-4 h-4 me-3 animate-spin"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="#E5E7EB"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentColor"
                          />
                        </svg>
                        Guardando...
                      </>
                    ) : (
                      "Guardar configuración de WhatsApp"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WhatsAppConfig;
