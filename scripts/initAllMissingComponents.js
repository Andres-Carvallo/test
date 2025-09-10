const axios = require("axios");

/**
 * Comprehensive script to initialize ALL missing components from migrateToEnums.js
 * This creates all the components that were identified as missing from the automation
 */

// Import individual init scripts
const { initNavbarConfig } = require("./initNavbarConfig");
const { initAboutUsConfig } = require("./initAboutUsConfig");
const { initServicesListConfig } = require("./initServicesListConfig");
const { initSinFotoConfig } = require("./initSinFotoConfig");

const generatedIds = {};

function logInfo(message) {
  console.log(`ℹ️  ${message}`);
}

function logSuccess(message) {
  console.log(`✅ ${message}`);
}

function logError(message, error = null) {
  console.error(`❌ ${message}`);
  if (error) console.error(`   ${error}`);
}

// Create banners helper function
async function createBanner(siteId, apiUrl, config) {
  try {
    const response = await axios.post(`${apiUrl}/api/v1/banners?siteId=${siteId}`, {
      title: config.title,
      landingText: JSON.stringify(config.content || config, null, 2),
      buttonText: config.buttonText || "Ver más",
      buttonLink: config.buttonLink || "/",
      mainImage: config.mainImage || {
        name: `${config.key || 'default'}-image.jpg`,
        type: "image/jpeg",
        size: 100,
        data: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      },
      isActive: true,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data.code === 0) {
      const bannerId = response.data.banner?.id || response.data.id;
      logSuccess(`${config.title} created: ${bannerId}`);
      return bannerId;
    } else {
      throw new Error(response.data.message || 'Failed to create banner');
    }
  } catch (error) {
    logError(`Failed to create banner ${config.title}`, error.message);
    return null;
  }
}

// Create content blocks helper function
async function createContentBlock(siteId, apiUrl, config) {
  try {
    const response = await axios.post(`${apiUrl}/api/v1/content-blocks?siteId=${siteId}`, {
      title: config.title,
      contentText: JSON.stringify(config.content || config, null, 2),
      type: config.type || 'general',
      isActive: true,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data.code === 0) {
      const contentId = response.data.contentBlock?.id || response.data.id;
      logSuccess(`${config.title} content block created: ${contentId}`);
      return contentId;
    } else {
      throw new Error(response.data.message || 'Failed to create content block');
    }
  } catch (error) {
    logError(`Failed to create content block ${config.title}`, error.message);
    return null;
  }
}

// Generate additional principal banners
async function generateAdditionalPrincipalBanners(siteId, apiUrl) {
  logInfo("Generating additional principal banners...");
  
  const banners = [
    {
      key: 'bannerPrincipal02',
      title: 'Banner Principal 02',
      content: {
        heading: 'Segundo Banner Principal',
        description: 'Banner secundario para destacar ofertas especiales',
        ctaText: 'Ver ofertas'
      },
      buttonText: 'Ver ofertas',
      buttonLink: '/ofertas'
    },
    {
      key: 'bannerPrincipal03', 
      title: 'Banner Principal 03',
      content: {
        heading: 'Tercer Banner Principal',
        description: 'Banner terciario para promociones destacadas',
        ctaText: 'Explorar'
      },
      buttonText: 'Explorar',
      buttonLink: '/productos'
    }
  ];

  for (const banner of banners) {
    const bannerId = await createBanner(siteId, apiUrl, banner);
    if (bannerId) {
      generatedIds[banner.key] = bannerId;
    }
  }
}

// Generate special banners
async function generateSpecialBanners(siteId, apiUrl) {
  logInfo("Generating special banners...");
  
  const banners = [
    {
      key: 'bannerAbout',
      title: 'Banner About',
      content: {
        heading: 'Conoce Nuestra Historia',
        description: 'Descubre quiénes somos y qué nos motiva',
        backgroundType: 'image'
      },
      buttonText: 'Conocer más',
      buttonLink: '/nosotros'
    },
    {
      key: 'bannerTienda',
      title: 'Banner Tienda',
      content: {
        heading: 'Explora Nuestra Tienda',
        description: 'Descubre todos nuestros productos',
        showSearchBar: true
      },
      buttonText: 'Ver productos',
      buttonLink: '/tienda'
    },
    {
      key: 'bannerBlog',
      title: 'Banner Blog',
      content: {
        heading: 'Nuestro Blog',
        description: 'Artículos, noticias y consejos útiles',
        showCategories: true
      },
      buttonText: 'Leer artículos',
      buttonLink: '/blog'
    },
    {
      key: 'seoBanner',
      title: 'SEO Banner',
      content: {
        metaTitle: 'Tu tienda online',
        metaDescription: 'Los mejores productos al mejor precio',
        keywords: ['productos', 'tienda', 'online', 'calidad']
      },
      buttonText: 'Explorar',
      buttonLink: '/'
    }
  ];

  for (const banner of banners) {
    const bannerId = await createBanner(siteId, apiUrl, banner);
    if (bannerId) {
      generatedIds[banner.key] = bannerId;
    }
  }
}

// Generate extended categories
async function generateExtendedCategories(siteId, apiUrl) {
  logInfo("Generating extended categories (08-10)...");
  
  const categories = [
    'Automotive', 'Art & Crafts', 'Pet Supplies'
  ];

  for (let i = 8; i <= 10; i++) {
    const categoryName = categories[i - 8];
    const bannerId = await createBanner(siteId, apiUrl, {
      title: `Categoría ${i}: ${categoryName}`,
      content: {
        categoryName,
        description: `Explora nuestra colección de ${categoryName}`,
        showProductCount: true
      },
      buttonText: "Ver categoría",
      buttonLink: `/tienda/categoria-${i}`,
      key: `categoria${String(i).padStart(2, '0')}`
    });

    if (bannerId) {
      generatedIds[`categoria${String(i).padStart(2, '0')}`] = bannerId;
      generatedIds[`categoria${String(i).padStart(2, '0')}Img`] = bannerId + '-img';
    }
  }
}

// Generate gallery components
async function generateGalleryComponents(siteId, apiUrl) {
  logInfo("Generating gallery components...");
  
  const galleries = [
    {
      key: 'galeria01',
      title: 'Galería 01',
      content: {
        galleryType: 'grid',
        columns: 3,
        showThumbnails: true,
        images: [],
        autoPlay: false
      }
    },
    {
      key: 'galeria02',
      title: 'Galería 02', 
      content: {
        galleryType: 'carousel',
        showDots: true,
        showArrows: true,
        images: [],
        autoPlay: true,
        autoPlaySpeed: 3000
      }
    }
  ];

  for (const gallery of galleries) {
    const bannerId = await createBanner(siteId, apiUrl, gallery);
    if (bannerId) {
      generatedIds[gallery.key] = bannerId;
    }
  }
}

// Generate extended location components
async function generateExtendedLocationComponents(siteId, apiUrl) {
  logInfo("Generating extended location components...");
  
  const locations = [
    {
      key: 'ubicacion02',
      title: 'Ubicación 02',
      content: {
        locationType: 'sucursal',
        address: 'Dirección sucursal 2',
        phone: '+56 9 XXXX XXXX',
        hours: 'Lun-Vie: 9:00-18:00',
        hasParking: true
      }
    },
    {
      key: 'ubicacion03',
      title: 'Ubicación 03',
      content: {
        locationType: 'bodega',
        address: 'Dirección bodega principal',
        contactPerson: 'Encargado de bodega',
        phone: '+56 9 YYYY YYYY'
      }
    },
    {
      key: 'ubicacion04',
      title: 'Ubicación 04',
      content: {
        locationType: 'punto_retiro',
        address: 'Punto de retiro',
        instructions: 'Instrucciones para retiro',
        schedules: ['Lunes 9-17', 'Martes 9-17']
      }
    },
    {
      key: 'ubicacion05',
      title: 'Ubicación 05',
      content: {
        locationType: 'virtual',
        description: 'Tienda online',
        supportChannels: ['email', 'chat', 'whatsapp']
      }
    },
    {
      key: 'modalUbicacion04',
      title: 'Modal Ubicación 04',
      content: {
        modalType: 'location_details',
        showMap: true,
        showDirections: true,
        allowBooking: false
      }
    }
  ];

  for (const location of locations) {
    const contentId = await createContentBlock(siteId, apiUrl, {
      title: location.title,
      content: location.content,
      type: 'location'
    });
    
    if (contentId) {
      generatedIds[location.key] = contentId;
    }
  }
}

// Generate blog components
async function generateBlogComponents(siteId, apiUrl) {
  logInfo("Generating blog components...");
  
  const blogConfig = {
    title: 'Blog Home',
    content: {
      featuredPosts: 3,
      showCategories: true,
      showTags: true,
      postsPerPage: 6,
      showAuthor: true,
      showDate: true,
      showExcerpt: true
    },
    type: 'blog-home'
  };

  const contentId = await createContentBlock(siteId, apiUrl, blogConfig);
  if (contentId) {
    generatedIds.blogHome = contentId;
  }
}

// Generate special effect components
async function generateSpecialEffectComponents(siteId, apiUrl) {
  logInfo("Generating special effect components...");
  
  const components = [
    {
      key: 'parallax',
      title: 'Parallax',
      content: {
        effectType: 'parallax',
        backgroundImage: '',
        overlayOpacity: 0.5,
        scrollSpeed: 0.5,
        height: '60vh'
      }
    },
    {
      key: 'frase01',
      title: 'Frase 01',
      content: {
        quote: 'La calidad no es un acto, es un hábito',
        author: 'Aristóteles',
        showAuthor: true,
        alignment: 'center',
        fontSize: 'large'
      }
    },
    {
      key: 'aboutMeContent',
      title: 'About Me Content',
      content: {
        personalInfo: {
          name: 'Fundador',
          position: 'CEO & Fundador',
          bio: 'Breve biografía del fundador de la empresa'
        },
        showSocialLinks: true,
        showCV: false
      }
    },
    {
      key: 'footerBanner',
      title: 'Footer Banner',
      content: {
        bannerType: 'newsletter',
        heading: 'Suscríbete a nuestro newsletter',
        description: 'Recibe ofertas exclusivas y novedades',
        showSubscribeForm: true
      }
    },
    {
      key: 'logoEdit',
      title: 'Logo Edit',
      content: {
        logoVariants: ['main', 'dark', 'light', 'mobile'],
        allowCustomization: true,
        formats: ['png', 'svg', 'webp']
      }
    }
  ];

  for (const component of components) {
    const bannerId = await createBanner(siteId, apiUrl, component);
    if (bannerId) {
      generatedIds[component.key] = bannerId;
    }
  }
}

// Generate card components
async function generateCardComponents(siteId, apiUrl) {
  logInfo("Generating card components...");
  
  const cards = [
    {
      key: 'card01',
      title: 'Card 01',
      content: {
        cardType: 'feature',
        title: 'Característica Destacada 1',
        description: 'Descripción de la primera característica',
        icon: 'star',
        linkUrl: '/feature-1'
      }
    },
    {
      key: 'card02',
      title: 'Card 02',
      content: {
        cardType: 'service',
        title: 'Servicio Principal 1',
        description: 'Descripción del primer servicio',
        icon: 'service',
        linkUrl: '/servicio-1'
      }
    },
    {
      key: 'card03',
      title: 'Card 03',
      content: {
        cardType: 'testimonial',
        title: 'Testimonio Cliente',
        description: 'Opinión de cliente satisfecho',
        author: 'Cliente Satisfecho',
        rating: 5
      }
    },
    {
      key: 'card04',
      title: 'Card 04',
      content: {
        cardType: 'cta',
        title: 'Llamada a la Acción',
        description: 'Invitación para contactar o comprar',
        buttonText: 'Contactar',
        buttonUrl: '/contacto'
      }
    }
  ];

  for (const card of cards) {
    const contentId = await createContentBlock(siteId, apiUrl, {
      title: card.title,
      content: card.content,
      type: 'card'
    });
    
    if (contentId) {
      generatedIds[card.key] = contentId;
    }
  }
}

// Generate popup components  
async function generatePopupComponents(siteId, apiUrl) {
  logInfo("Generating popup components...");
  
  // Popup Banner
  const popupBannerId = await createBanner(siteId, apiUrl, {
    title: 'Popup Banner',
    content: {
      popupType: 'promotional',
      heading: '¡Oferta Especial!',
      description: 'Descuento del 20% en tu primera compra',
      showCloseButton: true,
      autoClose: false,
      displayDelay: 3000
    },
    buttonText: 'Aprovechar oferta',
    buttonLink: '/ofertas',
    key: 'popupBanner'
  });

  if (popupBannerId) {
    generatedIds.popupBanner = popupBannerId;
  }

  // Popup Content Block
  const popupContentId = await createContentBlock(siteId, apiUrl, {
    title: 'Popup Content Block',
    content: {
      contentType: 'newsletter_signup',
      heading: 'Mantente informado',
      description: 'Suscríbete para recibir ofertas exclusivas',
      fields: ['email'],
      showPrivacyNote: true
    },
    type: 'popup-content'
  });

  if (popupContentId) {
    generatedIds.popupContentBlock = popupContentId;
  }
}

// Main function to generate all missing components
async function initAllMissingComponents() {
  try {
    console.log("🚀 Inicializando TODOS los componentes faltantes...");

    const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE;

    if (!siteId || !apiUrl) {
      logError("Faltan variables de entorno necesarias");
      console.log("Asegúrate de tener configuradas:");
      console.log("- NEXT_PUBLIC_API_URL_SITEID");
      console.log("- NEXT_PUBLIC_API_URL_BO_CLIENTE");
      return {};
    }

    console.log(`🌐 Site ID: ${siteId}`);
    console.log("=" .repeat(60));

    // Run all individual init scripts first
    logInfo("Ejecutando scripts de inicialización individuales...");
    
    try {
      await initNavbarConfig();
    } catch (error) {
      logError("Error en initNavbarConfig", error.message);
    }

    try {
      await initAboutUsConfig();
    } catch (error) {
      logError("Error en initAboutUsConfig", error.message);
    }

    try {
      await initServicesListConfig();
    } catch (error) {
      logError("Error en initServicesListConfig", error.message);
    }

    try {
      await initSinFotoConfig();
    } catch (error) {
      logError("Error en initSinFotoConfig", error.message);
    }

    // Generate all additional components
    await generateAdditionalPrincipalBanners(siteId, apiUrl);
    await generateSpecialBanners(siteId, apiUrl);
    await generateExtendedCategories(siteId, apiUrl);
    await generateGalleryComponents(siteId, apiUrl);
    await generateExtendedLocationComponents(siteId, apiUrl);
    await generateBlogComponents(siteId, apiUrl);
    await generateSpecialEffectComponents(siteId, apiUrl);
    await generateCardComponents(siteId, apiUrl);
    await generatePopupComponents(siteId, apiUrl);

    console.log("\n" + "=".repeat(60));
    logSuccess("TODOS los componentes faltantes han sido inicializados!");
    
    console.log(`\n📊 Resumen de componentes generados:`);
    console.log(`   - Total de IDs generados: ${Object.keys(generatedIds).length}`);
    
    if (Object.keys(generatedIds).length > 0) {
      console.log(`\n📋 IDs generados:`);
      Object.entries(generatedIds).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }

    return generatedIds;

  } catch (error) {
    logError("Error general al inicializar componentes faltantes", error.message);
    return {};
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initAllMissingComponents();
}

module.exports = { 
  initAllMissingComponents,
  generateAdditionalPrincipalBanners,
  generateSpecialBanners,
  generateExtendedCategories,
  generateGalleryComponents,
  generateExtendedLocationComponents,
  generateBlogComponents,
  generateSpecialEffectComponents,
  generateCardComponents,
  generatePopupComponents
};
