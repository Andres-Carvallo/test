const axios = require("axios");

const defaultNavbarConfig = {
  showNavbarBanner: true,
  bannerTitle: "¡Oferta especial!",
  bannerText: "Envío gratis en compras sobre $50.000",
  bannerButtonText: "Ver ofertas",
  bannerButtonLink: "/ofertas",
  bannerPosition: "top", // top, bottom
  bannerType: "promotion", // promotion, announcement, warning
  bannerColor: "#f59e0b",
  bannerTextColor: "#ffffff",
  showCloseButton: true,
  autoHide: false,
  autoHideDelay: 5000
};

async function initNavbarConfig() {
  try {
    console.log("🚀 Inicializando configuración del navbar...");

    const bannerId = process.env.NEXT_PUBLIC_NAVBARBANNER_ID || "navbar-banner-default";
    const bannerImageId = process.env.NEXT_PUBLIC_NAVBARBANNER_IMGID || "navbar-banner-img-default";
    const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE;

    if (!siteId || !apiUrl) {
      console.error("❌ Error: Faltan variables de entorno necesarias");
      console.log("Asegúrate de tener configuradas:");
      console.log("- NEXT_PUBLIC_API_URL_SITEID");
      console.log("- NEXT_PUBLIC_API_URL_BO_CLIENTE");
      return;
    }

    console.log(`📝 Banner ID: ${bannerId}`);
    console.log(`🖼️  Banner Image ID: ${bannerImageId}`);
    console.log(`🌐 Site ID: ${siteId}`);

    // Verificar si ya existe el banner principal
    try {
      const checkResponse = await axios.get(
        `${apiUrl}/api/v1/banners/${bannerId}?siteId=${siteId}`
      );

      if (checkResponse.data.banner) {
        console.log("⚠️  El banner del navbar ya existe");
        console.log("Saltando inicialización para evitar sobrescribir configuración existente");
        return;
      }
    } catch (error) {
      console.log("✅ No existe banner previo, procediendo con la inicialización...");
    }

    // Crear el banner principal
    const response = await axios.post(
      `${apiUrl}/api/v1/banners?siteId=${siteId}`,
      {
        title: "Banner Navbar",
        landingText: JSON.stringify(defaultNavbarConfig, null, 2),
        buttonText: defaultNavbarConfig.bannerButtonText,
        buttonLink: defaultNavbarConfig.bannerButtonLink,
        mainImage: {
          name: "navbar-banner-image.jpg",
          type: "image/jpeg",
          size: 100,
          data: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        },
        isActive: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.code === 0) {
      console.log("✅ Banner del navbar inicializado exitosamente");
      console.log("📋 Configuración por defecto:");
      console.log(JSON.stringify(defaultNavbarConfig, null, 2));
      console.log("🔧 Banner ID generado:", response.data.banner?.id);
      console.log("📝 Actualiza el NEXT_PUBLIC_NAVBARBANNER_ID con el valor generado");
    } else {
      console.error("❌ Error al inicializar banner del navbar");
      console.error("Respuesta:", response.data);
    }
  } catch (error) {
    console.error(
      "❌ Error al inicializar banner del navbar:",
      error.response?.data || error.message
    );
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initNavbarConfig();
}

module.exports = { initNavbarConfig };
