const axios = require("axios");

const defaultAboutUsConfig = {
  sectionTitle: "Nosotros",
  subtitle: "Conoce nuestra historia",
  description: "Somos una empresa comprometida con la excelencia y la satisfacción de nuestros clientes. Con años de experiencia en el mercado, ofrecemos productos de la más alta calidad.",
  mission: "Proporcionar productos excepcionales que mejoren la vida de nuestros clientes.",
  vision: "Ser líderes en nuestro sector, reconocidos por nuestra innovación y compromiso.",
  values: [
    "Calidad en todo lo que hacemos",
    "Compromiso con nuestros clientes",
    "Innovación constante",
    "Responsabilidad social"
  ],
  showTeamSection: true,
  teamTitle: "Nuestro Equipo",
  showStats: true,
  stats: [
    { label: "Años de experiencia", value: "10+" },
    { label: "Clientes satisfechos", value: "1000+" },
    { label: "Productos", value: "500+" },
    { label: "Ciudades", value: "15+" }
  ]
};

async function initAboutUsConfig() {
  try {
    console.log("🚀 Inicializando configuración de Nosotros...");

    const bannerId = process.env.NEXT_PUBLIC_NOSOTROS01_ID || "nosotros-01-default";
    const bannerImageId = process.env.NEXT_PUBLIC_NOSOTROS01_IMGID || "nosotros-01-img-default";
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

    // Verificar si ya existe el banner
    try {
      const checkResponse = await axios.get(
        `${apiUrl}/api/v1/banners/${bannerId}?siteId=${siteId}`
      );

      if (checkResponse.data.banner) {
        console.log("⚠️  El banner de Nosotros ya existe");
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
        title: "Nosotros - Sección Principal",
        landingText: JSON.stringify(defaultAboutUsConfig, null, 2),
        buttonText: "Conocer más",
        buttonLink: "/nosotros",
        mainImage: {
          name: "nosotros-main-image.jpg",
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
      console.log("✅ Banner de Nosotros inicializado exitosamente");
      console.log("📋 Configuración por defecto:");
      console.log(`   - Título: ${defaultAboutUsConfig.sectionTitle}`);
      console.log(`   - Subtítulo: ${defaultAboutUsConfig.subtitle}`);
      console.log(`   - Mostrar equipo: ${defaultAboutUsConfig.showTeamSection ? "Sí" : "No"}`);
      console.log(`   - Mostrar estadísticas: ${defaultAboutUsConfig.showStats ? "Sí" : "No"}`);
      console.log("🔧 Banner ID generado:", response.data.banner?.id);
      console.log("📝 Actualiza el NEXT_PUBLIC_NOSOTROS01_ID con el valor generado");
    } else {
      console.error("❌ Error al inicializar banner de Nosotros");
      console.error("Respuesta:", response.data);
    }
  } catch (error) {
    console.error(
      "❌ Error al inicializar banner de Nosotros:",
      error.response?.data || error.message
    );
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initAboutUsConfig();
}

module.exports = { initAboutUsConfig };
