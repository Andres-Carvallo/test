"use client";
import React from "react";
import { useLogo } from "@/context/LogoContext";

interface FooterPreviewProps {
  config: any;
  selectedTemplate: string;
}

// Componente de vista previa para Footer01 (Clásico)
const Footer01Preview = ({ config, logo }: { config: any; logo: any }) => (
  <div className="p-6">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Logo y Descripción */}
      {(config.showLogo || config.showDescription) && (
        <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
          {config.showLogo && (
            <img
              alt={process.env.NEXT_PUBLIC_NOMBRE_TIENDA}
              className="h-20 object-contain max-w-[150px]"
              src={logo?.mainImage?.url || process.env.NEXT_PUBLIC_LOGO_COLOR}
            />
          )}
          {config.showDescription && config.description && (
            <p
              className="mt-4 text-sm"
              style={{ color: config.textColor }}
            >
              {config.description}
            </p>
          )}
        </div>
      )}

      {/* Contenido */}
      <div
        className={`lg:col-span-${
          config.showLogo || config.showDescription ? "8" : "12"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Enlaces del Menú Principal */}
          {config.showMenuLinks && config.menuItems && (
            <div className="text-center sm:text-left">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: config.textColor }}
              >
                Navegación
              </h3>
              <ul className="space-y-2">
                {config.menuItems.map((item: any, index: number) => (
                  <li key={index}>
                    <a
                      href={item.path}
                      className="text-sm hover:underline block"
                      style={{ color: config.textColor }}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Enlaces Personalizados */}
          {config.showLinks && config.customLinks && (
            <div className="text-center sm:text-left">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: config.textColor }}
              >
                Enlaces
              </h3>
              <ul className="space-y-2">
                {config.customLinks
                  .filter((link: any) => link.enabled)
                  .map((link: any, index: number) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        className="text-sm hover:underline block"
                        style={{ color: config.textColor }}
                      >
                        {link.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Colecciones */}
          {config.showCollections && config.collections && (
            <div className="text-center sm:text-left">
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: config.textColor }}
              >
                Colecciones
              </h3>
              <ul className="space-y-2">
                {config.collections
                  .slice(0, 4)
                  .map((collection: any, index: number) => (
                    <li key={index}>
                      <a
                        href={`/tienda/colecciones/${collection.slug}`}
                        className="text-sm hover:underline block"
                        style={{ color: config.textColor }}
                      >
                        {collection.title}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Redes Sociales */}
          {config.showSocial &&
            config.socialNetworks &&
            config.socialNetworks.some((network: any) => network.enabled) && (
              <div className="text-center sm:text-left">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: config.textColor }}
                >
                  Síguenos
                </h3>
                <ul className="space-y-2">
                  {config.socialNetworks
                    .filter((network: any) => network.enabled)
                    .map((network: any, index: number) => (
                      <li key={index}>
                        <a
                          href={network.url}
                          className="text-sm hover:underline flex items-center justify-center sm:justify-start"
                          style={{ color: config.accentColor }}
                        >
                          <span className="mr-2">●</span>
                          {network.name}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </div>

    {/* Copyright */}
    <div className="mt-8 pt-6 border-t border-gray-600">
      <p
        className="text-xs text-center"
        style={{ color: config.textColor }}
      >
        © {new Date().getFullYear()}{" "}
        {process.env.NEXT_PUBLIC_NOMBRE_TIENDA || "Mi Tienda"} | Todos los
        derechos reservados.
      </p>
    </div>
  </div>
);

// Componente de vista previa para Footer02 (Moderno)
const Footer02Preview = ({ config, logo }: { config: any; logo: any }) => (
  <div className="p-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Logo y Descripción */}
        {(config.showLogo || config.showDescription) && (
          <div className="lg:col-span-4">
            {config.showLogo && (
              <img
                alt={process.env.NEXT_PUBLIC_NOMBRE_TIENDA}
                className="h-16 object-contain mb-4"
                src={logo?.mainImage?.url || process.env.NEXT_PUBLIC_LOGO_COLOR}
              />
            )}
            {config.showDescription && config.description && (
              <p
                className="text-sm leading-relaxed mb-6"
                style={{ color: config.textColor }}
              >
                {config.description}
              </p>
            )}
          </div>
        )}

        {/* Contenido principal */}
        <div
          className={`lg:col-span-${
            config.showLogo || config.showDescription ? "8" : "12"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Enlaces del Menú Principal */}
            {config.showMenuLinks && config.menuItems && (
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: config.textColor }}
                >
                  Navegación
                </h3>
                <ul className="space-y-2">
                  {config.menuItems.map((item: any, index: number) => (
                    <li key={index}>
                      <a
                        href={item.path}
                        className="text-sm hover:underline transition-colors block"
                        style={{ color: config.textColor }}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Enlaces Personalizados */}
            {config.showLinks && config.customLinks && (
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: config.textColor }}
                >
                  Enlaces Útiles
                </h3>
                <ul className="space-y-2">
                  {config.customLinks
                    .filter((link: any) => link.enabled)
                    .map((link: any, index: number) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          className="text-sm hover:underline transition-colors block"
                          style={{ color: config.textColor }}
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Colecciones */}
            {config.showCollections && config.collections && (
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ color: config.textColor }}
                >
                  Colecciones
                </h3>
                <ul className="space-y-2">
                  {config.collections
                    .slice(0, 4)
                    .map((collection: any, index: number) => (
                      <li key={index}>
                        <a
                          href={`/tienda/colecciones/${collection.slug}`}
                          className="text-sm hover:underline transition-colors block"
                          style={{ color: config.textColor }}
                        >
                          {collection.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Redes Sociales */}
            {config.showSocial &&
              config.socialNetworks &&
              config.socialNetworks.some((network: any) => network.enabled) && (
                <div>
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: config.textColor }}
                  >
                    Síguenos
                  </h3>
                  <ul className="space-y-2">
                    {config.socialNetworks
                      .filter((network: any) => network.enabled)
                      .map((network: any, index: number) => (
                        <li key={index}>
                          <a
                            href={network.url}
                            className="text-sm hover:underline transition-colors flex items-center"
                            style={{ color: config.accentColor }}
                          >
                            <span className="mr-2">●</span>
                            {network.name}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 pt-6 border-t border-gray-600">
        <p
          className="text-xs text-center"
          style={{ color: config.textColor }}
        >
          © {new Date().getFullYear()}{" "}
          {process.env.NEXT_PUBLIC_NOMBRE_TIENDA || "Mi Tienda"} | Todos los
          derechos reservados.
        </p>
      </div>
    </div>
  </div>
);

// Componente de vista previa para Footer03 (Minimalista)
const Footer03Preview = ({ config, logo }: { config: any; logo: any }) => (
  <div className="p-6">
    <div className="max-w-4xl mx-auto text-center">
      {/* Logo y Descripción */}
      {(config.showLogo || config.showDescription) && (
        <div className="mb-6 text-center">
          {config.showLogo && (
            <img
              alt={process.env.NEXT_PUBLIC_NOMBRE_TIENDA}
              className="h-12 object-contain mx-auto mb-3"
              src={logo?.mainImage?.url || process.env.NEXT_PUBLIC_LOGO_COLOR}
            />
          )}
          {config.showDescription && config.description && (
            <p
              className="text-sm max-w-md mx-auto"
              style={{ color: config.textColor }}
            >
              {config.description}
            </p>
          )}
        </div>
      )}

      {/* Enlaces y redes sociales en línea */}
      <div className="mb-6">
        {/* Enlaces */}
        {config.showLinks && (
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            {config.customLinks
              .filter((link: any) => link.enabled)
              .map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  className="text-sm hover:underline"
                  style={{ color: config.textColor }}
                >
                  {link.title}
                </a>
              ))}
          </div>
        )}

        {/* Redes Sociales */}
        {config.showSocial &&
          config.socialNetworks.some((network: any) => network.enabled) && (
            <div className="flex flex-wrap justify-center gap-4">
              {config.socialNetworks
                .filter((network: any) => network.enabled)
                .map((network: any, index: number) => (
                  <a
                    key={index}
                    href={network.url}
                    className="text-sm hover:underline"
                    style={{ color: config.accentColor }}
                  >
                    {network.name}
                  </a>
                ))}
            </div>
          )}
      </div>

      {/* Copyright */}
      <div className="pt-4 border-t border-gray-600">
        <p
          className="text-xs"
          style={{ color: config.textColor }}
        >
          © {new Date().getFullYear()}{" "}
          {process.env.NEXT_PUBLIC_NOMBRE_TIENDA || "Mi Tienda"} | Todos los
          derechos reservados.
        </p>
      </div>
    </div>
  </div>
);

// Componente de vista previa para Footer04 (Descripción)
const Footer04Preview = ({ config, logo }: { config: any; logo: any }) => (
  <div className="p-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Logo */}
        {config.showLogo && (
          <div className="lg:col-span-2">
            <img
              alt={process.env.NEXT_PUBLIC_NOMBRE_TIENDA}
              className="h-16 object-contain"
              src={logo?.mainImage?.url || process.env.NEXT_PUBLIC_LOGO_COLOR}
            />
          </div>
        )}

        {/* Enlaces */}
        {config.showLinks && (
          <div className="lg:col-span-4">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3
                  className="text-sm font-bold tracking-wider uppercase mb-3"
                  style={{ color: config.textColor }}
                >
                  Enlaces
                </h3>
                <ul className="space-y-2">
                  {config.customLinks
                    .filter((link: any) => link.enabled)
                    .slice(0, Math.ceil(config.customLinks.length / 2))
                    .map((link: any, index: number) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          className="text-sm hover:underline block"
                          style={{ color: config.textColor }}
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <ul className="space-y-2 mt-8">
                  {config.customLinks
                    .filter((link: any) => link.enabled)
                    .slice(Math.ceil(config.customLinks.length / 2))
                    .map((link: any, index: number) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          className="text-sm hover:underline block"
                          style={{ color: config.textColor }}
                        >
                          {link.title}
                        </a>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Descripción prominente */}
        {config.showDescription && config.description && (
          <div className="lg:col-span-6">
            <h3
              className="text-sm font-bold tracking-wider uppercase mb-3"
              style={{ color: config.textColor }}
            >
              Sobre Nosotros
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: config.textColor }}
            >
              {config.description}
            </p>
          </div>
        )}
      </div>

      {/* Redes sociales y copyright */}
      <div className="mt-6 pt-6 border-t border-gray-600">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center">
          <p
            className="text-xs mb-3 sm:mb-0"
            style={{ color: config.textColor }}
          >
            © {new Date().getFullYear()}{" "}
            {process.env.NEXT_PUBLIC_NOMBRE_TIENDA || "Mi Tienda"} | Todos los
            derechos reservados.
          </p>

          {config.showSocial &&
            config.socialNetworks.some((network: any) => network.enabled) && (
              <div className="flex gap-4">
                {config.socialNetworks
                  .filter((network: any) => network.enabled)
                  .map((network: any, index: number) => (
                    <a
                      key={index}
                      href={network.url}
                      className="text-sm hover:underline"
                      style={{ color: config.accentColor }}
                    >
                      {network.name}
                    </a>
                  ))}
              </div>
            )}
        </div>
      </div>
    </div>
  </div>
);

export default function FooterPreview({
  config,
  selectedTemplate,
}: FooterPreviewProps) {
  const { logo } = useLogo();

  const renderPreview = () => {
    switch (selectedTemplate) {
      case "Footer01":
        return (
          <Footer01Preview
            config={config}
            logo={logo}
          />
        );
      case "Footer02":
        return (
          <Footer02Preview
            config={config}
            logo={logo}
          />
        );
      case "Footer03":
        return (
          <Footer03Preview
            config={config}
            logo={logo}
          />
        );
      case "Footer04":
        return (
          <Footer04Preview
            config={config}
            logo={logo}
          />
        );
      default:
        return (
          <Footer01Preview
            config={config}
            logo={logo}
          />
        );
    }
  };

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ backgroundColor: config.backgroundColor }}
    >
      {renderPreview()}
    </div>
  );
}
