/**
 * Sistema de IDs de Componentes
 * Los IDs se generan dinámicamente via API y se actualizan aquí
 */

// Importar tipos
import { 
  ComponentData, 
} from './componentTypes';

// ========================================
// MAPEO CENTRALIZADO DE IDs POR ENTORNO
// ========================================

/**
 * Detecta el entorno actual
 */
const isProduction = process.env.NEXT_PUBLIC_ENVIRONMENT === 'production';

/**
 * Mapeo centralizado de todos los IDs de componentes
 * Cada componente es una función que retorna el ID correcto según el entorno
 */
export const COMPONENT_IDS = {
 
  'WHATSAPP_CONFIG': () => isProduction ? 'PROD_WHATSAPP_CONFIG_ID' : '123ebaa3-b59c-439b-82d5-2eb34c32d3e6',
  
  'CONTACT_FORM_BANNER': () => isProduction ? 'PROD_CONTACT_FORM_BANNER_ID' : '2dbe222e-1ad0-4b0f-a7c5-64582f9ca81c',
  'CONTACT_FORM_BANNER_IMG': () => isProduction ? 'PROD_CONTACT_FORM_BANNER_IMG_ID' : 'c627ff65-40cd-4134-bc16-adf1e1b4248b',
  


'SEO_BANNER': () => isProduction ? 'a049ec19-dd59-45dd-9e8a-2b1dd397d8d0' : '0edbeadf-d106-447a-8c79-05496418f6c4',
'SEO_BANNER_IMG': () => isProduction ? '5ea53ed2-9187-4710-a786-d359e500edc9' : '9982b08e-9c3d-4ac8-9cd1-57c569cadfbd',







  
  // Banner Principal
  'BANNER_PRINCIPAL_01': () => isProduction ? 'PROD_BANNER_PRINCIPAL_01_ID' : 'PENDING_ID',
  'BANNER_PRINCIPAL_02': () => isProduction ? 'PROD_BANNER_PRINCIPAL_02_ID' : 'PENDING_ID',
  'BANNER_PRINCIPAL_03': () => isProduction ? 'PROD_BANNER_PRINCIPAL_03_ID' : 'PENDING_ID',
  
  // Banner About
  'BANNER_ABOUT': () => isProduction ? 'PROD_BANNER_ABOUT_ID' : 'PENDING_ID',
  
  // Banner Tienda
  'BANNER_TIENDA': () => isProduction ? 'PROD_BANNER_TIENDA_ID' : 'PENDING_ID',
  
  // Banner Colección
  'BANNER_COLECCION': () => isProduction ? 'PROD_BANNER_COLECCION_ID' : 'PENDING_ID',
  
  // Categorías
  'CATEGORIA_01': () => isProduction ? 'PROD_CATEGORIA_01_ID' : 'PENDING_ID',
  'CATEGORIA_02': () => isProduction ? 'PROD_CATEGORIA_02_ID' : 'PENDING_ID',
  'CATEGORIA_03': () => isProduction ? 'PROD_CATEGORIA_03_ID' : 'PENDING_ID',
  'CATEGORIA_04': () => isProduction ? 'PROD_CATEGORIA_04_ID' : 'PENDING_ID',
  'CATEGORIA_05': () => isProduction ? 'PROD_CATEGORIA_05_ID' : 'PENDING_ID',
  'CATEGORIA_06': () => isProduction ? 'PROD_CATEGORIA_06_ID' : 'PENDING_ID',
  'CATEGORIA_07': () => isProduction ? 'PROD_CATEGORIA_07_ID' : 'PENDING_ID',
  'CATEGORIA_08': () => isProduction ? 'PROD_CATEGORIA_08_ID' : 'PENDING_ID',
  'CATEGORIA_09': () => isProduction ? 'PROD_CATEGORIA_09_ID' : 'PENDING_ID',
  'CATEGORIA_10': () => isProduction ? 'PROD_CATEGORIA_10_ID' : 'PENDING_ID',
  
  // Galerías
  'GALERIA_01': () => isProduction ? 'PROD_GALERIA_01_ID' : 'PENDING_ID',
  'GALERIA_02': () => isProduction ? 'PROD_GALERIA_02_ID' : 'PENDING_ID',
  
  // Ubicación
  'UBICACION': () => isProduction ? 'PROD_UBICACION_ID' : 'PENDING_ID',
  'UBICACION_02': () => isProduction ? 'PROD_UBICACION_02_ID' : 'PENDING_ID',
  'UBICACION_03': () => isProduction ? 'PROD_UBICACION_03_ID' : 'PENDING_ID',
  'UBICACION_04': () => isProduction ? 'PROD_UBICACION_04_ID' : 'PENDING_ID',
  'UBICACION_05': () => isProduction ? 'PROD_UBICACION_05_ID' : 'PENDING_ID',
  'MODAL_UBICACION_04': () => isProduction ? 'PROD_MODAL_UBICACION_04_ID' : 'PENDING_ID',
  
  // Blog
  'BLOG_HOME': () => isProduction ? 'PROD_BLOG_HOME_ID' : 'PENDING_ID',
  'BANNER_BLOG': () => isProduction ? 'PROD_BANNER_BLOG_ID' : 'PENDING_ID',
  
  // Parallax
  'PARALLAX': () => isProduction ? 'PROD_PARALLAX_ID' : 'PENDING_ID',
  
  // Navbar
  'NAVBAR_BANNER': () => isProduction ? 'PROD_NAVBAR_BANNER_ID' : 'PENDING_ID',
  
  // Sin Foto
  'SINFOTO_01': () => isProduction ? 'PROD_SINFOTO_01_ID' : 'PENDING_ID',
  'SINFOTO_02': () => isProduction ? 'PROD_SINFOTO_02_ID' : 'PENDING_ID',
  'SINFOTO_04': () => isProduction ? 'PROD_SINFOTO_04_ID' : 'PENDING_ID',
  'SINFOTO_05': () => isProduction ? 'PROD_SINFOTO_05_ID' : 'PENDING_ID',
  
  // Cards
  'CARD_01': () => isProduction ? 'PROD_CARD_01_ID' : 'PENDING_ID',
  'CARD_02': () => isProduction ? 'PROD_CARD_02_ID' : 'PENDING_ID',
  'CARD_03': () => isProduction ? 'PROD_CARD_03_ID' : 'PENDING_ID',
  'CARD_04': () => isProduction ? 'PROD_CARD_04_ID' : 'PENDING_ID',
  
  // Footer
  'FOOTER_BANNER': () => isProduction ? 'PROD_FOOTER_BANNER_ID' : 'PENDING_ID',
  
  // Logo
  'LOGO_EDIT': () => isProduction ? 'PROD_LOGO_EDIT_ID' : 'PENDING_ID',
  
  // Servicios
  'LISTA_SERVICIOS_01': () => isProduction ? 'PROD_LISTA_SERVICIOS_01_ID' : 'PENDING_ID',
  'LISTA_SERVICIOS_02': () => isProduction ? 'PROD_LISTA_SERVICIOS_02_ID' : 'PENDING_ID',
  'LISTA_SERVICIOS_03': () => isProduction ? 'PROD_LISTA_SERVICIOS_03_ID' : 'PENDING_ID',
  'LISTA_SERVICIOS_04': () => isProduction ? 'PROD_LISTA_SERVICIOS_04_ID' : 'PENDING_ID',
  
  // Nosotros
  'NOSOTROS_01': () => isProduction ? 'PROD_NOSOTROS_01_ID' : 'PENDING_ID',
  
  // Frases
  'FRASE_01': () => isProduction ? 'PROD_FRASE_01_ID' : 'PENDING_ID',
  
  // About Me
  'ABOUT_ME_CONTENT': () => isProduction ? 'PROD_ABOUT_ME_CONTENT_ID' : 'PENDING_ID',
  
  // Core Components
  'POPUP_BANNER': () => isProduction ? 'PROD_POPUP_BANNER_ID' : 'PENDING_ID',
  'POPUP_CONTENTBLOCK': () => isProduction ? 'PROD_POPUP_CONTENTBLOCK_ID' : 'PENDING_ID'
};

