export interface PreviewData {
  [componentId: string]: any;
}

export const previewData: PreviewData = {
  hero01: {
    bannerData: [
      {
        title: "Descubre Nuestra Nueva Colección",
        landingText: "Explora nuestra exclusiva colección de productos diseñados para elevar tu estilo y comodidad. Cada pieza está cuidadosamente seleccionada para ofrecerte la mejor calidad.",
        buttonText: "Nueva Colección",
        mainImage: {
          url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop&crop=center"
        }
      }
    ]
  },
  hero02: {
    bannerData: [
      {
        title: "Innovación y Diseño",
        landingText: "Combinamos tecnología de vanguardia con diseño atemporal para crear productos que no solo se ven bien, sino que también mejoran tu vida diaria.",
        buttonText: "Descubre Más",
        mainImage: {
          url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop&crop=center"
        }
      }
    ]
  },
  hero03: {
    bannerData: [
      {
        title: "Calidad Premium",
        landingText: "Nuestros productos están fabricados con los mejores materiales y técnicas artesanales, garantizando durabilidad y elegancia en cada detalle.",
        buttonText: "Ver Productos",
        mainImage: {
          url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=500&fit=crop&crop=center"
        }
      }
    ]
  },
  servicios01: {
    services: [
      {
        title: "Envío Gratis",
        description: "En pedidos superiores a $50",
        icon: "🚚"
      },
      {
        title: "Garantía de Calidad",
        description: "30 días de garantía",
        icon: "✅"
      },
      {
        title: "Soporte 24/7",
        description: "Atención personalizada",
        icon: "💬"
      }
    ]
  },
  testimonios01: {
    testimonials: [
      {
        name: "María González",
        role: "Cliente Frecuente",
        content: "Excelente calidad y servicio. Los productos superaron mis expectativas.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face"
      },
      {
        name: "Carlos Rodríguez",
        role: "Cliente VIP",
        content: "La mejor experiencia de compra online que he tenido. Altamente recomendado.",
        rating: 5,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      }
    ]
  },
  galeria01: {
    images: [
      {
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop&crop=center",
        alt: "Producto 1"
      },
      {
        url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop&crop=center",
        alt: "Producto 2"
      },
      {
        url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=300&h=300&fit=crop&crop=center",
        alt: "Producto 3"
      }
    ]
  },
  ubicacion01: {
    location: {
      address: "Av. Principal 123, Ciudad",
      phone: "+1 234 567 890",
      email: "info@empresa.com",
      hours: "Lun - Vie: 9:00 - 18:00",
      coordinates: {
        lat: -33.4489,
        lng: -70.6693
      }
    }
  },
  aboutUs: {
    content: {
      title: "Sobre Nosotros",
      subtitle: "Nuestra Historia",
      description: "Somos una empresa comprometida con la excelencia y la innovación. Desde nuestros inicios, hemos trabajado incansablemente para ofrecer productos de la más alta calidad que satisfagan las necesidades de nuestros clientes.",
      mission: "Nuestra misión es proporcionar soluciones innovadoras que mejoren la vida de nuestros clientes.",
      vision: "Ser líderes en nuestro sector, reconocidos por la calidad y el servicio excepcional."
    }
  },
  bannerAbout: {
    bannerData: {
      title: "Conoce Nuestra Historia",
      subtitle: "Más de 10 años de experiencia",
      backgroundImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop&crop=center"
    }
  }
};

// Función para obtener datos de vista previa para un componente específico
export const getPreviewData = (componentId: string): any => {
  return previewData[componentId] || {};
};

// Función para verificar si un componente tiene datos de vista previa
export const hasPreviewData = (componentId: string): boolean => {
  return componentId in previewData;
}; 