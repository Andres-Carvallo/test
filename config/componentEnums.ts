/**
 * Sistema de Enums para Componentes
 * Los IDs se generan dinámicamente via API y se actualizan aquí
 */

// Importar utilidades de imagen
import { DEFAULT_BASE64_IMAGE } from '../utils/imageUtils';

// ========================================
// TIPOS ESPECÍFICOS PARA CADA COMPONENTE
// ========================================

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

// ========================================
// TIPOS BASE PARA COMPONENTES
// ========================================

// Re-exportar la interfaz para compatibilidad
export type { Base64Image } from '../utils/imageUtils';

export interface ComponentData {
  defaultData: any;
  type: 'banner' | 'contentBlock' | 'mixed';
  jsonStructure?: 'bannerPrincipal' | 'ubicacion' | 'servicios' | 'categoria' | 'galeria' | 'hero' | 'simple' | 'seo';
  envVariable?: string; // Variable de entorno correspondiente
  needsImage?: boolean; // Indica si necesita crear una imagen hija
  imageData?: any; // Datos por defecto para la imagen hija
  imageEnvVariable?: string; // Variable de entorno para el ID de la imagen
}

// ========================================
// ENUMS DE COMPONENTES PIXELUP
// ========================================

// ========================================
// ENUMS DE COMPONENTES (Solo referencias)
// ========================================

export enum PIXELUPComponents {
  // Banner Principal
  BANNER_PRINCIPAL_01 = 'BANNER_PRINCIPAL_01',
  BANNER_PRINCIPAL_02 = 'BANNER_PRINCIPAL_02',
  BANNER_PRINCIPAL_03 = 'BANNER_PRINCIPAL_03',
  
  // Banner About
  BANNER_ABOUT = 'BANNER_ABOUT',
  
  // Banner Tienda
  BANNER_TIENDA = 'BANNER_TIENDA',
  
  // Banner Colección
  BANNER_COLECCION = 'BANNER_COLECCION',
  
  // Categorías
  CATEGORIA_01 = 'CATEGORIA_01',
  CATEGORIA_02 = 'CATEGORIA_02',
  CATEGORIA_03 = 'CATEGORIA_03',
  CATEGORIA_04 = 'CATEGORIA_04',
  CATEGORIA_05 = 'CATEGORIA_05',
  CATEGORIA_06 = 'CATEGORIA_06',
  CATEGORIA_07 = 'CATEGORIA_07',
  CATEGORIA_08 = 'CATEGORIA_08',
  CATEGORIA_09 = 'CATEGORIA_09',
  CATEGORIA_10 = 'CATEGORIA_10',
  
  // Galerías
  GALERIA_01 = 'GALERIA_01',
  GALERIA_02 = 'GALERIA_02',
  
  // Ubicación
  UBICACION = 'UBICACION',
  UBICACION_02 = 'UBICACION_02',
  UBICACION_03 = 'UBICACION_03',
  UBICACION_04 = 'UBICACION_04',
  UBICACION_05 = 'UBICACION_05',
  MODAL_UBICACION_04 = 'MODAL_UBICACION_04',
  
  // Blog
  BLOG_HOME = 'BLOG_HOME',
  BANNER_BLOG = 'BANNER_BLOG',
  
  // Parallax
  PARALLAX = 'PARALLAX',
  
  // Frases
  FRASE_01 = 'FRASE_01',
  
  // About
  ABOUT_ME_CONTENT = 'ABOUT_ME_CONTENT',
  
  // Navbar
  NAVBAR_BANNER = 'NAVBAR_BANNER',
  
  // Nosotros
  NOSOTROS_01 = 'NOSOTROS_01',
  
  // Servicios
  LISTA_SERVICIOS_01 = 'LISTA_SERVICIOS_01',
  LISTA_SERVICIOS_02 = 'LISTA_SERVICIOS_02',
  LISTA_SERVICIOS_03 = 'LISTA_SERVICIOS_03',
  LISTA_SERVICIOS_04 = 'LISTA_SERVICIOS_04',
  
  // Sin Foto
  SINFOTO_01 = 'SINFOTO_01',
  SINFOTO_02 = 'SINFOTO_02',
  SINFOTO_04 = 'SINFOTO_04',
  SINFOTO_05 = 'SINFOTO_05',
  
  // Cards
  CARD_01 = 'CARD_01',
  CARD_02 = 'CARD_02',
  CARD_03 = 'CARD_03',
  CARD_04 = 'CARD_04',
  
  // SEO
  SEO_BANNER = 'SEO_BANNER',
  SEO_BANNER_IMG = 'SEO_BANNER_IMG',

  // Footer
  FOOTER_BANNER = 'FOOTER_BANNER',
  
  // Logo Edit
  LOGO_EDIT = 'LOGO_EDIT',
}

// ========================================
// ENUMS DE COMPONENTES CORE
// ========================================

export enum CoreComponents {
  // Popup
  POPUP_BANNER = 'POPUP_BANNER',
  POPUP_CONTENTBLOCK = 'POPUP_CONTENTBLOCK',
}

// ========================================
// CONFIGURACIÓN DE DATOS POR DEFECTO
// ========================================

