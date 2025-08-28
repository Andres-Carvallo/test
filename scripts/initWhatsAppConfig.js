const axios = require("axios");

const defaultWhatsAppConfig = {
  isActive: false,
  phoneNumber: "",
  message: "Hola, necesito información sobre sus productos",
};

async function initWhatsAppConfig() {
  try {
    console.log("🚀 Inicializando configuración de WhatsApp...");

    // Usar el ID del enum (esto debería ser reemplazado por el ID real generado)
    const contentBlockId = "whatsapp-config-default"; // Este ID se actualizará cuando se genere
    const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE;

    if (!siteId || !apiUrl) {
      console.error("❌ Error: Faltan variables de entorno necesarias");
      console.log("Asegúrate de tener configuradas:");
      console.log("- NEXT_PUBLIC_API_URL_SITEID");
      console.log("- NEXT_PUBLIC_API_URL_BO_CLIENTE");
      return;
    }

    console.log(`📝 Content Block ID: ${contentBlockId}`);
    console.log(`🌐 Site ID: ${siteId}`);

    // Verificar si ya existe la configuración
    try {
      const checkResponse = await axios.get(
        `${apiUrl}/api/v1/content-blocks/${contentBlockId}?siteId=${siteId}`
      );

      if (checkResponse.data.contentBlock) {
        console.log("⚠️  La configuración de WhatsApp ya existe");
        console.log("¿Deseas sobrescribirla? (y/N)");

        // En un script automático, no sobrescribir por defecto
        console.log(
          "Saltando inicialización para evitar sobrescribir configuración existente"
        );
        return;
      }
    } catch (error) {
      // Si no existe, continuar con la creación
      console.log(
        "✅ No existe configuración previa, procediendo con la inicialización..."
      );
    }

    // Crear la configuración inicial
    const response = await axios.post(
      `${apiUrl}/api/v1/content-blocks?siteId=${siteId}`,
      {
        id: contentBlockId,
        title: "Configuración de WhatsApp",
        contentText: JSON.stringify(defaultWhatsAppConfig, null, 2),
        type: "whatsapp-config",
        isActive: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.code === 0) {
      console.log("✅ Configuración de WhatsApp inicializada exitosamente");
      console.log("📋 Configuración por defecto:");
      console.log(JSON.stringify(defaultWhatsAppConfig, null, 2));
      console.log("🔧 ID generado:", response.data.contentBlock?.id);
      console.log("📝 Actualiza el ID en componentEnums.ts con el valor generado");
    } else {
      console.error("❌ Error al inicializar configuración de WhatsApp");
      console.error("Respuesta:", response.data);
    }
  } catch (error) {
    console.error(
      "❌ Error al inicializar configuración de WhatsApp:",
      error.response?.data || error.message
    );
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initWhatsAppConfig();
}

module.exports = { initWhatsAppConfig };
