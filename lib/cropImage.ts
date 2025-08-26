// utils/cropImage.ts
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Needed to avoid cross-origin issues
    image.src = url;
  });

export const getCroppedImg = async (
  imageSrc: string,
  crop: any
): Promise<Blob | null> => {
  // Verificar si estamos en el navegador
  if (typeof window === "undefined") {
    return null;
  }

  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  // Determinar el formato de salida basado en la extensión de la imagen original
  const getImageFormat = (src: string): string => {
    if (src.includes("data:image/png")) return "image/png";
    if (src.includes("data:image/jpeg") || src.includes("data:image/jpg")) return "image/jpeg";
    if (src.includes("data:image/webp")) return "image/webp";
    // Por defecto, usar PNG para preservar transparencia
    return "image/png";
  };

  const format = getImageFormat(imageSrc);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, format);
  });
};