export const PIXELUP_COMPONENT_DATA: Record<PIXELUPComponents, ComponentData> = {
  // SEO - Componente principal con imagen hija
  [PIXELUPComponents.SEO_BANNER]: {
    type: 'banner',
    jsonStructure: 'seo',
    envVariable: 'NEXT_PUBLIC_SEO_BANNER_ID',
    needsImage: true,
    imageEnvVariable: 'NEXT_PUBLIC_SEO_BANNER_IMGID',
    defaultData: {
      title: 'Optimización SEO - PixelUp',
      landingText: 'Optimización para buscadores',
      buttonText: 'Más información',
      buttonLink: '/seo',
      mainImageLink: 'https://pixelup.cl/default-seo.jpg',
      mainImage: {
        name: "pixelup-seo-banner.png",
        type: "image/png",
        size: 95,
        data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      }
    },
    imageData: {
      title: 'Imagen SEO - PixelUp',
      landingText: 'Optimización para buscadores',
      buttonText: 'Más información',
      buttonLink: '/seo',
      mainImageLink: 'https://pixelup.cl/default-seo.jpg',
      orderNumber: 1,
      mainImage: {
        name: "pixelup-seo-image.png",
        type: "image/png",
        size: 95,
        data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      }
    }
  },

  [PIXELUPComponents.SEO_BANNER_IMG]: {
    type: 'banner',
    jsonStructure: 'seo',
    envVariable: 'NEXT_PUBLIC_SEO_BANNER_IMGID',
    defaultData: {
      title: 'Imagen SEO - PixelUp',
      landingText: 'Optimización para buscadores',
      buttonText: 'Más información',
      buttonLink: '/seo',
      mainImageLink: 'https://pixelup.cl/default-seo.jpg',
      mainImage: {
        name: "pixelup-seo-image.png",
        type: "image/png",
        size: 95,
        data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      }
    }
  },

  // Banner Principal - Estructura JSON compleja
  [PIXELUPComponents.BANNER_PRINCIPAL_01]: {
    type: 'banner',
    jsonStructure: 'bannerPrincipal',
    envVariable: 'NEXT_PUBLIC_BANNERPRINCIPAL01_ID',
    defaultData: {
      title: 'Banner Principal 01',
      landingText: JSON.stringify({
        text: 'Descubre nuestra colección',
        showText: true,
        showPrice: false,
        showValue: false,
        showButton1: true,
        showButton2: false,
        button1Text: 'Ver más',
        button2Text: 'Botón 2',
        button1Link: '#',
        button2Link: '#',
        contentAlignment: 'center',
        fullBannerLink: false,
        fullBannerLinkUrl: '#',
        baseTypography: 'montserrat',
        titleTypography: 'montserrat'
      } as BannerPrincipalConfig),
      buttonText: 'Ver más',
      buttonLink: '#',
      mainImageLink: 'https://pixelup.cl/default-banner.jpg'
    }
  },
  
  [PIXELUPComponents.BANNER_PRINCIPAL_02]: {
    type: 'banner',
    jsonStructure: 'bannerPrincipal',
    envVariable: 'NEXT_PUBLIC_BANNERPRINCIPAL02_ID',
    defaultData: {
      title: 'Banner Principal 02',
      landingText: JSON.stringify({
        text: 'Nuevas tendencias',
        showText: true,
        showPrice: false,
        showValue: false,
        showButton1: true,
        showButton2: false,
        button1Text: 'Explorar',
        button2Text: 'Botón 2',
        button1Link: '#',
        button2Link: '#',
        contentAlignment: 'center',
        fullBannerLink: false,
        fullBannerLinkUrl: '#',
        baseTypography: 'montserrat',
        titleTypography: 'montserrat'
      } as BannerPrincipalConfig),
      buttonText: 'Explorar',
      buttonLink: '#',
      mainImageLink: 'https://pixelup.cl/default-banner.jpg'
    }
  },
  
  [PIXELUPComponents.BANNER_PRINCIPAL_03]: {
    type: 'banner',
    jsonStructure: 'bannerPrincipal',
    envVariable: 'NEXT_PUBLIC_BANNERPRINCIPAL03_ID',
    defaultData: {
      title: 'Banner Principal 03',
      landingText: JSON.stringify({
        text: 'Ofertas especiales',
        showText: true,
        showPrice: true,
        showValue: true,
        showButton1: true,
        showButton2: true,
        button1Text: 'Comprar ahora',
        button2Text: 'Ver detalles',
        button1Link: '#',
        button2Link: '#',
        contentAlignment: 'center',
        fullBannerLink: false,
        fullBannerLinkUrl: '#',
        baseTypography: 'montserrat',
        titleTypography: 'montserrat'
      } as BannerPrincipalConfig),
      buttonText: 'Comprar ahora',
      buttonLink: '#',
      mainImageLink: 'https://pixelup.cl/default-banner.jpg'
    }
  },
  
  // Banner About - Estructura simple
  [PIXELUPComponents.BANNER_ABOUT]: {
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_BANNER_ABOUT_ID',
    defaultData: {
      title: 'Sobre nosotros',
      landingText: 'Conoce nuestra historia',
      buttonText: 'Leer más',
      buttonLink: '/nosotros',
      mainImageLink: 'https://pixelup.cl/default-about.jpg'
    }
  },
  
  // Banner Tienda - Estructura simple
  [PIXELUPComponents.BANNER_TIENDA]: {
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_BANNER_TIENDA_ID',
    defaultData: {
      title: 'Nuestra tienda',
      landingText: 'Encuentra lo que buscas',
      buttonText: 'Ir a tienda',
      buttonLink: '/tienda',
      mainImageLink: 'https://pixelup.cl/default-store.jpg'
    }
  },
  
  // Banner Colección - Estructura simple
  [PIXELUPComponents.BANNER_COLECCION]: {
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_BANNER_COLECCION_ID',
    defaultData: {
      title: 'Nueva colección',
      landingText: 'Descubre lo último',
      buttonText: 'Ver colección',
      buttonLink: '/colecciones',
      mainImageLink: 'https://pixelup.cl/default-collection.jpg'
    }
  },
  
  // Categorías - Estructura específica para categorías
  [PIXELUPComponents.CATEGORIA_01]: {
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA01_ID',
    defaultData: {
      title: 'Categoría 01',
      landingText: JSON.stringify({
        title: 'Productos Destacados',
        mainText: 'Descubre nuestra selección especial',
        bookText: 'Reserva ahora',
        buttonText: 'Ver productos',
        buttonText2: 'Reservar',
        buttonLink: '/categoria/01',
        buttonLink2: '/reservar'
      } as CategoriaConfig),
      buttonText: 'Ver productos',
      buttonLink: '/categoria/01',
      mainImageLink: 'https://pixelup.cl/default-category.jpg'
    }
  },
  
  [PIXELUPComponents.CATEGORIA_02]: {
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA02_ID',
    defaultData: {
      title: 'Categoría 02',
      landingText: JSON.stringify({
        title: 'Productos Populares',
        mainText: 'Los más vendidos de la temporada',
        bookText: 'Comprar ahora',
        buttonText: 'Ver productos',
        buttonText2: 'Comprar',
        buttonLink: '/categoria/02',
        buttonLink2: '/comprar'
      } as CategoriaConfig),
      buttonText: 'Ver productos',
      buttonLink: '/categoria/02',
      mainImageLink: 'https://pixelup.cl/default-category.jpg'
    }
  },
  
  [PIXELUPComponents.CATEGORIA_03]: {
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA03_ID',
    defaultData: {
      title: 'Categoría 03',
      landingText: JSON.stringify({
        title: 'Productos Nuevos',
        mainText: 'Descubre las últimas novedades',
        bookText: 'Reservar ahora',
        buttonText: 'Ver productos',
        buttonText2: 'Reservar',
        buttonLink: '/categoria/03',
        buttonLink2: '/reservar'
      } as CategoriaConfig),
      buttonText: 'Ver productos',
      buttonLink: '/categoria/03',
      mainImageLink: 'https://pixelup.cl/default-category.jpg'
    }
  },
  
  [PIXELUPComponents.CATEGORIA_04]: {
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA04_ID',
    defaultData: {
      title: 'Categoría 04',
      landingText: JSON.stringify({
        title: 'Productos Exclusivos',
        mainText: 'Colección limitada y exclusiva',
        bookText: 'Comprar exclusivo',
        buttonText: 'Ver productos',
        buttonText2: 'Comprar',
        buttonLink: '/categoria/04',
        buttonLink2: '/comprar'
      } as CategoriaConfig),
      buttonText: 'Ver productos',
      buttonLink: '/categoria/04',
      mainImageLink: 'https://pixelup.cl/default-category.jpg'
    }
  },
  
  [PIXELUPComponents.CATEGORIA_05]: {
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA05_ID',
    defaultData: {
      title: 'Categoría 05',
      landingText: JSON.stringify({
        title: 'Productos Premium',
        mainText: 'La mejor calidad disponible',
        bookText: 'Reservar premium',
        buttonText: 'Ver productos',
        buttonText2: 'Reservar',
        buttonLink: '/categoria/05',
        buttonLink2: '/reservar'
      } as CategoriaConfig),
      buttonText: 'Ver productos',
      buttonLink: '/categoria/05',
      mainImageLink: 'https://pixelup.cl/default-category.jpg'
    }
  },
  
  [PIXELUPComponents.CATEGORIA_06]: {
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA06_ID',
    defaultData: {
      title: 'Categoría 06',
      landingText: JSON.stringify({
        title: 'Productos Básicos',
        mainText: 'Fundamentos esenciales',
        bookText: 'Comprar básico',
        buttonText: 'Ver productos',
        buttonText2: 'Comprar',
        buttonLink: '/categoria/06',
        buttonLink2: '/comprar'
      } as CategoriaConfig),
      buttonText: 'Ver productos',
      buttonLink: '/categoria/06',
      mainImageLink: 'https://pixelup.cl/default-category.jpg'
    }
  },
  
  [PIXELUPComponents.CATEGORIA_07]: {
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA07_ID',
    defaultData: {
      title: 'Categoría 07',
      landingText: JSON.stringify({
        title: 'Productos Especiales',
        mainText: 'Ofertas únicas y especiales',
        bookText: 'Reservar especial',
        buttonText: 'Ver productos',
        buttonText2: 'Reservar',
        buttonLink: '/categoria/07',
        buttonLink2: '/reservar'
      } as CategoriaConfig),
      buttonText: 'Ver productos',
      buttonLink: '/categoria/07',
      mainImageLink: 'https://pixelup.cl/default-category.jpg'
    }
  },
  
  [PIXELUPComponents.CATEGORIA_08]: {
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA08_ID',
    defaultData: {
      title: 'Categoría 08',
      landingText: JSON.stringify({
        title: 'Productos Únicos',
        mainText: 'Piezas únicas y exclusivas',
        bookText: 'Reservar único',
        buttonText: 'Ver productos',
        buttonText2: 'Reservar',
        buttonLink: '/categoria/08',
        buttonLink2: '/reservar'
      } as CategoriaConfig),
      buttonText: 'Ver productos',
      buttonLink: '/categoria/08',
      mainImageLink: 'https://pixelup.cl/default-category.jpg'
    }
  },
  
  [PIXELUPComponents.CATEGORIA_09]: {
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA09_ID',
    defaultData: {
      title: 'Categoría 09',
      landingText: JSON.stringify({
        title: 'Productos Limitados',
        mainText: 'Edición limitada disponible',
        bookText: 'Reservar limitado',
        buttonText: 'Ver productos',
        buttonText2: 'Reservar',
        buttonLink: '/categoria/09',
        buttonLink2: '/reservar'
      } as CategoriaConfig),
      buttonText: 'Ver productos',
      buttonLink: '/categoria/09',
      mainImageLink: 'https://pixelup.cl/default-category.jpg'
    }
  },
  
  [PIXELUPComponents.CATEGORIA_10]: {
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA10_ID',
    defaultData: {
      title: 'Categoría 10',
      landingText: JSON.stringify({
        title: 'Productos Destacados',
        mainText: 'Los mejores de la temporada',
        bookText: 'Reservar destacado',
        buttonText: 'Ver productos',
        buttonText2: 'Reservar',
        buttonLink: '/categoria/10',
        buttonLink2: '/reservar'
      } as CategoriaConfig),
      buttonText: 'Ver productos',
      buttonLink: '/categoria/10',
      mainImageLink: 'https://pixelup.cl/default-category.jpg'
    }
  },
  
  // Galerías - Estructura específica para galerías
  [PIXELUPComponents.GALERIA_01]: {
    type: 'banner',
    jsonStructure: 'galeria',
    envVariable: 'NEXT_PUBLIC_GALERIA01_ID',
    defaultData: {
      title: 'Galería 01',
      landingText: JSON.stringify({
        mainTitle: 'Nuestras Imágenes',
        mainDescription: 'Descubre nuestra colección visual',
        features: {
          title1: 'Calidad Premium',
          description1: 'Imágenes de alta resolución',
          title2: 'Diseño Profesional',
          description2: 'Creado por expertos'
        },
        buttonText: 'Ver galería'
      } as GaleriaConfig),
      buttonText: 'Ver galería',
      buttonLink: '/galeria/01',
      mainImageLink: 'https://pixelup.cl/default-gallery.jpg'
    }
  },
  
  [PIXELUPComponents.GALERIA_02]: {
    type: 'banner',
    jsonStructure: 'galeria',
    envVariable: 'NEXT_PUBLIC_GALERIA02_ID',
    defaultData: {
      title: 'Galería 02',
      landingText: JSON.stringify({
        mainTitle: 'Más Imágenes',
        mainDescription: 'Explora nuestra galería completa',
        features: {
          title1: 'Variedad',
          description1: 'Múltiples estilos y opciones',
          title2: 'Inspiración',
          description2: 'Ideas para tu proyecto'
        },
        buttonText: 'Ver galería'
      } as GaleriaConfig),
      buttonText: 'Ver galería',
      buttonLink: '/galeria/02',
      mainImageLink: 'https://pixelup.cl/default-gallery.jpg'
    }
  },
  
  // Ubicación - Estructura compleja con additionalData
  [PIXELUPComponents.UBICACION]: {
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_UBICACION_ID',
    defaultData: {
      title: 'Nuestra ubicación',
      landingText: 'Encuéntranos aquí',
      buttonText: 'Ver mapa',
      buttonLink: '/ubicacion',
      mainImageLink: 'https://pixelup.cl/default-location.jpg'
    }
  },
  
  [PIXELUPComponents.UBICACION_02]: {
    type: 'banner',
    jsonStructure: 'ubicacion',
    envVariable: 'NEXT_PUBLIC_UBICACION02_ID',
    defaultData: {
      title: 'Ubicación 02',
      landingText: JSON.stringify({
        title: 'Sucursal Principal',
        contentText: '<p>Nuestra sucursal principal está ubicada en el corazón de la ciudad.</p>',
        additionalData: {
          subtitle: 'Nuestra ubicación',
          description: '<p>Encuéntranos en una ubicación céntrica y de fácil acceso.</p>',
          secondaryTitle: 'Visítanos',
          address: {
            street: 'Av. Principal 123',
            city: 'Santiago, Chile'
          },
          schedule: {
            weekdays: 'Lunes a Viernes: 9:00 - 18:00',
            saturday: 'Sábados: 9:00 - 14:00'
          },
          contact: {
            phone: '+56 9 1234 5678',
            email: 'contacto@pixelup.cl'
          }
        }
      } as UbicacionConfig),
      buttonText: 'Ver ubicación',
      buttonLink: '/ubicacion/02',
      mainImageLink: 'https://pixelup.cl/default-location.jpg'
    }
  },
  
  [PIXELUPComponents.UBICACION_03]: {
    type: 'banner',
    jsonStructure: 'ubicacion',
    envVariable: 'NEXT_PUBLIC_UBICACION03_ID',
    defaultData: {
      title: 'Ubicación 03',
      landingText: JSON.stringify({
        title: 'Sucursal Secundaria',
        contentText: '<p>Nuestra sucursal secundaria ofrece servicios especializados.</p>',
        additionalData: {
          subtitle: 'Sucursal especializada',
          description: '<p>Servicios premium en una ubicación exclusiva.</p>',
          secondaryTitle: 'Horarios especiales',
          address: {
            street: 'Calle Secundaria 456',
            city: 'Providencia, Chile'
          },
          schedule: {
            weekdays: 'Lunes a Viernes: 10:00 - 19:00',
            saturday: 'Sábados: 10:00 - 16:00'
          },
          contact: {
            phone: '+56 9 8765 4321',
            email: 'especial@pixelup.cl'
          }
        }
      } as UbicacionConfig),
      buttonText: 'Ver ubicación',
      buttonLink: '/ubicacion/03',
      mainImageLink: 'https://pixelup.cl/default-location.jpg'
    }
  },
  
  [PIXELUPComponents.UBICACION_04]: {
    type: 'banner',
    jsonStructure: 'ubicacion',
    envVariable: 'NEXT_PUBLIC_UBICACION04_ID',
    defaultData: {
      title: 'Ubicación 04',
      landingText: JSON.stringify({
        title: 'Sucursal Norte',
        contentText: '<p>Nuestra sucursal norte ofrece servicios especializados.</p>',
        additionalData: {
          subtitle: 'Sucursal norte',
          description: '<p>Servicios premium en una ubicación exclusiva del norte.</p>',
          secondaryTitle: 'Horarios especiales',
          address: {
            street: 'Av. Norte 789',
            city: 'Las Condes, Chile'
          },
          schedule: {
            weekdays: 'Lunes a Viernes: 9:00 - 17:00',
            saturday: 'Sábados: 9:00 - 13:00'
          },
          contact: {
            phone: '+56 9 1111 2222',
            email: 'norte@pixelup.cl'
          }
        }
      } as UbicacionConfig),
      buttonText: 'Ver ubicación',
      buttonLink: '/ubicacion/04',
      mainImageLink: 'https://pixelup.cl/default-location.jpg'
    }
  },
  
  [PIXELUPComponents.UBICACION_05]: {
    type: 'banner',
    jsonStructure: 'ubicacion',
    envVariable: 'NEXT_PUBLIC_UBICACION05_ID',
    defaultData: {
      title: 'Ubicación 05',
      landingText: JSON.stringify({
        title: 'Sucursal Sur',
        contentText: '<p>Nuestra sucursal sur ofrece servicios especializados.</p>',
        additionalData: {
          subtitle: 'Sucursal sur',
          description: '<p>Servicios premium en una ubicación exclusiva del sur.</p>',
          secondaryTitle: 'Horarios especiales',
          address: {
            street: 'Av. Sur 321',
            city: 'Ñuñoa, Chile'
          },
          schedule: {
            weekdays: 'Lunes a Viernes: 10:00 - 18:00',
            saturday: 'Sábados: 10:00 - 15:00'
          },
          contact: {
            phone: '+56 9 3333 4444',
            email: 'sur@pixelup.cl'
          }
        }
      } as UbicacionConfig),
      buttonText: 'Ver ubicación',
      buttonLink: '/ubicacion/05',
      mainImageLink: 'https://pixelup.cl/default-location.jpg'
    }
  },
  
  [PIXELUPComponents.MODAL_UBICACION_04]: {
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_MODALUBICACION04_ID',
    defaultData: {
      title: 'Modal Ubicación 04',
      landingText: 'Información detallada',
      buttonText: 'Cerrar',
      buttonLink: '#',
      mainImageLink: 'https://pixelup.cl/default-modal.jpg'
    }
  },
  
  // Blog
  [PIXELUPComponents.BLOG_HOME]: {
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_BLOGHOME_ID',
    defaultData: {
      title: 'Blog',
      landingText: 'Últimas noticias',
      buttonText: 'Leer blog',
      buttonLink: '/blog',
      mainImageLink: 'https://pixelup.cl/default-blog.jpg'
    }
  },
  
  [PIXELUPComponents.BANNER_BLOG]: {
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_BANNER_BLOG_ID',
    defaultData: {
      title: 'Banner Blog',
      landingText: 'Artículos destacados',
      buttonText: 'Ver artículos',
      buttonLink: '/blog',
      mainImageLink: 'https://pixelup.cl/default-blog-banner.jpg'
    }
  },
  
  // Parallax
  [PIXELUPComponents.PARALLAX]: {
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_PARALLAX_ID',
    defaultData: {
      title: 'Efecto Parallax',
      landingText: 'Experiencia única',
      buttonText: 'Descubrir',
      buttonLink: '#',
      mainImageLink: 'https://pixelup.cl/default-parallax.jpg'
    }
  },
  
  // Navbar
  [PIXELUPComponents.NAVBAR_BANNER]: {
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_NAVBARBANNER_ID',
    defaultData: {
      title: 'Banner Navbar',
      landingText: 'Navegación principal',
      buttonText: 'Menú',
      buttonLink: '#',
      mainImageLink: 'https://pixelup.cl/default-navbar.jpg'
    }
  },
  
  // Sin Foto
  [PIXELUPComponents.SINFOTO_01]: {
    type: 'mixed',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_SINFOTO01_ID',
    defaultData: {
      banner: {
        title: 'Sin Foto 01',
        landingText: 'Contenido sin imagen',
        buttonText: 'Ver más',
        buttonLink: '#',
        mainImageLink: 'https://pixelup.cl/default-no-image.jpg'
      },
      contentBlock: {
        title: 'Contenido sin foto',
        contentText: 'Este es un contenido que no requiere imagen principal.'
      }
    }
  },
  
  [PIXELUPComponents.SINFOTO_02]: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_SINFOTO02_CONTENTBLOCK',
    defaultData: {
      title: 'Sin Foto 02',
      contentText: 'Contenido adicional sin imagen.'
    }
  },
  
  [PIXELUPComponents.SINFOTO_04]: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_SINFOTO04_CONTENTBLOCK',
    defaultData: {
      title: 'Sin Foto 04',
      contentText: 'Más contenido sin imagen.'
    }
  },
  
  [PIXELUPComponents.SINFOTO_05]: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_SINFOTO05_CONTENTBLOCK',
    defaultData: {
      title: 'Sin Foto 05',
      contentText: 'Contenido final sin imagen.'
    }
  },
  
  // Cards
  [PIXELUPComponents.CARD_01]: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_CARD01_CONTENTBLOCK',
    defaultData: {
      title: 'Card 01',
      contentText: 'Información de la primera tarjeta.'
    }
  },
  
  [PIXELUPComponents.CARD_02]: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_CARD02_CONTENTBLOCK',
    defaultData: {
      title: 'Card 02',
      contentText: 'Información de la segunda tarjeta.'
    }
  },
  
  [PIXELUPComponents.CARD_03]: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_CARD03_CONTENTBLOCK',
    defaultData: {
      title: 'Card 03',
      contentText: 'Información de la tercera tarjeta.'
    }
  },
  
  [PIXELUPComponents.CARD_04]: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_CARD04_CONTENTBLOCK',
    defaultData: {
      title: 'Card 04',
      contentText: 'Información de la cuarta tarjeta.'
    }
  },
  
  // Footer
  [PIXELUPComponents.FOOTER_BANNER]: {
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_FOOTER_BANNER_ID',
    defaultData: {
      title: 'Footer Banner',
      landingText: 'Información del pie de página',
      buttonText: 'Contacto',
      buttonLink: '/contacto',
      mainImageLink: 'https://pixelup.cl/default-footer.jpg'
    }
  },
  
  // Logo Edit
  [PIXELUPComponents.LOGO_EDIT]: {
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_LOGOEDIT_ID',
    defaultData: {
      title: 'Logo Edit',
      landingText: 'Editar logo',
      buttonText: 'Editar',
      buttonLink: '/admin/logo',
      mainImageLink: 'https://pixelup.cl/default-logo.jpg'
    }
  },
  
  // Servicios - Estructura de array específica
  [PIXELUPComponents.LISTA_SERVICIOS_01]: {
    type: 'contentBlock',
    jsonStructure: 'servicios',
    envVariable: 'NEXT_PUBLIC_LISTA_SERVICIOS01_ID',
    defaultData: {
      title: 'Servicios 01',
      contentText: JSON.stringify([
        'SERVICIO PERSONALIZADO',
        'Diseño web profesional',
        'Desarrollo de aplicaciones',
        'Consultoría digital',
        'TIEMPO APROXIMADO DE ATENCIÓN DE 1:30 Hrs a 2:00 Hrs',
        'Desde $25.000',
        false
      ])
    }
  },
  
  [PIXELUPComponents.LISTA_SERVICIOS_02]: {
    type: 'contentBlock',
    jsonStructure: 'servicios',
    envVariable: 'NEXT_PUBLIC_LISTA_SERVICIOS02_ID',
    defaultData: {
      title: 'Servicios 02',
      contentText: JSON.stringify([
        'SERVICIO PREMIUM',
        'Diseño UX/UI avanzado',
        'Optimización SEO',
        'Marketing digital',
        'TIEMPO APROXIMADO DE ATENCIÓN DE 2:00 Hrs a 3:00 Hrs',
        'Desde $35.000',
        true
      ])
    }
  },
  
  [PIXELUPComponents.LISTA_SERVICIOS_03]: {
    type: 'contentBlock',
    jsonStructure: 'servicios',
    envVariable: 'NEXT_PUBLIC_LISTA_SERVICIOS03_ID',
    defaultData: {
      title: 'Servicios 03',
      contentText: JSON.stringify([
        'SERVICIO ESPECIALIZADO',
        'Consultoría estratégica',
        'Análisis de datos',
        'Optimización de procesos',
        'TIEMPO APROXIMADO DE ATENCIÓN DE 2:30 Hrs a 3:30 Hrs',
        'Desde $45.000',
        true
      ])
    }
  },
  
  [PIXELUPComponents.LISTA_SERVICIOS_04]: {
    type: 'contentBlock',
    jsonStructure: 'servicios',
    envVariable: 'NEXT_PUBLIC_LISTA_SERVICIOS04_ID',
    defaultData: {
      title: 'Servicios 04',
      contentText: JSON.stringify([
        'SERVICIO PREMIUM PLUS',
        'Desarrollo personalizado',
        'Integración de sistemas',
        'Soporte 24/7',
        'TIEMPO APROXIMADO DE ATENCIÓN DE 3:00 Hrs a 4:00 Hrs',
        'Desde $55.000',
        true
      ])
    }
  },
  
  // Hero - Estructura específica para hero
  [PIXELUPComponents.NOSOTROS_01]: {
    type: 'mixed',
    jsonStructure: 'hero',
    envVariable: 'NEXT_PUBLIC_NOSOTROS01_ID',
    defaultData: {
      banner: {
        title: 'Nosotros',
        landingText: JSON.stringify({
          content: '<p>Somos una empresa líder en nuestro sector, comprometida con la calidad y la innovación.</p>',
          subtitle: 'Nuestra Historia',
          text2: '<p>Con años de experiencia, hemos ayudado a cientos de clientes a alcanzar sus objetivos digitales.</p>'
        } as HeroConfig),
        buttonText: 'Conocer más',
        buttonLink: '/nosotros',
        mainImageLink: 'https://pixelup.cl/default-about.jpg'
      },
      contentBlock: {
        title: 'Sobre nuestra empresa',
        contentText: 'Somos una empresa líder en nuestro sector, comprometida con la calidad y la innovación.'
      }
    }
  },
  
  // Componentes con estructura simple
  [PIXELUPComponents.FRASE_01]: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_FRASE01_ID',
    defaultData: {
      title: 'Frase inspiradora',
      contentText: 'La calidad no es un acto, es un hábito.'
    }
  },
  
  [PIXELUPComponents.ABOUT_ME_CONTENT]: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_ABOUTMECONTENT_ID',
    defaultData: {
      title: 'Sobre nosotros',
      contentText: 'Somos una empresa comprometida con la excelencia y la innovación.'
    }
  },
};

