import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import toast from "react-hot-toast";

interface InfoBoxesConfig {
  showInfoBoxes: boolean;
  boxesConfig: {
    freeShipping: boolean;
    warranty: boolean;
    returns: boolean;
  };
  warrantyText: string;
  returnsText: string;
}

interface ProductInfoBoxesConfigProps {
  value: string;
  onChange: (value: string) => void;
  freeShippingAmount?: string | null;
  isFreeShippingEnabled?: boolean;
}

const ProductInfoBoxesConfig: React.FC<ProductInfoBoxesConfigProps> = ({ 
  value, 
  onChange, 
  freeShippingAmount,
  isFreeShippingEnabled = true
}) => {
  const [config, setConfig] = useState<InfoBoxesConfig>({
    showInfoBoxes: true,
    boxesConfig: {
      freeShipping: true,
      warranty: true,
      returns: true
    },
    warrantyText: "Cobertura completa",
    returnsText: "30 días sin preguntas"
  });

  const token = getCookie("AdminTokenAuth");

  // Cargar configuración inicial
  useEffect(() => {
    if (value) {
      try {
        const parsedConfig = JSON.parse(value);
        setConfig({
          showInfoBoxes: parsedConfig.showInfoBoxes ?? true,
          boxesConfig: {
            freeShipping: parsedConfig.boxesConfig?.freeShipping ?? true,
            warranty: parsedConfig.boxesConfig?.warranty ?? true,
            returns: parsedConfig.boxesConfig?.returns ?? true
          },
          warrantyText: parsedConfig.warrantyText ?? "Cobertura completa",
          returnsText: parsedConfig.returnsText ?? "30 días sin preguntas"
        });
      } catch (error) {
        console.error("Error parsing info boxes config:", error);
        // Usar configuración por defecto si hay error
        setConfig({
          showInfoBoxes: true,
          boxesConfig: {
            freeShipping: true,
            warranty: true,
            returns: true
          },
          warrantyText: "Cobertura completa",
          returnsText: "30 días sin preguntas"
        });
      }
    }
  }, [value]);

  // Verificar el estado global del envío gratis desde la API
  useEffect(() => {
    const checkGlobalFreeShippingStatus = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/options?pageNumber=1&pageSize=50&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const option = response.data.options.find(
          (opt: any) => opt.code === "FREE_SHIPPING_MINIMUM_AMOUNT"
        );

        if (option) {
          // Si el envío gratis está desactivado globalmente, solo desactivar la caja
          // pero NO llamar a onChange para evitar sobrescribir otros datos del formulario
          if (option.value === null) {
            setConfig(prevConfig => ({
              ...prevConfig,
              boxesConfig: {
                ...prevConfig.boxesConfig,
                freeShipping: false
              }
            }));
          }
        }
      } catch (error) {
        console.error("Error checking global free shipping status:", error);
      }
    };

    checkGlobalFreeShippingStatus();
  }, []);

  const handleToggleInfoBoxes = (enabled: boolean) => {
    const updatedConfig = {
      ...config,
      showInfoBoxes: enabled
    };
    setConfig(updatedConfig);
    onChange(JSON.stringify(updatedConfig));
  };

  const handleToggleBox = (boxType: keyof typeof config.boxesConfig, enabled: boolean) => {
    // Si se intenta activar envío gratis pero está desactivado globalmente, mostrar error
    if (boxType === 'freeShipping' && enabled && !isFreeShippingEnabled) {
      toast.error("El envío gratis está desactivado en la configuración global. Actívalo primero en Zona de Repartos.");
      return;
    }

    const updatedConfig = {
      ...config,
      boxesConfig: {
        ...config.boxesConfig,
        [boxType]: enabled
      }
    };
    setConfig(updatedConfig);
    onChange(JSON.stringify(updatedConfig));
  };

  const handleTextChange = (field: 'warrantyText' | 'returnsText', value: string) => {
    const updatedConfig = {
      ...config,
      [field]: value
    };
    setConfig(updatedConfig);
    onChange(JSON.stringify(updatedConfig));
  };

  const getActiveBoxesCount = () => {
    return Object.values(config.boxesConfig).filter(Boolean).length;
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-700">
          Cajas Informativas del Producto
        </h3>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={config.showInfoBoxes}
            onChange={(e) => handleToggleInfoBoxes(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-14 h-7 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer bg-gray-200 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      {config.showInfoBoxes && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Activa o desactiva las cajas informativas que se mostrarán en la ficha del producto. 
            El espacio se distribuirá automáticamente entre las cajas activas.
          </p>

          {/* Envío Gratis */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Envío Gratis</h4>
                <p className="text-sm text-gray-500">
                  {freeShippingAmount ? `En pedidos sobre $${freeShippingAmount}` : "Configurado desde zona de repartos"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  * Este monto está sincronizado con la configuración de{" "}
                  <a 
                    href="/dashboard/zona-repartos" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Zona de Repartos
                  </a>
                </p>
                {!isFreeShippingEnabled && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ El envío gratis está desactivado globalmente. Actívalo primero en{" "}
                    <a 
                      href="/dashboard/zona-repartos" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-red-600 hover:underline font-medium"
                    >
                      Zona de Repartos
                    </a>
                  </p>
                )}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                checked={config.boxesConfig.freeShipping}
                onChange={(e) => handleToggleBox('freeShipping', e.target.checked)}
                disabled={!isFreeShippingEnabled}
                  className="sr-only peer"
                />
              <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer ${
                isFreeShippingEnabled 
                  ? 'bg-gray-200 peer-checked:bg-primary' 
                  : 'bg-gray-400 cursor-not-allowed'
              } peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
              </label>
            </div>

          {/* Garantía */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Garantía</h4>
                  <input
                    type="text"
                  value={config.warrantyText}
                  onChange={(e) => handleTextChange('warrantyText', e.target.value)}
                  placeholder="Ej: Cobertura completa"
                  className="text-sm text-gray-500 bg-white border border-gray-300 rounded px-2 py-1 w-full focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-3">
              <input
                type="checkbox"
                checked={config.boxesConfig.warranty}
                onChange={(e) => handleToggleBox('warranty', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer bg-gray-200 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
          </div>

          {/* Devoluciones */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Devoluciones</h4>
                  <input
                    type="text"
                  value={config.returnsText}
                  onChange={(e) => handleTextChange('returnsText', e.target.value)}
                  placeholder="Ej: 30 días sin preguntas"
                  className="text-sm text-gray-500 bg-white border border-gray-300 rounded px-2 py-1 w-full focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>
            <label className="relative inline-flex items-center cursor-pointer ml-3">
              <input
                type="checkbox"
                checked={config.boxesConfig.returns}
                onChange={(e) => handleToggleBox('returns', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer bg-gray-200 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          {/* Información adicional */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Cajas activas:</strong> {getActiveBoxesCount()} de 3
              {getActiveBoxesCount() > 0 && (
                <span className="block mt-1">
                  El espacio se distribuirá automáticamente entre las cajas activas.
                </span>
              )}
            </p>
          </div>
      </div>
      )}
    </div>
  );
};

export default ProductInfoBoxesConfig;