// ========================================
// TIPOS DERIVADOS
// ========================================

// Tipos derivados de COMPONENT_IDS para autocompletado
export type PIXELUPComponents = keyof typeof COMPONENT_IDS;
export type CoreComponents = 'POPUP_BANNER' | 'POPUP_CONTENTBLOCK';

// ========================================
// CONFIGURACIÓN DE DATOS POR DEFECTO
// ========================================

export const PIXELUP_COMPONENT_DATA: Record<string, ComponentData> = {
  // WhatsApp Config
  ['WHATSAPP_CONFIG']: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Configuración de WhatsApp',
      contentText: JSON.stringify({
        isActive: false,
        phoneNumber: "",
        message: "Hola, necesito información sobre sus productos"
      }, null, 2)
    }
  },

  // Contact Form Banner
  ['CONTACT_FORM_BANNER']: {
    type: 'banner',
    jsonStructure: 'simple',
    needsImage: true,
    defaultData: {
      title: 'Configuración del Formulario de Contacto',
      landingText: JSON.stringify({
        formTitle: "Envíanos un mensaje",
        submitButtonText: "Enviar mensaje",
        showContactInfo: true,
        contactInfoTitle: "Información de contacto",
        email: "contacto@casarenteria.cl",
        phone: "+56 9 7533 0640",
        emailLabelInfo: "Email",
        phoneLabelInfo: "Teléfono"
      }, null, 2),
      buttonText: "Enviar mensaje",
      buttonLink: "/contacto",
      mainImageLink: "https://pixelup.cl/default-contact.jpg",
      orderNumber: 1,
      mainImage: {
        name: "pixelup-contact-form.png",
        type: "image/png",
        size: 95,
        data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      }
    }
  },

  // Contact Form Banner Image
  ['CONTACT_FORM_BANNER_IMG']: {
    type: 'banner',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Imagen Formulario de Contacto',
      landingText: 'Imagen del formulario de contacto',
      buttonText: 'Enviar mensaje',
      buttonLink: '/contacto',
      mainImageLink: 'https://pixelup.cl/default-contact.jpg',
      orderNumber: 1,
      mainImage: {
        name: "pixelup-contact-form-image.png",
        type: "image/png",
        size: 95,
        data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      }
    }
  },

  // SEO
  ['SEO_BANNER']: {
    type: 'banner',
    jsonStructure: 'seo',
    needsImage: true,
    defaultData: {
      title: 'Optimización SEO - PixelUp',
      landingText: 'Optimización para buscadores',
      buttonText: 'Más información',
      buttonLink: '/seo',
      mainImageLink: 'https://pixelup.cl/default-seo.jpg',
      orderNumber: 1,
      mainImage: {
        name: "pixelup-seo-banner.png",
        type: "image/png",
        size: 95,
        data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
      }
    }
  },

  ['SEO_BANNER_IMG']: {
    type: 'banner',
    jsonStructure: 'seo',
    defaultData: {
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

  // Banner Principal
  ['BANNER_PRINCIPAL_01']: {
    type: 'banner',
    jsonStructure: 'bannerPrincipal',
    defaultData: {
      title: 'Banner Principal 01',
      landingText: 'Banner principal de la página',
      buttonText: 'Ver más',
      buttonLink: '/',
      mainImageLink: 'https://pixelup.cl/default-banner.jpg',
      orderNumber: 1
    }
  },
  ['BANNER_PRINCIPAL_02']: {
    type: 'banner',
    jsonStructure: 'bannerPrincipal',
    defaultData: {
      title: 'Banner Principal 02',
      landingText: 'Banner principal de la página',
      buttonText: 'Ver más',
      buttonLink: '/',
      mainImageLink: 'https://pixelup.cl/default-banner.jpg',
      orderNumber: 2
    }
  },
  ['BANNER_PRINCIPAL_03']: {
    type: 'banner',
    jsonStructure: 'bannerPrincipal',
    defaultData: {
      title: 'Banner Principal 03',
      landingText: 'Banner principal de la página',
      buttonText: 'Ver más',
      buttonLink: '/',
      mainImageLink: 'https://pixelup.cl/default-banner.jpg',
      orderNumber: 3
    }
  },

  // Banner About
  ['BANNER_ABOUT']: {
    type: 'banner',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Banner About',
      landingText: 'Sobre nosotros',
      buttonText: 'Conoce más',
      buttonLink: '/nosotros',
      mainImageLink: 'https://pixelup.cl/default-about.jpg',
      orderNumber: 1
    }
  },

  // Banner Tienda
  ['BANNER_TIENDA']: {
    type: 'banner',
    jsonStructure: 'categoria',
    defaultData: {
      title: 'Banner Tienda',
      landingText: 'Nuestra tienda',
      buttonText: 'Ver productos',
      buttonLink: '/tienda',
      mainImageLink: 'https://pixelup.cl/default-store.jpg',
      orderNumber: 1
    }
  },

  // Banner Colección
  ['BANNER_COLECCION']: {
    type: 'banner',
    jsonStructure: 'categoria',
    defaultData: {
      title: 'Banner Colección',
      landingText: 'Nuestras colecciones',
      buttonText: 'Ver colecciones',
      buttonLink: '/colecciones',
      mainImageLink: 'https://pixelup.cl/default-collection.jpg',
      orderNumber: 1
    }
  },

  // Categorías
  ['CATEGORIA_01']: {
    type: 'banner',
    jsonStructure: 'categoria',
    defaultData: {
      title: 'Categoría 01',
      landingText: 'Categoría de productos',
      buttonText: 'Ver productos',
      buttonLink: '/categoria/01',
      mainImageLink: 'https://pixelup.cl/default-category.jpg',
      orderNumber: 1
    }
  },
  ['CATEGORIA_02']: {
    type: 'banner',
    jsonStructure: 'categoria',
    defaultData: {
      title: 'Categoría 02',
      landingText: 'Categoría de productos',
      buttonText: 'Ver productos',
      buttonLink: '/categoria/02',
      mainImageLink: 'https://pixelup.cl/default-category.jpg',
      orderNumber: 2
    }
  },
  ['CATEGORIA_03']: {
    type: 'banner',
    jsonStructure: 'categoria',
    defaultData: {
      title: 'Categoría 03',
      landingText: 'Categoría de productos',
      buttonText: 'Ver productos',
      buttonLink: '/categoria/03',
      mainImageLink: 'https://pixelup.cl/default-category.jpg',
      orderNumber: 3
    }
  },
  ['CATEGORIA_04']: {
    type: 'banner',
    jsonStructure: 'categoria',
    defaultData: {
      title: 'Categoría 04',
      landingText: 'Categoría de productos',
      buttonText: 'Ver productos',
      buttonLink: '/categoria/04',
      mainImageLink: 'https://pixelup.cl/default-category.jpg',
      orderNumber: 4
    }
  },
  ['CATEGORIA_05']: {
    type: 'banner',
    jsonStructure: 'categoria',
    defaultData: {
      title: 'Categoría 05',
      landingText: 'Categoría de productos',
      buttonText: 'Ver productos',
      buttonLink: '/categoria/05',
      mainImageLink: 'https://pixelup.cl/default-category.jpg',
      orderNumber: 5
    }
  },
  ['CATEGORIA_06']: {
    type: 'banner',
    jsonStructure: 'categoria',
    defaultData: {
      title: 'Categoría 06',
      landingText: 'Categoría de productos',
      buttonText: 'Ver productos',
      buttonLink: '/categoria/06',
      mainImageLink: 'https://pixelup.cl/default-category.jpg',
      orderNumber: 6
    }
  },
  ['CATEGORIA_07']: {
    type: 'banner',
    jsonStructure: 'categoria',
    defaultData: {
      title: 'Categoría 07',
      landingText: 'Categoría de productos',
      buttonText: 'Ver productos',
      buttonLink: '/categoria/07',
      mainImageLink: 'https://pixelup.cl/default-category.jpg',
      orderNumber: 7
    }
  },
  ['CATEGORIA_08']: {
    type: 'banner',
    jsonStructure: 'categoria',
    defaultData: {
      title: 'Categoría 08',
      landingText: 'Categoría de productos',
      buttonText: 'Ver productos',
      buttonLink: '/categoria/08',
      mainImageLink: 'https://pixelup.cl/default-category.jpg',
      orderNumber: 8
    }
  },
  ['CATEGORIA_09']: {
    type: 'banner',
    jsonStructure: 'categoria',
    defaultData: {
      title: 'Categoría 09',
      landingText: 'Categoría de productos',
      buttonText: 'Ver productos',
      buttonLink: '/categoria/09',
      mainImageLink: 'https://pixelup.cl/default-category.jpg',
      orderNumber: 9
    }
  },
  ['CATEGORIA_10']: {
    type: 'banner',
    jsonStructure: 'categoria',
    defaultData: {
      title: 'Categoría 10',
      landingText: 'Categoría de productos',
      buttonText: 'Ver productos',
      buttonLink: '/categoria/10',
      mainImageLink: 'https://pixelup.cl/default-category.jpg',
      orderNumber: 10
    }
  },

  // Galerías
  ['GALERIA_01']: {
    type: 'banner',
    jsonStructure: 'galeria',
    defaultData: {
      title: 'Galería 01',
      landingText: 'Galería de imágenes',
      buttonText: 'Ver galería',
      buttonLink: '/galeria/01',
      mainImageLink: 'https://pixelup.cl/default-gallery.jpg',
      orderNumber: 1
    }
  },
  ['GALERIA_02']: {
    type: 'banner',
    jsonStructure: 'galeria',
    defaultData: {
      title: 'Galería 02',
      landingText: 'Galería de imágenes',
      buttonText: 'Ver galería',
      buttonLink: '/galeria/02',
      mainImageLink: 'https://pixelup.cl/default-gallery.jpg',
      orderNumber: 2
    }
  },

  // Ubicación
  ['UBICACION']: {
    type: 'banner',
    jsonStructure: 'ubicacion',
    defaultData: {
      title: 'Ubicación',
      landingText: 'Nuestra ubicación',
      buttonText: 'Ver mapa',
      buttonLink: '/ubicacion',
      mainImageLink: 'https://pixelup.cl/default-location.jpg',
      orderNumber: 1
    }
  },
  ['UBICACION_02']: {
    type: 'banner',
    jsonStructure: 'ubicacion',
    defaultData: {
      title: 'Ubicación 02',
      landingText: 'Nuestra ubicación',
      buttonText: 'Ver mapa',
      buttonLink: '/ubicacion',
      mainImageLink: 'https://pixelup.cl/default-location.jpg',
      orderNumber: 2
    }
  },
  ['UBICACION_03']: {
    type: 'banner',
    jsonStructure: 'ubicacion',
    defaultData: {
      title: 'Ubicación 03',
      landingText: 'Nuestra ubicación',
      buttonText: 'Ver mapa',
      buttonLink: '/ubicacion',
      mainImageLink: 'https://pixelup.cl/default-location.jpg',
      orderNumber: 3
    }
  },
  ['UBICACION_04']: {
    type: 'banner',
    jsonStructure: 'ubicacion',
    defaultData: {
      title: 'Ubicación 04',
      landingText: 'Nuestra ubicación',
      buttonText: 'Ver mapa',
      buttonLink: '/ubicacion',
      mainImageLink: 'https://pixelup.cl/default-location.jpg',
      orderNumber: 4
    }
  },
  ['UBICACION_05']: {
    type: 'banner',
    jsonStructure: 'ubicacion',
    defaultData: {
      title: 'Ubicación 05',
      landingText: 'Nuestra ubicación',
      buttonText: 'Ver mapa',
      buttonLink: '/ubicacion',
      mainImageLink: 'https://pixelup.cl/default-location.jpg',
      orderNumber: 5
    }
  },
  ['MODAL_UBICACION_04']: {
    type: 'banner',
    jsonStructure: 'ubicacion',
    defaultData: {
      title: 'Modal Ubicación 04',
      landingText: 'Modal de ubicación',
      buttonText: 'Cerrar',
      buttonLink: '#',
      mainImageLink: 'https://pixelup.cl/default-location.jpg',
      orderNumber: 1
    }
  },

  // Blog
  ['BLOG_HOME']: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Blog Home',
      contentText: 'Contenido del blog principal'
    }
  },
  ['BANNER_BLOG']: {
    type: 'banner',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Banner Blog',
      landingText: 'Nuestro blog',
      buttonText: 'Leer más',
      buttonLink: '/blog',
      mainImageLink: 'https://pixelup.cl/default-blog.jpg',
      orderNumber: 1
    }
  },

  // Parallax
  ['PARALLAX']: {
    type: 'banner',
    jsonStructure: 'hero',
    defaultData: {
      title: 'Parallax',
      landingText: 'Efecto parallax',
      buttonText: 'Ver más',
      buttonLink: '/',
      mainImageLink: 'https://pixelup.cl/default-parallax.jpg',
      orderNumber: 1
    }
  },

  // Navbar
  ['NAVBAR_BANNER']: {
    type: 'banner',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Navbar Banner',
      landingText: 'Banner de navegación',
      buttonText: 'Ver más',
      buttonLink: '/',
      mainImageLink: 'https://pixelup.cl/default-navbar.jpg',
      orderNumber: 1
    }
  },

  // Sin Foto
  ['SINFOTO_01']: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Sin Foto 01',
      contentText: 'Contenido sin imagen'
    }
  },
  ['SINFOTO_02']: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Sin Foto 02',
      contentText: 'Contenido sin imagen'
    }
  },
  ['SINFOTO_04']: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Sin Foto 04',
      contentText: 'Contenido sin imagen'
    }
  },
  ['SINFOTO_05']: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Sin Foto 05',
      contentText: 'Contenido sin imagen'
    }
  },

  // Cards
  ['CARD_01']: {
    type: 'banner',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Card 01',
      landingText: 'Tarjeta informativa',
      buttonText: 'Ver más',
      buttonLink: '/',
      mainImageLink: 'https://pixelup.cl/default-card.jpg',
      orderNumber: 1
    }
  },
  ['CARD_02']: {
    type: 'banner',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Card 02',
      landingText: 'Tarjeta informativa',
      buttonText: 'Ver más',
      buttonLink: '/',
      mainImageLink: 'https://pixelup.cl/default-card.jpg',
      orderNumber: 2
    }
  },
  ['CARD_03']: {
    type: 'banner',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Card 03',
      landingText: 'Tarjeta informativa',
      buttonText: 'Ver más',
      buttonLink: '/',
      mainImageLink: 'https://pixelup.cl/default-card.jpg',
      orderNumber: 3
    }
  },
  ['CARD_04']: {
    type: 'banner',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Card 04',
      landingText: 'Tarjeta informativa',
      buttonText: 'Ver más',
      buttonLink: '/',
      mainImageLink: 'https://pixelup.cl/default-card.jpg',
      orderNumber: 4
    }
  },

  // Footer
  ['FOOTER_BANNER']: {
    type: 'banner',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Footer Banner',
      landingText: 'Banner del pie de página',
      buttonText: 'Ver más',
      buttonLink: '/',
      mainImageLink: 'https://pixelup.cl/default-footer.jpg',
      orderNumber: 1
    }
  },

  // Logo
  ['LOGO_EDIT']: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Logo Edit',
      contentText: 'Configuración del logo'
    }
  },

  // Servicios
  ['LISTA_SERVICIOS_01']: {
    type: 'banner',
    jsonStructure: 'servicios',
    defaultData: {
      title: 'Lista Servicios 01',
      landingText: 'Nuestros servicios',
      buttonText: 'Ver servicios',
      buttonLink: '/servicios',
      mainImageLink: 'https://pixelup.cl/default-services.jpg',
      orderNumber: 1
    }
  },
  ['LISTA_SERVICIOS_02']: {
    type: 'banner',
    jsonStructure: 'servicios',
    defaultData: {
      title: 'Lista Servicios 02',
      landingText: 'Nuestros servicios',
      buttonText: 'Ver servicios',
      buttonLink: '/servicios',
      mainImageLink: 'https://pixelup.cl/default-services.jpg',
      orderNumber: 2
    }
  },
  ['LISTA_SERVICIOS_03']: {
    type: 'banner',
    jsonStructure: 'servicios',
    defaultData: {
      title: 'Lista Servicios 03',
      landingText: 'Nuestros servicios',
      buttonText: 'Ver servicios',
      buttonLink: '/servicios',
      mainImageLink: 'https://pixelup.cl/default-services.jpg',
      orderNumber: 3
    }
  },
  ['LISTA_SERVICIOS_04']: {
    type: 'banner',
    jsonStructure: 'servicios',
    defaultData: {
      title: 'Lista Servicios 04',
      landingText: 'Nuestros servicios',
      buttonText: 'Ver servicios',
      buttonLink: '/servicios',
      mainImageLink: 'https://pixelup.cl/default-services.jpg',
      orderNumber: 4
    }
  },

  // Nosotros
  ['NOSOTROS_01']: {
    type: 'banner',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Nosotros 01',
      landingText: 'Sobre nosotros',
      buttonText: 'Conoce más',
      buttonLink: '/nosotros',
      mainImageLink: 'https://pixelup.cl/default-about.jpg',
      orderNumber: 1
    }
  },

  // Frases
  ['FRASE_01']: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Frase 01',
      contentText: 'Frase inspiradora'
    }
  },

  // About Me
  ['ABOUT_ME_CONTENT']: {
    type: 'contentBlock',
    jsonStructure: 'simple',
    defaultData: {
      title: 'About Me Content',
      contentText: 'Contenido sobre mí'
    }
  }
};

export const CORE_COMPONENT_DATA: Record<CoreComponents, ComponentData> = {
  // Popup
  'POPUP_BANNER': {
    type: 'banner',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Popup Banner',
      landingText: 'Oferta especial',
      buttonText: 'Aceptar',
      buttonLink: '#',
      mainImageLink: 'https://pixelup.cl/default-popup.jpg',
      orderNumber: 1
    }
  },
  
  'POPUP_CONTENTBLOCK': {
    type: 'contentBlock',
    jsonStructure: 'simple',
    defaultData: {
      title: 'Configuración Popup',
      contentText: '{"enabled": false, "delay": 5000, "showOnce": true}'
    }
  }
};