export const CORE_COMPONENT_DATA: Record<CoreComponents, ComponentData> = {
  // Popup
  [CoreComponents.POPUP_BANNER]: {
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_POPUP_BANNER_ID',
    defaultData: {
      title: 'Popup Banner',
      landingText: 'Oferta especial',
      buttonText: 'Aceptar',
      buttonLink: '#',
      mainImageLink: 'https://pixelup.cl/default-popup.jpg'
    }
  },
  
  [CoreComponents.POPUP_CONTENTBLOCK]: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_POPUP_CONTENTBLOCK',
    defaultData: {
      title: 'Configuración Popup',
      contentText: '{"enabled": false, "delay": 5000, "showOnce": true}'
    }
  },
};

// ========================================
// MAPEO CENTRALIZADO DE IDs
// ========================================

/**
 * Mapeo centralizado de todos los IDs de componentes
 * Aquí se pueden copiar y pegar todos los IDs generados por el script
 */
export const COMPONENT_IDS: Record<string, string> = {
  // SEO
  'SEO_BANNER': 'a8cbd4df-4438-4053-bf0e-d86fe0358776',
  'SEO_BANNER_IMG': 'cb1568c0-df15-40a8-b009-99656d33077f',
  
  // Banner Principal
  'BANNER_PRINCIPAL_01': 'PENDING_ID',
  'BANNER_PRINCIPAL_02': 'PENDING_ID',
  'BANNER_PRINCIPAL_03': 'PENDING_ID',
  
  // Banner About
  'BANNER_ABOUT': 'PENDING_ID',
  
  // Banner Tienda
  'BANNER_TIENDA': 'PENDING_ID',
  
  // Banner Colección
  'BANNER_COLECCION': 'PENDING_ID',
  
  // Categorías
  'CATEGORIA_01': 'PENDING_ID',
  'CATEGORIA_02': 'PENDING_ID',
  'CATEGORIA_03': 'PENDING_ID',
  'CATEGORIA_04': 'PENDING_ID',
  'CATEGORIA_05': 'PENDING_ID',
  'CATEGORIA_06': 'PENDING_ID',
  'CATEGORIA_07': 'PENDING_ID',
  'CATEGORIA_08': 'PENDING_ID',
  'CATEGORIA_09': 'PENDING_ID',
  'CATEGORIA_10': 'PENDING_ID',
  
  // Galerías
  'GALERIA_01': 'PENDING_ID',
  'GALERIA_02': 'PENDING_ID',
  
  // Ubicación
  'UBICACION': 'PENDING_ID',
  'UBICACION_02': 'PENDING_ID',
  'UBICACION_03': 'PENDING_ID',
  'UBICACION_04': 'PENDING_ID',
  'UBICACION_05': 'PENDING_ID',
  'MODAL_UBICACION_04': 'PENDING_ID',
  
  // Blog
  'BLOG_HOME': 'PENDING_ID',
  'BANNER_BLOG': 'PENDING_ID',
  
  // Parallax
  'PARALLAX': 'PENDING_ID',
  
  // Frases
  'FRASE_01': 'PENDING_ID',
  
  // About
  'ABOUT_ME_CONTENT': 'PENDING_ID',
  
  // Navbar
  'NAVBAR_BANNER': 'PENDING_ID',
  
  // Nosotros
  'NOSOTROS_01': 'PENDING_ID',
  
  // Servicios
  'LISTA_SERVICIOS_01': 'PENDING_ID',
  'LISTA_SERVICIOS_02': 'PENDING_ID',
  'LISTA_SERVICIOS_03': 'PENDING_ID',
  'LISTA_SERVICIOS_04': 'PENDING_ID',
  
  // Sin Foto
  'SINFOTO_01': 'PENDING_ID',
  'SINFOTO_02': 'PENDING_ID',
  'SINFOTO_04': 'PENDING_ID',
  'SINFOTO_05': 'PENDING_ID',
  
  // Cards
  'CARD_01': 'PENDING_ID',
  'CARD_02': 'PENDING_ID',
  'CARD_03': 'PENDING_ID',
  'CARD_04': 'PENDING_ID',
  
  // Footer
  'FOOTER_BANNER': 'PENDING_ID',
  
  // Logo Edit
  'LOGO_EDIT': 'PENDING_ID',
  
  // Core Components
  'POPUP_BANNER': 'PENDING_ID',
  'POPUP_CONTENTBLOCK': 'PENDING_ID',
};

