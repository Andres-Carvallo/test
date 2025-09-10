const axios = require("axios");

const defaultServicesConfig = {
  services: [
    {
      id: "service-01",
      title: "Envío Gratis",
      description: "Envío gratuito en compras superiores a $50.000",
      icon: "truck",
      isActive: true,
      order: 1
    },
    {
      id: "service-02", 
      title: "Soporte 24/7",
      description: "Atención al cliente las 24 horas del día",
      icon: "support",
      isActive: true,
      order: 2
    },
    {
      id: "service-03",
      title: "Garantía Extendida",
      description: "Garantía de 2 años en todos nuestros productos",
      icon: "shield",
      isActive: true,
      order: 3
    },
    {
      id: "service-04",
      title: "Devoluciones Fáciles",
      description: "Proceso de devolución simple y rápido",
      icon: "return",
      isActive: true,
      order: 4
    }
  ],
  sectionTitle: "Nuestros Servicios",
  sectionDescription: "Conoce todos los beneficios que ofrecemos a nuestros clientes",
  showIcons: true,
  layout: "grid", // grid, list, carousel
  itemsPerRow: 4
};

async function initServicesListConfig() {
  try {
    console.log("🚀 Inicializando configuración de Lista de Servicios...");

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

    const serviceIds = [];

    // Crear cada servicio como un banner separado
    for (let i = 1; i <= 4; i++) {
      const serviceData = defaultServicesConfig.services[i - 1];
      
      try {
        const response = await axios.post(
          `${apiUrl}/api/v1/banners?siteId=${siteId}`,
          {
            title: `Lista Servicios ${String(i).padStart(2, '0')}`,
            landingText: JSON.stringify(serviceData, null, 2),
            buttonText: "Más información",
            buttonLink: "/servicios",
            mainImage: {
              name: `service-${i}-icon.svg`,
              type: "image/svg+xml",
              size: 50,
              data: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMSA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDMgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjRjU5RTBCIi8+Cjwvc3ZnPgo="
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
          const serviceId = response.data.banner?.id || response.data.id;
          serviceIds.push(serviceId);
          console.log(`✅ Servicio ${i} creado: ${serviceData.title} (ID: ${serviceId})`);
        }
      } catch (error) {
        console.error(`❌ Error creando servicio ${i}:`, error.response?.data || error.message);
      }
    }

    if (serviceIds.length === 4) {
      console.log("✅ Lista de Servicios inicializada exitosamente");
      console.log("📋 Servicios creados:");
      defaultServicesConfig.services.forEach((service, index) => {
        console.log(`   ${index + 1}. ${service.title} - ID: ${serviceIds[index]}`);
      });
      
      console.log("\n📝 Variables de entorno generadas:");
      console.log(`NEXT_PUBLIC_LISTA_SERVICIOS01_ID=${serviceIds[0]}`);
      console.log(`NEXT_PUBLIC_LISTA_SERVICIOS02_ID=${serviceIds[1]}`);
      console.log(`NEXT_PUBLIC_LISTA_SERVICIOS03_ID=${serviceIds[2]}`);
      console.log(`NEXT_PUBLIC_LISTA_SERVICIOS04_ID=${serviceIds[3]}`);
    } else {
      console.error("❌ Error: No se pudieron crear todos los servicios");
    }
  } catch (error) {
    console.error(
      "❌ Error al inicializar Lista de Servicios:",
      error.response?.data || error.message
    );
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initServicesListConfig();
}

module.exports = { initServicesListConfig };
