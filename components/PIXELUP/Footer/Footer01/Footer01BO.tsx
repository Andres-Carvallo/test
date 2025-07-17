"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { toast } from "react-hot-toast";
import { useLogo } from "@/context/LogoContext";
import FooterPreview from "../FooterPreview";
import RedesSociales from "@/components/Core/RedesSociales/RedesSociales";
import { useSocialNetworks } from "@/context/SocialNetworksContext";

interface FooterConfig {
  // Configuración general
  title: string;
  description: string;
  copyrightText: string;

  // Configuración de plantilla
  selectedTemplate: string;

  // Configuración de secciones
  showLogo: boolean;
  showMenuLinks: boolean; // Enlaces del menú principal
  showLinks: boolean; // Enlaces personalizados
  showCollections: boolean;
  showSocial: boolean;
  showDescription: boolean;

  // Configuración de estilo
  backgroundColor: string;
  textColor: string;
  accentColor: string;

  // Configuración de enlaces personalizados
  customLinks: {
    title: string;
    url: string;
    enabled: boolean;
  }[];
}

const defaultConfig: FooterConfig = {
  title: "Footer",
  description: "Descripción del footer",
  copyrightText: `© ${new Date().getFullYear()} ${
    process.env.NEXT_PUBLIC_NOMBRE_TIENDA || "Mi Tienda"
  } | Todos los derechos reservados.`,

  selectedTemplate: "Footer01",

  showLogo: true,
  showMenuLinks: true,
  showLinks: true,
  showCollections: true,
  showSocial: true,
  showDescription: false,

  backgroundColor: "#1f2937",
  textColor: "#ffffff",
  accentColor: "#f59e0b",

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

interface Footer01BOProps {
  planType?: "basic" | "advanced";
}

// Componente Switch reutilizable
const SectionSwitch = ({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only peer"
      disabled={disabled}
    />
    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
  </label>
);

// Componente de Header Colapsable
const CollapsibleSectionHeader = ({
  title,
  isOpen,
  onToggle,
  isEnabled = true,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  isEnabled?: boolean;
}) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    {isEnabled && (
      <button
        onClick={onToggle}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-2"
      >
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <span>{isOpen ? "Ocultar" : "Mostrar"} Configuración</span>
      </button>
    )}
  </div>
);

export default function Footer01BO({ planType = "advanced" }: Footer01BOProps) {
  const [config, setConfig] = useState<FooterConfig>(defaultConfig);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showStyleSection, setShowStyleSection] = useState(false);
  const [showSocialSection, setShowSocialSection] = useState(false);
  const [showCustomLinksSection, setShowCustomLinksSection] = useState(false);
  const [showGeneralSection, setShowGeneralSection] = useState(false);
  const { logo } = useLogo();
  const { socialNetworks: socialNetworksConfig } = useSocialNetworks();

  const isBasicPlan = planType === "basic";

  // Templates disponibles
  const templates = [
    {
      id: "Footer01",
      name: "Clásico",
      description: "Diseño tradicional con logo, enlaces y redes sociales",
      image: "/components/PIXELUP/Footer/Footer01/Footer01.png",
    },
    {
      id: "Footer02",
      name: "Moderno",
      description: "Diseño moderno con layout más espacioso",
      image: "/components/PIXELUP/Footer/Footer02/Footer02.png",
    },
    {
      id: "Footer03",
      name: "Minimalista",
      description: "Diseño limpio y minimalista",
      image: "/components/PIXELUP/Footer/Footer03/Footer03.png",
    },
    {
      id: "Footer04",
      name: "Descriptivo",
      description: "Diseño con descripción prominente",
      image: "/components/PIXELUP/Footer/Footer04/Footer01.png",
    },
  ];

  // Las redes sociales ahora se obtienen del contexto automáticamente

  // Cargar configuración del footer
  const fetchFooterConfig = async () => {
    try {
      setLoading(true);
      const contentBlockId =
        process.env.NEXT_PUBLIC_FOOTER_CONFIG_CONTENTBLOCK ||
        "footer-config-default";

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );

      if (response.data.contentBlock?.contentText) {
        try {
          const savedConfig = JSON.parse(
            response.data.contentBlock.contentText
          );
          setConfig({ ...defaultConfig, ...savedConfig });
        } catch (error) {
          console.error("Error al parsear configuración del footer:", error);
          setConfig(defaultConfig);
        }
      }
    } catch (error) {
      console.error("Error al cargar configuración del footer:", error);
      setConfig(defaultConfig);
    } finally {
      setLoading(false);
    }
  };

  // Guardar configuración del footer
  const saveFooterConfig = async () => {
    try {
      setSaving(true);
      const token = getCookie("AdminTokenAuth");
      const contentBlockId =
        process.env.NEXT_PUBLIC_FOOTER_CONFIG_CONTENTBLOCK ||
        "footer-config-default";

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${contentBlockId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          title: "Configuración del Footer",
          contentText: JSON.stringify(config),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.code === 0) {
        toast.success("Configuración del footer guardada exitosamente");
        // Revalidar cache
        await fetch("/api/revalidate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: "/" }),
        });
      }
    } catch (error) {
      console.error("Error al guardar configuración del footer:", error);
      toast.error("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  // Restaurar configuración por defecto
  const resetConfig = () => {
    setConfig(defaultConfig);
    toast.success("Configuración restaurada por defecto");
  };

  // Manejar cambios en la configuración
  const handleConfigChange = (key: keyof FooterConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Manejar cambios en enlaces personalizados
  const handleCustomLinkChange = (index: number, field: string, value: any) => {
    setConfig((prev) => ({
      ...prev,
      customLinks: prev.customLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      ),
    }));
  };

  // Obtener el template seleccionado
  const selectedTemplate =
    templates.find((t) => t.id === config.selectedTemplate) || templates[0];

  useEffect(() => {
    fetchFooterConfig();
    // Las redes sociales se cargan automáticamente desde el contexto
  }, []);

  // Todas las secciones siempre inician cerradas - expansión solo manual

  // Crear configuración para el preview que incluye las redes sociales sincronizadas
  const configWithSocialNetworks = {
    ...config,
    socialNetworks: socialNetworksConfig,
    // Datos de ejemplo para el preview
    collections: [
      { id: 1, title: "Nuevos Arrivals", slug: "nuevos-arrivals" },
      { id: 2, title: "Colección Verano", slug: "coleccion-verano" },
      { id: 3, title: "Ofertas Especiales", slug: "ofertas-especiales" },
      { id: 4, title: "Edición Limitada", slug: "edicion-limitada" },
    ],
    menuItems: [
      { title: "Nosotros", path: "/nosotros" },
      { title: "Contacto", path: "/contacto" },
      { title: "Blog", path: "/blog" },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vista previa del footer */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">
          Vista Previa del Footer - {selectedTemplate.name}
        </h3>
        <FooterPreview
          config={configWithSocialNetworks}
          selectedTemplate={config.selectedTemplate}
        />
      </div>

      {/* Secciones Visibles - PRIMERA SECCIÓN */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-6">Secciones Visibles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Logo */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="font-medium">Logo</span>
            </div>
            <SectionSwitch
              checked={config.showLogo}
              onChange={(checked) => handleConfigChange("showLogo", checked)}
            />
          </div>

          {/* Enlaces del Menú */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </div>
              <div>
                <span className="font-medium">Enlaces del Menú</span>
                <p className="text-xs text-gray-500">
                  Automático - Sin configuración adicional
                </p>
              </div>
            </div>
            <SectionSwitch
              checked={config.showMenuLinks}
              onChange={(checked) =>
                handleConfigChange("showMenuLinks", checked)
              }
            />
          </div>

          {/* Enlaces Personalizados */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <span className="font-medium">
                Enlaces Personalizados
                {isBasicPlan && (
                  <span className="text-xs text-gray-400 ml-1">(Pro)</span>
                )}
              </span>
            </div>
            <SectionSwitch
              checked={config.showLinks}
              onChange={(checked) => handleConfigChange("showLinks", checked)}
              disabled={isBasicPlan}
            />
          </div>

          {/* Colecciones */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <span className="font-medium">Colecciones</span>
            </div>
            <SectionSwitch
              checked={config.showCollections}
              onChange={(checked) =>
                handleConfigChange("showCollections", checked)
              }
            />
          </div>

          {/* Redes Sociales */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-pink-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V1a1 1 0 011-1h2a1 1 0 011 1v18a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h2a1 1 0 011 1v3m0 0v11"
                  />
                </svg>
              </div>
              <span className="font-medium">Redes Sociales</span>
            </div>
            <SectionSwitch
              checked={config.showSocial}
              onChange={(checked) => handleConfigChange("showSocial", checked)}
            />
          </div>

          {/* Descripción */}
          <div className="flex items-center justify-between p-3 border rounded-lg bg-white">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span className="font-medium">Descripción</span>
            </div>
            <SectionSwitch
              checked={config.showDescription}
              onChange={(checked) =>
                handleConfigChange("showDescription", checked)
              }
            />
          </div>
        </div>
        {isBasicPlan && (
          <p className="text-xs text-gray-500 mt-4 text-center">
            ⭐ Plan Básico: Solo puedes configurar Logo, Enlaces del Menú,
            Colecciones, Redes Sociales y Descripción
          </p>
        )}
      </div>

      {/* Configuración de Colores y Plantilla */}
      <div className="border rounded-lg p-4">
        <CollapsibleSectionHeader
          title="Estilo y Plantilla"
          isOpen={showStyleSection}
          onToggle={() => setShowStyleSection(!showStyleSection)}
        />

        {showStyleSection && (
          <>
            <div className="flex items-center justify-between mb-4">
              {!isBasicPlan && (
                <button
                  onClick={() => setShowTemplateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2 ml-auto"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                  <span>Cambiar Plantilla</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Color de Fondo
                </label>
                <input
                  type="color"
                  value={config.backgroundColor}
                  onChange={(e) =>
                    handleConfigChange("backgroundColor", e.target.value)
                  }
                  className="w-full h-10 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Color de Texto
                </label>
                <input
                  type="color"
                  value={config.textColor}
                  onChange={(e) =>
                    handleConfigChange("textColor", e.target.value)
                  }
                  className="w-full h-10 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Color de Acento
                </label>
                <input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) =>
                    handleConfigChange("accentColor", e.target.value)
                  }
                  className="w-full h-10 border rounded-md"
                />
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      selectedTemplate.id === "Footer01"
                        ? "#10b981"
                        : "#6b7280",
                  }}
                ></div>
                <span className="text-sm font-medium">
                  Plantilla actual: {selectedTemplate.name}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {selectedTemplate.description}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Configuración General */}
      <div className="border rounded-lg p-4">
        <CollapsibleSectionHeader
          title="Configuración General"
          isOpen={showGeneralSection}
          onToggle={() => setShowGeneralSection(!showGeneralSection)}
        />

        {showGeneralSection && (
          <div className="max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">
                Descripción
              </label>
              <textarea
                value={config.description}
                onChange={(e) =>
                  handleConfigChange("description", e.target.value)
                }
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
                placeholder="Descripción que aparecerá en el footer..."
              />
              <p className="text-xs text-gray-500 mt-2">
                Esta descripción aparecerá junto con el logo cuando esté
                activada. En la plantilla Footer04 aparece como sección
                separada.
                {isBasicPlan && " Disponible en todos los planes."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Redes Sociales - Solo visible si está activado */}
      {config.showSocial && (
        <div className="border rounded-lg p-4">
          <CollapsibleSectionHeader
            title="Configuración de Redes Sociales"
            isOpen={showSocialSection}
            onToggle={() => setShowSocialSection(!showSocialSection)}
          />

          {showSocialSection && (
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-4">
                Configura las redes sociales que aparecerán en tu footer. Esta
                configuración se sincroniza automáticamente con toda la tienda.
              </p>
              <RedesSociales />
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  💡 Los cambios en las redes sociales se aplicarán
                  automáticamente al footer y otros componentes de la tienda.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enlaces Personalizados - Solo visible si está activado y es plan avanzado */}
      {config.showLinks && !isBasicPlan && (
        <div className="border rounded-lg p-4">
          <CollapsibleSectionHeader
            title="Enlaces Personalizados"
            isOpen={showCustomLinksSection}
            onToggle={() => setShowCustomLinksSection(!showCustomLinksSection)}
          />

          {showCustomLinksSection && (
            <div className="space-y-4">
              {config.customLinks.map((link, index) => (
                <div
                  key={index}
                  className="border rounded p-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={link.enabled}
                        onChange={(e) =>
                          handleCustomLinkChange(
                            index,
                            "enabled",
                            e.target.checked
                          )
                        }
                        className="rounded"
                      />
                      <span className="text-sm font-medium">Habilitado</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Título del enlace"
                      value={link.title}
                      onChange={(e) =>
                        handleCustomLinkChange(index, "title", e.target.value)
                      }
                      className="px-3 py-2 border rounded-md text-sm"
                    />
                    <input
                      type="url"
                      placeholder="URL del enlace"
                      value={link.url}
                      onChange={(e) =>
                        handleCustomLinkChange(index, "url", e.target.value)
                      }
                      className="px-3 py-2 border rounded-md text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de Selección de Plantilla */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold">
                Seleccionar Plantilla del Footer
              </h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      config.selectedTemplate === template.id
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                    onClick={() => {
                      handleConfigChange("selectedTemplate", template.id);
                      setShowTemplateModal(false);
                      toast.success(
                        `Plantilla "${template.name}" seleccionada`
                      );
                    }}
                  >
                    <div className="aspect-video bg-gray-100 rounded mb-3 flex items-center justify-center overflow-hidden">
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'%3E%3Crect width='400' height='225' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='Arial' font-size='14'%3E" +
                            template.name +
                            "%3C/text%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{template.name}</h4>
                      {config.selectedTemplate === template.id && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {template.description}
                    </p>
                    {config.selectedTemplate === template.id ? (
                      <div className="w-full py-2 px-4 bg-blue-600 text-white rounded-md text-center text-sm font-medium">
                        Seleccionado
                      </div>
                    ) : (
                      <div className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md text-center text-sm font-medium hover:bg-gray-50">
                        Seleccionar
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botones de Acción */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={resetConfig}
          className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Restaurar por Defecto
        </button>
        <button
          onClick={saveFooterConfig}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? "Guardando..." : "Guardar Configuración"}
        </button>
      </div>
    </div>
  );
}