/**
 * Función para obtener el ID de un componente desde el mapeo centralizado
 */
export function getComponentId(componentKey: string): string {
  return COMPONENT_IDS[componentKey] || 'PENDING_ID';
}

/**
 * Función para actualizar múltiples IDs de una vez
 * Uso: updateComponentIds({ 'SEO_BANNER': 'nuevo-id', 'SEO_BANNER_IMG': 'otro-id' })
 */
export function updateComponentIds(updates: Record<string, string>): void {
  Object.entries(updates).forEach(([key, id]) => {
    COMPONENT_IDS[key] = id;
  });
}

// ========================================
// FUNCIONES PARA ACTUALIZAR IDs DESPUÉS DE CREACIÓN
// ========================================

/**
 * Actualiza el ID de un componente después de crearlo via API
 */
export function updateComponentId(
  component: PIXELUPComponents | CoreComponents, 
  newId: string
): void {
  COMPONENT_IDS[component] = newId;
}

/**
 * Obtiene todos los componentes que necesitan ser creados (tienen PENDING_ID)
 */
export function getPendingComponents(): Array<{
  component: PIXELUPComponents | CoreComponents;
  data: ComponentData;
}> {
  const pending: Array<{ component: PIXELUPComponents | CoreComponents; data: ComponentData }> = [];
  
  // Revisar componentes PIXELUP
  Object.entries(PIXELUP_COMPONENT_DATA).forEach(([component, data]) => {
    if (COMPONENT_IDS[component] === 'PENDING_ID') {
      pending.push({ 
        component: component as PIXELUPComponents, 
        data 
      });
    }
  });
  
  // Revisar componentes Core
  Object.entries(CORE_COMPONENT_DATA).forEach(([component, data]) => {
    if (COMPONENT_IDS[component] === 'PENDING_ID') {
      pending.push({ 
        component: component as CoreComponents, 
        data 
      });
    }
  });
  
  return pending;
}

