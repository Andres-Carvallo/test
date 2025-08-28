/**
 * Utilidades para manejar imágenes base64 en el sistema de enums
 */

export interface Base64Image {
  name: string;
  type: string;
  size: number;
  data: string; // Base64 completo con data:image/...;base64,...
}

// Imagen base64 de ejemplo (1x1 pixel transparente PNG)
export const DEFAULT_BASE64_IMAGE: Base64Image = {
  name: "pixelup-default.png",
  type: "image/png",
  size: 95,
  data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
};

/**
 * Asegura que un objeto de datos de banner tenga una imagen base64
 */
export function ensureBannerHasImage(bannerData: any): any {
  if (!bannerData.mainImage) {
    return {
      ...bannerData,
      mainImage: DEFAULT_BASE64_IMAGE
    };
  }
  return bannerData;
}

/**
 * Crea una imagen base64 personalizada
 */
export function createBase64Image(
  name: string,
  type: string = "image/png",
  size: number = 95,
  data: string = DEFAULT_BASE64_IMAGE.data
): Base64Image {
  return {
    name,
    type,
    size,
    data
  };
}

/**
 * Convierte un archivo a base64
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        resolve(String(reader.result));
      } else {
        reject(new Error("reader.result is null"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Convierte una URL de imagen a base64
 */
export function imageUrlToBase64(url: string): Promise<Base64Image> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const dataURL = canvas.toDataURL('image/png');
      const base64Data = dataURL.split(',')[1];
      
      resolve({
        name: url.split('/').pop() || 'image.png',
        type: 'image/png',
        size: Math.round((base64Data.length * 3) / 4),
        data: dataURL
      });
    };
    img.onerror = reject;
    img.src = url;
  });
}
