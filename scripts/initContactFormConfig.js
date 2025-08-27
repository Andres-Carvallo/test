const axios = require("axios");

const defaultContactFormConfig = {
  formTitle: "Envíanos un mensaje",
  submitButtonText: "Enviar mensaje",
  showContactInfo: true,
  contactInfoTitle: "Información de contacto",
  email: "contacto@casarenteria.cl",
  phone: "+56 9 7533 0640",
  emailLabelInfo: "Email",
  phoneLabelInfo: "Teléfono"
};

async function initContactFormConfig() {
  try {
    console.log("🚀 Inicializando configuración del formulario de contacto...");

    const bannerId = process.env.NEXT_PUBLIC_CONTACT_FORM_BANNER_ID || "contact-form-banner-default";
const bannerImageId = process.env.NEXT_PUBLIC_CONTACT_FORM_BANNER_IMGID || "contact-form-banner-img-default";
    const siteId = process.env.NEXT_PUBLIC_API_URL_SITEID;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE;

    if (!siteId || !apiUrl) {
      console.error("❌ Error: Faltan variables de entorno necesarias");
      console.log("Asegúrate de tener configuradas:");
      console.log("- NEXT_PUBLIC_API_URL_SITEID");
      console.log("- NEXT_PUBLIC_API_URL_BO_CLIENTE");
      console.log("- NEXT_PUBLIC_CONTACT_FORM_BANNER_ID");
     console.log("- NEXT_PUBLIC_CONTACT_FORM_BANNER_IMGID");
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
        console.log("⚠️  El banner principal del formulario de contacto ya existe");
        console.log("Saltando inicialización para evitar sobrescribir configuración existente");
        return;
      }
    } catch (error) {
      // Si no existe, continuar con la creación
      console.log(
        "✅ No existe banner principal previo, procediendo con la inicialización..."
      );
    }

    // Verificar si ya existe el banner de imagen
    try {
      const checkImageResponse = await axios.get(
        `${apiUrl}/api/v1/banners/${bannerImageId}?siteId=${siteId}`
      );

      if (checkImageResponse.data.banner) {
        console.log("⚠️  El banner de imagen del formulario de contacto ya existe");
        console.log("Saltando inicialización para evitar sobrescribir configuración existente");
        return;
      }
    } catch (error) {
      // Si no existe, continuar con la creación
      console.log(
        "✅ No existe banner de imagen previo, procediendo con la inicialización..."
      );
    }

         // Crear el banner principal
     const response = await axios.post(
       `${apiUrl}/api/v1/banners?siteId=${siteId}`,
       {
         id: bannerId,
         title: "Configuración del Formulario de Contacto",
         landingText: JSON.stringify(defaultContactFormConfig, null, 2),
         buttonText: "Enviar mensaje",
         buttonLink: "/contacto",
         isActive: true,
       },
       {
         headers: {
           "Content-Type": "application/json",
         },
       }
     );

     // Crear el banner de imagen (independiente)
     const imageResponse = await axios.post(
       `${apiUrl}/api/v1/banners?siteId=${siteId}`,
       {
         id: bannerImageId,
         title: "Imagen Formulario de Contacto",
         landingText: "Imagen del formulario de contacto",
         buttonText: "Enviar mensaje",
         buttonLink: "/contacto",
         mainImageLink: "https://pixelup.cl/default-contact.jpg",
         orderNumber: 1,
         mainImage: {
           name: "pixelup-contact-form-image.png",
           type: "image/png",
           size: 95,
           data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
         },
         isActive: true,
       },
       {
         headers: {
           "Content-Type": "application/json",
         },
       }
     );

    if (response.data.code === 0 && imageResponse.data.code === 0) {
      console.log("✅ Banners del formulario de contacto inicializados exitosamente");
      console.log("📋 Configuración por defecto:");
      console.log(JSON.stringify(defaultContactFormConfig, null, 2));
      console.log("🔧 Banner Principal ID generado:", response.data.banner?.id);
      console.log("🖼️  Banner Imagen ID generado:", imageResponse.data.banner?.id);
      console.log("📝 Actualiza el NEXT_PUBLIC_CONTACT_FORM_BANNER_ID con el valor generado");
      console.log("📝 Actualiza el NEXT_PUBLIC_CONTACT_FORM_BANNER_IMGID con el valor generado");
    } else {
      console.error("❌ Error al inicializar banners del formulario de contacto");
      console.error("Respuesta Banner Principal:", response.data);
      console.error("Respuesta Banner Imagen:", imageResponse.data);
    }
  } catch (error) {
    console.error(
      "❌ Error al inicializar banner del formulario de contacto:",
      error.response?.data || error.message
    );
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initContactFormConfig();
}

module.exports = { initContactFormConfig };
