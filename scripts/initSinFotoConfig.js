const axios = require("axios");

const sinFotoConfigs = {
  sinFoto01: {
    title: "Sin Foto 01",
    type: "banner",
    content: {
      heading: "Sección de Contenido",
      description: "Esta es una sección de contenido sin imagen de fondo. Perfecta para destacar información importante.",
      buttonText: "Más información",
      buttonLink: "/info",
      backgroundColor: "#f8f9fa",
      textColor: "#333333"
    }
  },
  sinFoto02: {
    title: "Sin Foto 02",
    type: "content-block",
    content: {
      mainContent: "Contenido principal de la sección sin foto 02",
      boxes: [
        {
          title: "Caja 1",
          content: "Contenido de la primera caja",
          icon: "star"
        },
        {
          title: "Caja 2", 
          content: "Contenido de la segunda caja",
          icon: "heart"
        },
        {
          title: "Caja 3",
          content: "Contenido de la tercera caja",
          icon: "shield"
        }
      ]
    }
  },
  sinFoto04: {
    title: "Sin Foto 04",
    type: "content-block",
    content: {
      sectionTitle: "Información Destacada",
      items: [
        {
          title: "Calidad Garantizada",
          description: "Todos nuestros productos pasan por rigurosos controles de calidad"
        },
        {
          title: "Entrega Rápida",
          description: "Entregamos en 24-48 horas en toda la región metropolitana"
        }
      ]
    }
  },
  sinFoto05: {
    title: "Sin Foto 05",
    type: "content-block",
    content: {
      title: "Sección de Testimonios",
      testimonials: [
        {
          name: "Cliente Satisfecho 1",
          text: "Excelente servicio y productos de alta calidad",
          rating: 5
        },
        {
          name: "Cliente Satisfecho 2", 
          text: "Muy buena atención al cliente y entrega rápida",
          rating: 5
        }
      ]
    }
  }
};

async function initSinFotoConfig() {
  try {
    console.log("🚀 Inicializando configuraciones Sin Foto...");

    const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE;

    if (!siteId || !apiUrl) {
      console.error("❌ Error: Faltan variables de entorno necesarias");
      console.log("Asegúrate de tener configuradas:");
      console.log("- NEXT_PUBLIC_API_URL_SITEID");
      console.log("- NEXT_PUBLIC_API_URL_BO_CLIENTE");
      return;
    }

    console.log(`🌐 Site ID: ${siteId}`);

    const generatedIds = {};

    // Crear Sin Foto 01 (Banner)
    try {
      const config = sinFotoConfigs.sinFoto01;
      const response = await axios.post(
        `${apiUrl}/api/v1/banners?siteId=${siteId}`,
        {
          title: config.title,
          landingText: JSON.stringify(config.content, null, 2),
          buttonText: config.content.buttonText,
          buttonLink: config.content.buttonLink,
          isActive: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.code === 0) {
        const bannerId = response.data.banner?.id || response.data.id;
        generatedIds.sinFoto01 = bannerId;
        generatedIds.sinFoto01Img = bannerId + '-img';
        console.log(`✅ ${config.title} creado: ${bannerId}`);
      }
    } catch (error) {
      console.error("❌ Error creando Sin Foto 01:", error.response?.data || error.message);
    }

    // Crear Sin Foto 02 y sus cajas (Content Blocks)
    try {
      const config = sinFotoConfigs.sinFoto02;
      
      // Content Block principal
      const mainResponse = await axios.post(
        `${apiUrl}/api/v1/content-blocks?siteId=${siteId}`,
        {
          title: config.title,
          contentText: JSON.stringify(config.content, null, 2),
          type: "sin-foto-02",
          isActive: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (mainResponse.data.code === 0) {
        const mainId = mainResponse.data.contentBlock?.id || mainResponse.data.id;
        generatedIds.sinFoto02 = mainId;
        console.log(`✅ ${config.title} creado: ${mainId}`);

        // Crear cajas individuales
        for (let i = 1; i <= 3; i++) {
          try {
            const boxContent = config.content.boxes[i - 1];
            const boxResponse = await axios.post(
              `${apiUrl}/api/v1/content-blocks?siteId=${siteId}`,
              {
                title: `${config.title} - ${boxContent.title}`,
                contentText: JSON.stringify(boxContent, null, 2),
                type: `sin-foto-02-box-${i}`,
                isActive: true,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (boxResponse.data.code === 0) {
              const boxId = boxResponse.data.contentBlock?.id || boxResponse.data.id;
              generatedIds[`sinFoto02Box${i}`] = boxId;
              console.log(`✅ ${config.title} - ${boxContent.title} creado: ${boxId}`);
            }
          } catch (error) {
            console.error(`❌ Error creando caja ${i}:`, error.response?.data || error.message);
          }
        }
      }
    } catch (error) {
      console.error("❌ Error creando Sin Foto 02:", error.response?.data || error.message);
    }

    // Crear Sin Foto 04 y 05 (Content Blocks)
    for (const key of ['sinFoto04', 'sinFoto05']) {
      try {
        const config = sinFotoConfigs[key];
        const response = await axios.post(
          `${apiUrl}/api/v1/content-blocks?siteId=${siteId}`,
          {
            title: config.title,
            contentText: JSON.stringify(config.content, null, 2),
            type: key,
            isActive: true,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.code === 0) {
          const contentId = response.data.contentBlock?.id || response.data.id;
          generatedIds[key] = contentId;
          console.log(`✅ ${config.title} creado: ${contentId}`);
        }
      } catch (error) {
        console.error(`❌ Error creando ${key}:`, error.response?.data || error.message);
      }
    }

    console.log("\n✅ Configuraciones Sin Foto inicializadas exitosamente");
    console.log("📝 Variables de entorno generadas:");
    if (generatedIds.sinFoto01) {
      console.log(`NEXT_PUBLIC_SINFOTO01_ID=${generatedIds.sinFoto01}`);
      console.log(`NEXT_PUBLIC_SINFOTO01_IMGID=${generatedIds.sinFoto01Img}`);
    }
    if (generatedIds.sinFoto02) {
      console.log(`NEXT_PUBLIC_SINFOTO02_CONTENTBLOCK=${generatedIds.sinFoto02}`);
      console.log(`NEXT_PUBLIC_SINFOTO02_BOX1_CONTENTBLOCK=${generatedIds.sinFoto02Box1 || 'pending'}`);
      console.log(`NEXT_PUBLIC_SINFOTO02_BOX2_CONTENTBLOCK=${generatedIds.sinFoto02Box2 || 'pending'}`);
      console.log(`NEXT_PUBLIC_SINFOTO02_BOX3_CONTENTBLOCK=${generatedIds.sinFoto02Box3 || 'pending'}`);
    }
    if (generatedIds.sinFoto04) {
      console.log(`NEXT_PUBLIC_SINFOTO04_CONTENTBLOCK=${generatedIds.sinFoto04}`);
    }
    if (generatedIds.sinFoto05) {
      console.log(`NEXT_PUBLIC_SINFOTO05_CONTENTBLOCK=${generatedIds.sinFoto05}`);
    }

  } catch (error) {
    console.error(
      "❌ Error al inicializar configuraciones Sin Foto:",
      error.response?.data || error.message
    );
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initSinFotoConfig();
}

module.exports = { initSinFotoConfig };