/**
 * Obtiene los datos de un componente PIXELUP
 */
export function getPIXELUPComponentData(component: PIXELUPComponents): ComponentData {
  return PIXELUP_COMPONENT_DATA[component];
}

/**
 * Obtiene los datos de un componente Core
 */
export function getCoreComponentData(component: CoreComponents): ComponentData {
  return CORE_COMPONENT_DATA[component];
}

/**
 * Obtiene el ID de un componente PIXELUP
 */
export function getPIXELUPComponentId(component: PIXELUPComponents): string {
  return COMPONENT_IDS[component] || 'PENDING_ID';
}

/**
 * Obtiene el ID de un componente Core
 */
export function getCoreComponentId(component: CoreComponents): string {
  return COMPONENT_IDS[component] || 'PENDING_ID';
}

/**
 * Obtiene los datos por defecto de un componente PIXELUP
 */
export function getPIXELUPComponentDefaultData(component: PIXELUPComponents): any {
  return PIXELUP_COMPONENT_DATA[component].defaultData;
}

/**
 * Obtiene los datos por defecto de un componente Core
 */
export function getCoreComponentDefaultData(component: CoreComponents): any {
  return CORE_COMPONENT_DATA[component].defaultData;
}

/**
 * Verifica si un componente es de tipo banner
 */
