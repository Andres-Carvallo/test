"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

const ContentBlockForm = () => {
  const [title, setTitle] = useState("");
  const [contentText, setContentText] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [landingText, setLandingText] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [contentBlocks, setContentBlocks] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [variables, setVariables] = useState<Array<{
    nombre: string;
    tipo: string;
    id?: string;
  }>>([]);
  const [nombreVariable, setNombreVariable] = useState("");
  const [tipoVariable, setTipoVariable] = useState("");
  const [idsGenerados, setIdsGenerados] = useState<Array<{
    nombre: string;
    id: string;
  }>>([]);

  useEffect(() => {
    fetchContentBlocks();
  }, []);

  const fetchContentBlocks = async () => {
    const token = getCookie("AdminTokenAuth");

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data, "response.data blocks");
      if (response.status === 200) {
        setContentBlocks(response.data.attributes);
      }
    } catch (error) {
      console.error("Error fetching content blocks:", error);
    }
  };

  const handleContentSubmit = async (e: any) => {
    e.preventDefault();

    const token = getCookie("AdminTokenAuth");

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          title,
          contentText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        setTitle("");
        setContentText("");
        fetchContentBlocks(); // Refresh the list after adding new content block
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBannerSubmit = async (e: any) => {
    e.preventDefault();

    const token = getCookie("AdminTokenAuth");

    if (!mainImage) {
      console.log("Imagen principal es requerida");
      return;
    }

    try {
      const mainImageBase64 = await toBase64(mainImage);
      const mainImageDataUrl = `data:${mainImage.type};base64,${mainImageBase64}`;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          title: bannerTitle,
          landingText,
          buttonText,
          buttonLink,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        console.log(response.data.banner.id, "Banner creado con éxito");
        const bannerId = response.data.banner.id; // Asumiendo que la respuesta contiene el ID del banner creado
        const imageResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          {
            title: bannerTitle,
            landingText,
            buttonText,
            buttonLink,
            orderNumber: 1,
            mainImageLink: "https://www.google.cl/123",
            mainImage: {
              name: "pixelup.cl",
              type: "image/png",
              size: 10385,
              data: mainImageDataUrl,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(imageResponse.data, "AAAAA");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          resolve(String(reader.result).split(",")[1]);
        } else {
          reject(new Error("reader.result is null"));
        }
      };
      reader.onerror = (error) => reject(error);
    });

  const handleImageChange = (e: any) => {
    setMainImage(e.target.files[0]);
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === "vamoscontodo") {
      setIsAuthorized(true);
    } else {
      alert("Código incorrecto. Por favor, intente nuevamente.");
      setAccessCode("");
    }
  };

  const generarVariables = async () => {
    const token = getCookie("AdminTokenAuth");
    const nuevosIds = [];
    const bannerPairs: { [key: string]: string } = {};

    // Primero procesamos los bannerID
    for (const variable of variables) {
      if (variable.tipo === "bannerID") {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
            {
              title: variable.nombre,
              landingText: "pixelup",
              buttonText: "pixelup",
              buttonLink: "https://pixelup.cl",
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const bannerId = response.data.banner.id;
          const baseVarName = variable.nombre.replace('_ID', '');
          bannerPairs[baseVarName] = bannerId;
          
          nuevosIds.push({
            nombre: variable.nombre,
            id: bannerId
          });
        } catch (error) {
          console.error(`Error generando Banner ID para ${variable.nombre}:`, error);
        }
      }
    }

    // Luego procesamos los demás tipos
    for (const variable of variables) {
      try {
        if (variable.tipo === "contentblock") {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
            {
              title: variable.nombre,
              contentText: "Contenido inicial",
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          nuevosIds.push({
            nombre: variable.nombre,
            id: response.data.contentBlock.id
          });
        } else if (variable.tipo === "bannerIMGID") {
          const baseVarName = variable.nombre.replace('_IMGID', '');
          const bannerId = bannerPairs[baseVarName];
          
          if (bannerId) {
            // Crear un nuevo Blob con un pixel transparente
            const transparentPixel = new Blob([new Uint8Array([
              0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
              0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
              0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
              0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
              0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
              0x54, 0x78, 0x9C, 0x63, 0x00, 0x00, 0x00, 0x05,
              0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00, 0x00,
              0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42,
              0x60, 0x82
            ])], { type: 'image/png' });

            // Convertir el Blob a File
            const defaultImage = new File([transparentPixel], 'default.png', { type: 'image/png' });

            try {
              // Usar la misma función toBase64 que se usa en handleBannerSubmit
              const defaultImageBase64 = await toBase64(defaultImage);

              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
                {
                  title: variable.nombre,
                  landingText: "pixelup",
                  buttonText: "pixelup",
                  buttonLink: "https://pixelup.cl",
                  orderNumber: 1,
                  mainImageLink: "https://pixelup.cl/default-image.jpg",
                  mainImage: {
                    name: "default.png",
                    type: "image/png",
                    size: 1024,
                    data: `data:image/png;base64,${defaultImageBase64}`,
                  },
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              
              nuevosIds.push({
                nombre: variable.nombre,
                id: response.data.banner.id
              });
            } catch (error: any) {
              console.error(`Error generando Banner IMG ID para ${variable.nombre}:`, error);
              console.error('Error details:', error.response?.data);
            }
          } else {
            console.error(`No se encontró un banner ID correspondiente para ${variable.nombre}`);
          }
        }
      } catch (error) {
        console.error(`Error generando ID para ${variable.nombre}:`, error);
      }
    }

    setIdsGenerados(nuevosIds);
    setVariables([]); // Limpiar la lista de variables después de generar
  };

  const handleVariableInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n').filter(line => line.trim());
    
    // Procesar cada línea y determinar automáticamente el tipo
    const nuevasVariables = lines.map(line => {
      const nombre = line.trim();
      let tipo = '';
      
      if (nombre.endsWith('_CONTENTBLOCK')) {
        tipo = 'contentblock';
      } else if (nombre.endsWith('_IMGID')) {
        tipo = 'bannerIMGID';
      } else if (nombre.endsWith('_ID')) {
        tipo = 'bannerID';
      }
      
      return { nombre, tipo };
    }).filter(v => v.tipo); // Solo incluir variables con tipo válido

    setVariables([...variables, ...nuevasVariables]);
    setNombreVariable('');
  };

  const copiarIdsGenerados = () => {
    const texto = idsGenerados
      .map(item => `${item.nombre}=${item.id}`)
      .join('\n');
    
    navigator.clipboard.writeText(texto)
      .then(() => {
        alert('IDs copiados al portapapeles');
      })
      .catch(err => {
        console.error('Error al copiar:', err);
        alert('Error al copiar los IDs');
      });
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Acceso Restringido</h2>
          <form onSubmit={handleCodeSubmit}>
            <div className="mb-4">
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                Ingrese el código de acceso
              </label>
              <input
                type="password"
                id="accessCode"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verificar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <section>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && (
        <p className="text-green-500 mb-4">Formulario enviado con éxito!</p>
      )}
      <div className="w-full px-10 mx-auto flex gap-6 py-20">
{/*         <div className="p-4 bg-white shadow-md rounded w-[400px]">
          <h2 className="text-2xl font-bold mb-4">Crear Content Block</h2>
          <form onSubmit={handleContentSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Título
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="contentText"
                className="block text-sm font-medium text-gray-700"
              >
                Contenido
              </label>
              <textarea
                id="contentText"
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Enviar
            </button>
          </form>
        </div> */}

{/*         <div className="p-4 bg-white shadow-md rounded">
          <h2 className="text-2xl font-bold mt-8 mb-4">Crear Banner</h2>
          <form onSubmit={handleBannerSubmit}>
            <div className="mb-4">
              <label
                htmlFor="bannerTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Título del Banner
              </label>
              <input
                type="text"
                id="bannerTitle"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="landingText"
                className="block text-sm font-medium text-gray-700"
              >
                Texto de Bienvenida
              </label>
              <textarea
                id="landingText"
                value={landingText}
                onChange={(e) => setLandingText(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="buttonText"
                className="block text-sm font-medium text-gray-700"
              >
                Texto del Botón
              </label>
              <input
                type="text"
                id="buttonText"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="buttonLink"
                className="block text-sm font-medium text-gray-700"
              >
                Enlace del Botón
              </label>
              <input
                type="url"
                id="buttonLink"
                value={buttonLink}
                onChange={(e) => setButtonLink(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="mainImage"
                className="block text-sm font-medium text-gray-700"
              >
                Imagen Principal
              </label>
              <input
                type="file"
                id="mainImage"
                onChange={handleImageChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Enviar
            </button>
          </form>
        </div> */}

        <div className="p-4 bg-white shadow-md rounded w-[800px]">
          <h2 className="text-2xl font-bold mb-4">Generador de Variables</h2>
          <div className="flex gap-4 mb-4">
            <textarea
              placeholder="Ingresa las variables (una por línea)
Ejemplo:
VARIABLE_CONTENTBLOCK
VARIABLE_ID
VARIABLE_IMGID"
              value={nombreVariable}
              onChange={handleVariableInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-md min-h-[100px]"
            />
          </div>

          <div className="mb-4">
            <h3 className="font-bold mb-2">Variables pendientes:</h3>
            <ul>
              {variables.map((variable, index) => (
                <li key={index} className="mb-2">
                  {variable.nombre} - {variable.tipo}
                </li>
              ))}
            </ul>
          </div>

          {variables.length > 0 && (
            <button
              onClick={generarVariables}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Generar variables
            </button>
          )}

          {idsGenerados.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">IDs generados:</h3>
                <button
                  onClick={copiarIdsGenerados}
                  className="flex items-center gap-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copiar todos
                </button>
              </div>
              <div className="bg-gray-100 p-4 rounded-md">
                {idsGenerados.map((item, index) => (
                  <div key={index} className="mb-2">
                    {item.nombre}={item.id}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 p-4 bg-white shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Listado de Content Blocks</h2>
        {contentBlocks.length > 0 ? (
          <ul>
            {contentBlocks.map((block: any) => (
              <li
                key={block.title}
                className="mb-2 border-b pb-2"
              >
                <h2>{block.id}</h2>
                <h3 className="text-lg font-bold">{block.title}</h3>
                <p>{block.contentText}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay Content Blocks disponibles.</p>
        )}
      </div>
    </section>
  );
};

export default ContentBlockForm;
