/**
 * Sistema de Enums para Componentes
 * Los IDs se generan din�micamente via API y se actualizan aqu�
 */

// ========================================
// TIPOS ESPEC�FICOS PARA CADA COMPONENTE
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

// Tipos para Ubicaci�n
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

// Tipos para Categor�as
export interface CategoriaConfig {
  title: string;
  mainText: string;
  bookText: string;
  buttonText: string;
  buttonText2: string;
  buttonLink: string;
  buttonLink2: string;
}

// Tipos para Galer�a
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

// ========================================
// TIPOS BASE PARA COMPONENTES
// ========================================

// Estructura para imágenes base64
export interface Base64Image {
  name: string;
  type: string;
  size: number;
  data: string; // Base64 completo con data:image/...;base64,...
}

export interface ComponentData {
  id: string; // Placeholder - se actualiza despu�s de crear via API
  defaultData: any;
  type: 'banner' | 'contentBlock' | 'mixed';
  jsonStructure?: 'bannerPrincipal' | 'ubicacion' | 'servicios' | 'categoria' | 'galeria' | 'hero' | 'simple';
  envVariable?: string; // Variable de entorno correspondiente
}

// ========================================
// ENUMS DE COMPONENTES PIXELUP
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
  
  // Banner Colecci�n
  BANNER_COLECCION = 'BANNER_COLECCION',
  
  // Categor�as
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
  
  // Galer�as
  GALERIA_01 = 'GALERIA_01',
  GALERIA_02 = 'GALERIA_02',
  
  // Ubicaci�n
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

// Función para agregar imagen base64 a todos los componentes de tipo banner
function addBase64ImageToBanners() {
  // Esta función se ejecutará después de definir todos los componentes
  // para agregar automáticamente la imagen base64 a todos los banners
}

// ========================================
// CONFIGURACIN DE DATOS POR DEFECTO (SIN IDs)
// ========================================

// Imagen base64 de ejemplo (1x1 pixel transparente PNG)
const DEFAULT_BASE64_IMAGE: Base64Image = {
  name: "pixelup-default.png",
  type: "image/png",
  size: 95,
  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
};