export function isBannerComponent(component: PIXELUPComponents | CoreComponents): boolean {
  const data = PIXELUP_COMPONENT_DATA[component as PIXELUPComponents] || 
               CORE_COMPONENT_DATA[component as CoreComponents];
  return data?.type === 'banner';
}

/**
 * Verifica si un componente es de tipo contentBlock
 */
export function isContentBlockComponent(component: PIXELUPComponents | CoreComponents): boolean {
  const data = PIXELUP_COMPONENT_DATA[component as PIXELUPComponents] || 
               CORE_COMPONENT_DATA[component as CoreComponents];
  return data?.type === 'contentBlock';
}

/**
 * Verifica si un componente es de tipo mixed
 */
export function isMixedComponent(component: PIXELUPComponents | CoreComponents): boolean {
  const data = PIXELUP_COMPONENT_DATA[component as PIXELUPComponents] || 
               CORE_COMPONENT_DATA[component as CoreComponents];
  return data?.type === 'mixed';
}

/**
 * Obtiene todos los componentes de un tipo específico
 */
export function getComponentsByType(type: 'banner' | 'contentBlock' | 'mixed'): Array<PIXELUPComponents | CoreComponents> {
  const components: Array<PIXELUPComponents | CoreComponents> = [];
  
  // Revisar componentes PIXELUP
  Object.entries(PIXELUP_COMPONENT_DATA).forEach(([component, data]) => {
    if (data.type === type) {
      components.push(component as PIXELUPComponents);
    }
  });
  
  // Revisar componentes Core
  Object.entries(CORE_COMPONENT_DATA).forEach(([component, data]) => {
    if (data.type === type) {
      components.push(component as CoreComponents);
    }
  });
  
  return components;
}

/**
 * Obtiene todos los componentes de una estructura JSON específica
 */
export function getComponentsByJsonStructure(structure: string): Array<PIXELUPComponents | CoreComponents> {
  const components: Array<PIXELUPComponents | CoreComponents> = [];
  
  // Revisar componentes PIXELUP
  Object.entries(PIXELUP_COMPONENT_DATA).forEach(([component, data]) => {
    if (data.jsonStructure === structure) {
      components.push(component as PIXELUPComponents);
    }
  });
  
  // Revisar componentes Core
  Object.entries(CORE_COMPONENT_DATA).forEach(([component, data]) => {
    if (data.jsonStructure === structure) {
      components.push(component as CoreComponents);
    }
  });
  
  return components;
}


