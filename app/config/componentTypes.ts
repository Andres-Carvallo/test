/**
 * Tipos específicos para cada componente
 */

// Tipos para Banner Principal
export interface BannerPrincipalConfig {
  text: string;
  showText: boolean;
  showPrice: boolean;
  showValue: boolean;
  showButton1: boolean;
  showButton2: boolean;
  button1Text: string;
  button2Text: string;
  button1Link: string;
  button2Link: string;
  contentAlignment: "left" | "center" | "right";
  fullBannerLink: boolean;
  fullBannerLinkUrl: string;
  baseTypography: string;
  titleTypography: string;
}

// Tipos para Ubicación
export interface UbicacionConfig {
  title: string;
  contentText: string;
  additionalData: {
    subtitle: string;
    description: string;
    secondaryTitle: string;
    address: {
      street: string;
      city: string;
    };
    schedule: {
      weekdays: string;
      saturday: string;
      sunday?: string;
    };
    contact: {
      phone: string;
      email: string;
    };
  };
}

// Tipos para Servicios
export interface ServiciosConfig {
  descripcion: string;
  servicios: string[];
  tiempo: string;
  precio: string;
  destacada: boolean;
}

// Tipos para Categorías
export interface CategoriaConfig {
  title: string;
  mainText: string;
  bookText: string;
  buttonText: string;
  buttonText2: string;
  buttonLink: string;
  buttonLink2: string;
}

// Tipos para Galería
export interface GaleriaConfig {
  mainTitle: string;
  mainDescription: string;
  features: {
    title1: string;
    description1: string;
    title2: string;
    description2: string;
  };
  buttonText: string;
}

// Tipos para Hero
export interface HeroConfig {
  content: string;
  subtitle: string;
  text2: string;
}

// Tipos para SEO
export interface SeoConfig {
  title: string;
  description: string;
  keywords: string;
  url: string;
  imageAlt?: string;
}

// Tipos base para componentes
export interface ComponentData {
  defaultData: any;
  type: 'banner' | 'contentBlock' | 'mixed';
  jsonStructure?: 'bannerPrincipal' | 'ubicacion' | 'servicios' | 'categoria' | 'galeria' | 'hero' | 'simple' | 'seo';
  needsImage?: boolean; // Indica si necesita crear una imagen hija
}