export const PIXELUP_COMPONENT_DATA: Record<PIXELUPComponents, ComponentData> = {
  // Banner Principal - Estructura JSON compleja
  [PIXELUPComponents.BANNER_PRINCIPAL_01]: {
    id: PIXELUPComponents.BANNER_PRINCIPAL_01, // Se actualiza despu�s de crear via API
    type: 'banner',
    jsonStructure: 'bannerPrincipal',
    envVariable: 'NEXT_PUBLIC_BANNERPRINCIPAL01_ID',
    defaultData: {
      title: 'Banner Principal 01',
      landingText: JSON.stringify({
        text: 'Descubre nuestra colecci�n',
        showText: true,
        showPrice: false,
        showValue: false,
        showButton1: true,
        showButton2: false,
        button1Text: 'Ver m�s',
        button2Text: 'Bot�n 2',
        button1Link: '#',
        button2Link: '#',
        contentAlignment: 'center',
        fullBannerLink: false,
        fullBannerLinkUrl: '#',
        baseTypography: 'montserrat',
        titleTypography: 'montserrat'
      } as BannerPrincipalConfig),
      buttonText: 'Ver m�s',
      buttonLink: '#',
      mainImageLink: 'https://pixelup.cl/default-banner.jpg'
    }
  },
  
  [PIXELUPComponents.BANNER_PRINCIPAL_02]: {
    id: PIXELUPComponents.BANNER_PRINCIPAL_02,
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
        button2Text: 'Bot�n 2',
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
    id: PIXELUPComponents.BANNER_PRINCIPAL_03,
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
    id: PIXELUPComponents.BANNER_ABOUT,
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_BANNER_ABOUT_ID',
    defaultData: {
      title: 'Sobre nosotros',
      landingText: 'Conoce nuestra historia',
      buttonText: 'Leer m�s',
      buttonLink: '/nosotros',
      mainImageLink: 'https://pixelup.cl/default-about.jpg'
    }
  },
  
  // Banner Tienda - Estructura simple
  [PIXELUPComponents.BANNER_TIENDA]: {
    id: PIXELUPComponents.BANNER_TIENDA,
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
  
  // Banner Colecci�n - Estructura simple
  [PIXELUPComponents.BANNER_COLECCION]: {
    id: PIXELUPComponents.BANNER_COLECCION,
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_BANNER_COLECCION_ID',
    defaultData: {
      title: 'Nueva colecci�n',
      landingText: 'Descubre lo �ltimo',
      buttonText: 'Ver colecci�n',
      buttonLink: '/colecciones',
      mainImageLink: 'https://pixelup.cl/default-collection.jpg'
    }
  },
  
  // Categor�as - Estructura espec�fica para categor�as
  [PIXELUPComponents.CATEGORIA_01]: {
    id: PIXELUPComponents.CATEGORIA_01,
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA01_ID',
    defaultData: {
      title: 'Categor�a 01',
      landingText: JSON.stringify({
        title: 'Productos Destacados',
        mainText: 'Descubre nuestra selecci�n especial',
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
    id: PIXELUPComponents.CATEGORIA_02,
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA02_ID',
    defaultData: {
      title: 'Categor�a 02',
      landingText: JSON.stringify({
        title: 'Productos Populares',
        mainText: 'Los m�s vendidos de la temporada',
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
    id: PIXELUPComponents.CATEGORIA_03,
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA03_ID',
    defaultData: {
      title: 'Categor�a 03',
      landingText: JSON.stringify({
        title: 'Productos Nuevos',
        mainText: 'Descubre las �ltimas novedades',
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
    id: PIXELUPComponents.CATEGORIA_04,
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA04_ID',
    defaultData: {
      title: 'Categor�a 04',
      landingText: JSON.stringify({
        title: 'Productos Exclusivos',
        mainText: 'Colecci�n limitada y exclusiva',
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
    id: PIXELUPComponents.CATEGORIA_05,
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA05_ID',
    defaultData: {
      title: 'Categor�a 05',
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
    id: PIXELUPComponents.CATEGORIA_06,
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA06_ID',
    defaultData: {
      title: 'Categor�a 06',
      landingText: JSON.stringify({
        title: 'Productos B�sicos',
        mainText: 'Fundamentos esenciales',
        bookText: 'Comprar b�sico',
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
    id: PIXELUPComponents.CATEGORIA_07,
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA07_ID',
    defaultData: {
      title: 'Categor�a 07',
      landingText: JSON.stringify({
        title: 'Productos Especiales',
        mainText: 'Ofertas �nicas y especiales',
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
    id: PIXELUPComponents.CATEGORIA_08,
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA08_ID',
    defaultData: {
      title: 'Categor�a 08',
      landingText: JSON.stringify({
        title: 'Productos �nicos',
        mainText: 'Piezas �nicas y exclusivas',
        bookText: 'Reservar �nico',
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
    id: PIXELUPComponents.CATEGORIA_09,
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA09_ID',
    defaultData: {
      title: 'Categor�a 09',
      landingText: JSON.stringify({
        title: 'Productos Limitados',
        mainText: 'Edici�n limitada disponible',
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
    id: PIXELUPComponents.CATEGORIA_10,
    type: 'banner',
    jsonStructure: 'categoria',
    envVariable: 'NEXT_PUBLIC_CATEGORIA10_ID',
    defaultData: {
      title: 'Categor�a 10',
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
  
  // Galer�as - Estructura espec�fica para galer�as
  [PIXELUPComponents.GALERIA_01]: {
    id: PIXELUPComponents.GALERIA_01,
    type: 'banner',
    jsonStructure: 'galeria',
    envVariable: 'NEXT_PUBLIC_GALERIA01_ID',
    defaultData: {
      title: 'Galer�a 01',
      landingText: JSON.stringify({
        mainTitle: 'Nuestras Im�genes',
        mainDescription: 'Descubre nuestra colecci�n visual',
        features: {
          title1: 'Calidad Premium',
          description1: 'Im�genes de alta resoluci�n',
          title2: 'Dise�o Profesional',
          description2: 'Creado por expertos'
        },
        buttonText: 'Ver galer�a'
      } as GaleriaConfig),
      buttonText: 'Ver galer�a',
      buttonLink: '/galeria/01',
      mainImageLink: 'https://pixelup.cl/default-gallery.jpg'
    }
  },
  
  [PIXELUPComponents.GALERIA_02]: {
    id: PIXELUPComponents.GALERIA_02,
    type: 'banner',
    jsonStructure: 'galeria',
    envVariable: 'NEXT_PUBLIC_GALERIA02_ID',
    defaultData: {
      title: 'Galer�a 02',
      landingText: JSON.stringify({
        mainTitle: 'M�s Im�genes',
        mainDescription: 'Explora nuestra galer�a completa',
        features: {
          title1: 'Variedad',
          description1: 'M�ltiples estilos y opciones',
          title2: 'Inspiraci�n',
          description2: 'Ideas para tu proyecto'
        },
        buttonText: 'Ver galer�a'
      } as GaleriaConfig),
      buttonText: 'Ver galer�a',
      buttonLink: '/galeria/02',
      mainImageLink: 'https://pixelup.cl/default-gallery.jpg'
    }
  },
  
  // Ubicaci�n - Estructura compleja con additionalData
  [PIXELUPComponents.UBICACION]: {
    id: PIXELUPComponents.UBICACION,
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_UBICACION_ID',
    defaultData: {
      title: 'Nuestra ubicaci�n',
      landingText: 'Encu�ntranos aqu�',
      buttonText: 'Ver mapa',
      buttonLink: '/ubicacion',
      mainImageLink: 'https://pixelup.cl/default-location.jpg'
    }
  },
  
  [PIXELUPComponents.UBICACION_02]: {
    id: PIXELUPComponents.UBICACION_02,
    type: 'banner',
    jsonStructure: 'ubicacion',
    envVariable: 'NEXT_PUBLIC_UBICACION02_ID',
    defaultData: {
      title: 'Ubicaci�n 02',
      landingText: JSON.stringify({
        title: 'Sucursal Principal',
        contentText: '<p>Nuestra sucursal principal est� ubicada en el coraz�n de la ciudad.</p>',
        additionalData: {
          subtitle: 'Nuestra ubicaci�n',
          description: '<p>Encu�ntranos en una ubicaci�n c�ntrica y de f�cil acceso.</p>',
          secondaryTitle: 'Vis�tanos',
          address: {
            street: 'Av. Principal 123',
            city: 'Santiago, Chile'
          },
          schedule: {
            weekdays: 'Lunes a Viernes: 9:00 - 18:00',
            saturday: 'S�bados: 9:00 - 14:00'
          },
          contact: {
            phone: '+56 9 1234 5678',
            email: 'contacto@pixelup.cl'
          }
        }
      } as UbicacionConfig),
      buttonText: 'Ver ubicaci�n',
      buttonLink: '/ubicacion/02',
      mainImageLink: 'https://pixelup.cl/default-location.jpg'
    }
  },
  
  [PIXELUPComponents.UBICACION_03]: {
    id: PIXELUPComponents.UBICACION_03,
    type: 'banner',
    jsonStructure: 'ubicacion',
    envVariable: 'NEXT_PUBLIC_UBICACION03_ID',
    defaultData: {
      title: 'Ubicaci�n 03',
      landingText: JSON.stringify({
        title: 'Sucursal Secundaria',
        contentText: '<p>Nuestra sucursal secundaria ofrece servicios especializados.</p>',
        additionalData: {
          subtitle: 'Sucursal especializada',
          description: '<p>Servicios premium en una ubicaci�n exclusiva.</p>',
          secondaryTitle: 'Horarios especiales',
          address: {
            street: 'Calle Secundaria 456',
            city: 'Providencia, Chile'
          },
          schedule: {
            weekdays: 'Lunes a Viernes: 10:00 - 19:00',
            saturday: 'S�bados: 10:00 - 16:00'
          },
          contact: {
            phone: '+56 9 8765 4321',
            email: 'especial@pixelup.cl'
          }
        }
      } as UbicacionConfig),
      buttonText: 'Ver ubicaci�n',
      buttonLink: '/ubicacion/03',
      mainImageLink: 'https://pixelup.cl/default-location.jpg'
    }
  },
  
  [PIXELUPComponents.UBICACION_04]: {
    id: PIXELUPComponents.UBICACION_04,
    type: 'banner',
    jsonStructure: 'ubicacion',
    envVariable: 'NEXT_PUBLIC_UBICACION04_ID',
    defaultData: {
      title: 'Ubicaci�n 04',
      landingText: JSON.stringify({
        title: 'Sucursal Norte',
        contentText: '<p>Nuestra sucursal norte ofrece servicios especializados.</p>',
        additionalData: {
          subtitle: 'Sucursal norte',
          description: '<p>Servicios premium en una ubicaci�n exclusiva del norte.</p>',
          secondaryTitle: 'Horarios especiales',
          address: {
            street: 'Av. Norte 789',
            city: 'Las Condes, Chile'
          },
          schedule: {
            weekdays: 'Lunes a Viernes: 9:00 - 17:00',
            saturday: 'S�bados: 9:00 - 13:00'
          },
          contact: {
            phone: '+56 9 1111 2222',
            email: 'norte@pixelup.cl'
          }
        }
      } as UbicacionConfig),
      buttonText: 'Ver ubicaci�n',
      buttonLink: '/ubicacion/04',
      mainImageLink: 'https://pixelup.cl/default-location.jpg'
    }
  },
  
  [PIXELUPComponents.UBICACION_05]: {
    id: PIXELUPComponents.UBICACION_05,
    type: 'banner',
    jsonStructure: 'ubicacion',
    envVariable: 'NEXT_PUBLIC_UBICACION05_ID',
    defaultData: {
      title: 'Ubicaci�n 05',
      landingText: JSON.stringify({
        title: 'Sucursal Sur',
        contentText: '<p>Nuestra sucursal sur ofrece servicios especializados.</p>',
        additionalData: {
          subtitle: 'Sucursal sur',
          description: '<p>Servicios premium en una ubicaci�n exclusiva del sur.</p>',
          secondaryTitle: 'Horarios especiales',
          address: {
            street: 'Av. Sur 321',
            city: '�u�oa, Chile'
          },
          schedule: {
            weekdays: 'Lunes a Viernes: 10:00 - 18:00',
            saturday: 'S�bados: 10:00 - 15:00'
          },
          contact: {
            phone: '+56 9 3333 4444',
            email: 'sur@pixelup.cl'
          }
        }
      } as UbicacionConfig),
      buttonText: 'Ver ubicaci�n',
      buttonLink: '/ubicacion/05',
      mainImageLink: 'https://pixelup.cl/default-location.jpg'
    }
  },
  
  [PIXELUPComponents.MODAL_UBICACION_04]: {
    id: PIXELUPComponents.MODAL_UBICACION_04,
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_MODALUBICACION04_ID',
    defaultData: {
      title: 'Modal Ubicaci�n 04',
      landingText: 'Informaci�n detallada',
      buttonText: 'Cerrar',
      buttonLink: '#',
      mainImageLink: 'https://pixelup.cl/default-modal.jpg'
    }
  },
  
  // Blog
  [PIXELUPComponents.BLOG_HOME]: {
    id: PIXELUPComponents.BLOG_HOME,
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_BLOGHOME_ID',
    defaultData: {
      title: 'Blog',
      landingText: '�ltimas noticias',
      buttonText: 'Leer blog',
      buttonLink: '/blog',
      mainImageLink: 'https://pixelup.cl/default-blog.jpg'
    }
  },
  
  [PIXELUPComponents.BANNER_BLOG]: {
    id: PIXELUPComponents.BANNER_BLOG,
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_BANNER_BLOG_ID',
    defaultData: {
      title: 'Banner Blog',
      landingText: 'Art�culos destacados',
      buttonText: 'Ver art�culos',
      buttonLink: '/blog',
      mainImageLink: 'https://pixelup.cl/default-blog-banner.jpg'
    }
  },
  
  // Parallax
  [PIXELUPComponents.PARALLAX]: {
    id: PIXELUPComponents.PARALLAX,
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_PARALLAX_ID',
    defaultData: {
      title: 'Efecto Parallax',
      landingText: 'Experiencia �nica',
      buttonText: 'Descubrir',
      buttonLink: '#',
      mainImageLink: 'https://pixelup.cl/default-parallax.jpg'
    }
  },
  
  // Navbar
  [PIXELUPComponents.NAVBAR_BANNER]: {
    id: PIXELUPComponents.NAVBAR_BANNER,
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_NAVBARBANNER_ID',
    defaultData: {
      title: 'Banner Navbar',
      landingText: 'Navegaci�n principal',
      buttonText: 'Men�',
      buttonLink: '#',
      mainImageLink: 'https://pixelup.cl/default-navbar.jpg'
    }
  },
  
  // Sin Foto
  [PIXELUPComponents.SINFOTO_01]: {
    id: PIXELUPComponents.SINFOTO_01,
    type: 'mixed',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_SINFOTO01_ID',
    defaultData: {
      banner: {
        title: 'Sin Foto 01',
        landingText: 'Contenido sin imagen',
        buttonText: 'Ver m�s',
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
    id: PIXELUPComponents.SINFOTO_02,
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_SINFOTO02_CONTENTBLOCK',
    defaultData: {
      title: 'Sin Foto 02',
      contentText: 'Contenido adicional sin imagen.'
    }
  },
  
  [PIXELUPComponents.SINFOTO_04]: {
    id: PIXELUPComponents.SINFOTO_04,
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_SINFOTO04_CONTENTBLOCK',
    defaultData: {
      title: 'Sin Foto 04',
      contentText: 'M�s contenido sin imagen.'
    }
  },
  
  [PIXELUPComponents.SINFOTO_05]: {
    id: PIXELUPComponents.SINFOTO_05,
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
    id: PIXELUPComponents.CARD_01,
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_CARD01_CONTENTBLOCK',
    defaultData: {
      title: 'Card 01',
      contentText: 'Informaci�n de la primera tarjeta.'
    }
  },
  
  [PIXELUPComponents.CARD_02]: {
    id: PIXELUPComponents.CARD_02,
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_CARD02_CONTENTBLOCK',
    defaultData: {
      title: 'Card 02',
      contentText: 'Informaci�n de la segunda tarjeta.'
    }
  },
  
  [PIXELUPComponents.CARD_03]: {
    id: PIXELUPComponents.CARD_03,
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_CARD03_CONTENTBLOCK',
    defaultData: {
      title: 'Card 03',
      contentText: 'Informaci�n de la tercera tarjeta.'
    }
  },
  
  [PIXELUPComponents.CARD_04]: {
    id: PIXELUPComponents.CARD_04,
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_CARD04_CONTENTBLOCK',
    defaultData: {
      title: 'Card 04',
      contentText: 'Informaci�n de la cuarta tarjeta.'
    }
  },
  
  // SEO
  [PIXELUPComponents.SEO_BANNER]: {
    id: PIXELUPComponents.SEO_BANNER,
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_SEO_BANNER_ID',
    defaultData: {
      title: 'SEO Banner',
      landingText: 'Optimizaci�n para buscadores',
      buttonText: 'M�s informaci�n',
      buttonLink: '/seo',
      mainImageLink: 'https://pixelup.cl/default-seo.jpg'
    }
  },
  
  // Footer
  [PIXELUPComponents.FOOTER_BANNER]: {
    id: PIXELUPComponents.FOOTER_BANNER,
    type: 'banner',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_FOOTER_BANNER_ID',
    defaultData: {
      title: 'Footer Banner',
      landingText: 'Informaci�n del pie de p�gina',
      buttonText: 'Contacto',
      buttonLink: '/contacto',
      mainImageLink: 'https://pixelup.cl/default-footer.jpg'
    }
  },
  
  // Logo Edit
  [PIXELUPComponents.LOGO_EDIT]: {
    id: PIXELUPComponents.LOGO_EDIT,
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
  
  // Servicios - Estructura de array espec�fica
  [PIXELUPComponents.LISTA_SERVICIOS_01]: {
    id: PIXELUPComponents.LISTA_SERVICIOS_01,
    type: 'contentBlock',
    jsonStructure: 'servicios',
    envVariable: 'NEXT_PUBLIC_LISTA_SERVICIOS01_ID',
    defaultData: {
      title: 'Servicios 01',
      contentText: JSON.stringify([
        'SERVICIO PERSONALIZADO',
        'Dise�o web profesional',
        'Desarrollo de aplicaciones',
        'Consultor�a digital',
        'TIEMPO APROXIMADO DE ATENCI�N DE 1:30 Hrs a 2:00 Hrs',
        'Desde $25.000',
        false
      ])
    }
  },
  
  [PIXELUPComponents.LISTA_SERVICIOS_02]: {
    id: PIXELUPComponents.LISTA_SERVICIOS_02,
    type: 'contentBlock',
    jsonStructure: 'servicios',
    envVariable: 'NEXT_PUBLIC_LISTA_SERVICIOS02_ID',
    defaultData: {
      title: 'Servicios 02',
      contentText: JSON.stringify([
        'SERVICIO PREMIUM',
        'Dise�o UX/UI avanzado',
        'Optimizaci�n SEO',
        'Marketing digital',
        'TIEMPO APROXIMADO DE ATENCI�N DE 2:00 Hrs a 3:00 Hrs',
        'Desde $35.000',
        true
      ])
    }
  },
  
  [PIXELUPComponents.LISTA_SERVICIOS_03]: {
    id: PIXELUPComponents.LISTA_SERVICIOS_03,
    type: 'contentBlock',
    jsonStructure: 'servicios',
    envVariable: 'NEXT_PUBLIC_LISTA_SERVICIOS03_ID',
    defaultData: {
      title: 'Servicios 03',
      contentText: JSON.stringify([
        'SERVICIO ESPECIALIZADO',
        'Consultor�a estrat�gica',
        'An�lisis de datos',
        'Optimizaci�n de procesos',
        'TIEMPO APROXIMADO DE ATENCI�N DE 2:30 Hrs a 3:30 Hrs',
        'Desde $45.000',
        true
      ])
    }
  },
  
  [PIXELUPComponents.LISTA_SERVICIOS_04]: {
    id: PIXELUPComponents.LISTA_SERVICIOS_04,
    type: 'contentBlock',
    jsonStructure: 'servicios',
    envVariable: 'NEXT_PUBLIC_LISTA_SERVICIOS04_ID',
    defaultData: {
      title: 'Servicios 04',
      contentText: JSON.stringify([
        'SERVICIO PREMIUM PLUS',
        'Desarrollo personalizado',
        'Integraci�n de sistemas',
        'Soporte 24/7',
        'TIEMPO APROXIMADO DE ATENCI�N DE 3:00 Hrs a 4:00 Hrs',
        'Desde $55.000',
        true
      ])
    }
  },
  
  // Hero - Estructura espec�fica para hero
  [PIXELUPComponents.NOSOTROS_01]: {
    id: PIXELUPComponents.NOSOTROS_01,
    type: 'mixed',
    jsonStructure: 'hero',
    envVariable: 'NEXT_PUBLIC_NOSOTROS01_ID',
    defaultData: {
      banner: {
        title: 'Nosotros',
        landingText: JSON.stringify({
          content: '<p>Somos una empresa l�der en nuestro sector, comprometida con la calidad y la innovaci�n.</p>',
          subtitle: 'Nuestra Historia',
          text2: '<p>Con a�os de experiencia, hemos ayudado a cientos de clientes a alcanzar sus objetivos digitales.</p>'
        } as HeroConfig),
        buttonText: 'Conocer m�s',
        buttonLink: '/nosotros',
        mainImageLink: 'https://pixelup.cl/default-about.jpg'
      },
      contentBlock: {
        title: 'Sobre nuestra empresa',
        contentText: 'Somos una empresa l�der en nuestro sector, comprometida con la calidad y la innovaci�n.'
      }
    }
  },
  
  // Componentes con estructura simple
  [PIXELUPComponents.FRASE_01]: {
    id: PIXELUPComponents.FRASE_01,
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_FRASE01_ID',
    defaultData: {
      title: 'Frase inspiradora',
      contentText: 'La calidad no es un acto, es un h�bito.'
    }
  },
  
  [PIXELUPComponents.ABOUT_ME_CONTENT]: {
    id: PIXELUPComponents.ABOUT_ME_CONTENT,
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_ABOUTMECONTENT_ID',
    defaultData: {
      title: 'Sobre nosotros',
      contentText: 'Somos una empresa comprometida con la excelencia y la innovaci�n.'
    }
  },
};

export const CORE_COMPONENT_DATA: Record<CoreComponents, ComponentData> = {
  // Popup
  [CoreComponents.POPUP_BANNER]: {
    id: CoreComponents.POPUP_BANNER,
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
    id: CoreComponents.POPUP_CONTENTBLOCK,
    type: 'contentBlock',
    jsonStructure: 'simple',
    envVariable: 'NEXT_PUBLIC_POPUP_CONTENTBLOCK',
    defaultData: {
      title: 'Configuraci�n Popup',
      contentText: '{"enabled": false, "delay": 5000, "showOnce": true}'
    }
  },
};

// ========================================
// FUNCIONES PARA ACTUALIZAR IDs DESPU�S DE CREACI�N
// ========================================

/**
 * Actualiza el ID de un componente despu�s de crearlo via API
 */
export function updateComponentId(
  component: PIXELUPComponents | CoreComponents, 
  newId: string
): void {
  if (component in PIXELUP_COMPONENT_DATA) {
    PIXELUP_COMPONENT_DATA[component as PIXELUPComponents].id = newId;
  } else if (component in CORE_COMPONENT_DATA) {
    CORE_COMPONENT_DATA[component as CoreComponents].id = newId;
  }
}

/**
 * Actualiza m�ltiples IDs de una vez
 */
export function updateComponentIds(
  updates: Array<{ component: PIXELUPComponents | CoreComponents; id: string }>
): void {
  updates.forEach(({ component, id }) => {
    updateComponentId(component, id);
  });
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
    if (data.id === 'PENDING_ID') {
      pending.push({ 
        component: component as PIXELUPComponents, 
        data 
      });
    }
  });
  
  // Revisar componentes Core
  Object.entries(CORE_COMPONENT_DATA).forEach(([component, data]) => {
    if (data.id === 'PENDING_ID') {
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
  return PIXELUP_COMPONENT_DATA[component].id;
}

/**
 * Obtiene el ID de un componente Core
 */
export function getCoreComponentId(component: CoreComponents): string {
  return CORE_COMPONENT_DATA[component].id;
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
 * Obtiene todos los componentes de un tipo espec�fico
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
 * Obtiene todos los componentes de una estructura JSON espec�fica
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

/**
 * Mapeo de variables de entorno a enums (para migraci�n)
 */
export const ENV_TO_ENUM_MAPPING: Record<string, PIXELUPComponents | CoreComponents> = {
  'NEXT_PUBLIC_NAVBARBANNER_ID': PIXELUPComponents.NAVBAR_BANNER,
  'NEXT_PUBLIC_NAVBARBANNER_IMGID': PIXELUPComponents.NAVBAR_BANNER,
  'NEXT_PUBLIC_NOSOTROS01_ID': PIXELUPComponents.NOSOTROS_01,
  'NEXT_PUBLIC_NOSOTROS01_IMGID': PIXELUPComponents.NOSOTROS_01,
  'NEXT_PUBLIC_LISTA_SERVICIOS01_ID': PIXELUPComponents.LISTA_SERVICIOS_01,
  'NEXT_PUBLIC_LISTA_SERVICIOS02_ID': PIXELUPComponents.LISTA_SERVICIOS_02,
  'NEXT_PUBLIC_LISTA_SERVICIOS03_ID': PIXELUPComponents.LISTA_SERVICIOS_03,
  'NEXT_PUBLIC_LISTA_SERVICIOS04_ID': PIXELUPComponents.LISTA_SERVICIOS_04,
  'NEXT_PUBLIC_SINFOTO01_ID': PIXELUPComponents.SINFOTO_01,
  'NEXT_PUBLIC_SINFOTO01_IMGID': PIXELUPComponents.SINFOTO_01,
  'NEXT_PUBLIC_SINFOTO02_CONTENTBLOCK': PIXELUPComponents.SINFOTO_02,
  'NEXT_PUBLIC_SINFOTO02_BOX1_CONTENTBLOCK': PIXELUPComponents.SINFOTO_02,
  'NEXT_PUBLIC_SINFOTO02_BOX2_CONTENTBLOCK': PIXELUPComponents.SINFOTO_02,
  'NEXT_PUBLIC_SINFOTO02_BOX3_CONTENTBLOCK': PIXELUPComponents.SINFOTO_02,
  'NEXT_PUBLIC_CARD01_CONTENTBLOCK': PIXELUPComponents.CARD_01,
  'NEXT_PUBLIC_CARD02_CONTENTBLOCK': PIXELUPComponents.CARD_02,
  'NEXT_PUBLIC_CARD03_CONTENTBLOCK': PIXELUPComponents.CARD_03,
  'NEXT_PUBLIC_CARD04_CONTENTBLOCK': PIXELUPComponents.CARD_04,
  'NEXT_PUBLIC_SINFOTO04_CONTENTBLOCK': PIXELUPComponents.SINFOTO_04,
  'NEXT_PUBLIC_SINFOTO05_CONTENTBLOCK': PIXELUPComponents.SINFOTO_05,
  'NEXT_PUBLIC_BANNERPRINCIPAL01_ID': PIXELUPComponents.BANNER_PRINCIPAL_01,
  'NEXT_PUBLIC_BANNERPRINCIPAL02_ID': PIXELUPComponents.BANNER_PRINCIPAL_02,
  'NEXT_PUBLIC_BANNERPRINCIPAL03_ID': PIXELUPComponents.BANNER_PRINCIPAL_03,
  'NEXT_PUBLIC_BANNER_ABOUT_ID': PIXELUPComponents.BANNER_ABOUT,
  'NEXT_PUBLIC_BANNER_TIENDA_ID': PIXELUPComponents.BANNER_TIENDA,
  'NEXT_PUBLIC_CATEGORIA01_ID': PIXELUPComponents.CATEGORIA_01,
  'NEXT_PUBLIC_CATEGORIA02_ID': PIXELUPComponents.CATEGORIA_02,
  'NEXT_PUBLIC_CATEGORIA03_ID': PIXELUPComponents.CATEGORIA_03,
  'NEXT_PUBLIC_CATEGORIA04_ID': PIXELUPComponents.CATEGORIA_04,
  'NEXT_PUBLIC_CATEGORIA05_ID': PIXELUPComponents.CATEGORIA_05,
  'NEXT_PUBLIC_CATEGORIA06_ID': PIXELUPComponents.CATEGORIA_06,
  'NEXT_PUBLIC_CATEGORIA07_ID': PIXELUPComponents.CATEGORIA_07,
  'NEXT_PUBLIC_CATEGORIA08_ID': PIXELUPComponents.CATEGORIA_08,
  'NEXT_PUBLIC_CATEGORIA09_ID': PIXELUPComponents.CATEGORIA_09,
  'NEXT_PUBLIC_CATEGORIA10_ID': PIXELUPComponents.CATEGORIA_10,
  'NEXT_PUBLIC_GALERIA01_ID': PIXELUPComponents.GALERIA_01,
  'NEXT_PUBLIC_GALERIA02_ID': PIXELUPComponents.GALERIA_02,
  'NEXT_PUBLIC_UBICACION_ID': PIXELUPComponents.UBICACION,
  'NEXT_PUBLIC_UBICACION02_ID': PIXELUPComponents.UBICACION_02,
  'NEXT_PUBLIC_UBICACION03_ID': PIXELUPComponents.UBICACION_03,
  'NEXT_PUBLIC_UBICACION04_ID': PIXELUPComponents.UBICACION_04,
  'NEXT_PUBLIC_UBICACION05_ID': PIXELUPComponents.UBICACION_05,
  'NEXT_PUBLIC_MODALUBICACION04_ID': PIXELUPComponents.MODAL_UBICACION_04,
  'NEXT_PUBLIC_BLOGHOME_ID': PIXELUPComponents.BLOG_HOME,
  'NEXT_PUBLIC_BANNER_BLOG_ID': PIXELUPComponents.BANNER_BLOG,
  'NEXT_PUBLIC_PARALLAX_ID': PIXELUPComponents.PARALLAX,
  'NEXT_PUBLIC_FRASE01_ID': PIXELUPComponents.FRASE_01,
  'NEXT_PUBLIC_ABOUTMECONTENT_ID': PIXELUPComponents.ABOUT_ME_CONTENT,
  'NEXT_PUBLIC_SEO_BANNER_ID': PIXELUPComponents.SEO_BANNER,
  'NEXT_PUBLIC_FOOTER_BANNER_ID': PIXELUPComponents.FOOTER_BANNER,
  'NEXT_PUBLIC_LOGOEDIT_ID': PIXELUPComponents.LOGO_EDIT,
  'NEXT_PUBLIC_POPUP_BANNER_ID': CoreComponents.POPUP_BANNER,
  'NEXT_PUBLIC_POPUP_CONTENTBLOCK': CoreComponents.POPUP_CONTENTBLOCK,
};

/**
 * Convierte una variable de entorno a su enum correspondiente
 */
export function envToEnum(envVariable: string): PIXELUPComponents | CoreComponents | null {
  return ENV_TO_ENUM_MAPPING[envVariable] || null;
}

/**
 * Convierte un enum a su variable de entorno correspondiente
 */
export function enumToEnv(component: PIXELUPComponents | CoreComponents): string | null {
  const mapping = Object.entries(ENV_TO_ENUM_MAPPING).find(([_, enumValue]) => enumValue === component);
  return mapping ? mapping[0] : null;
}
