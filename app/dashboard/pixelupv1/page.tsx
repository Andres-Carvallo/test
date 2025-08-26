"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { 
  PIXELUPComponents, 
  CoreComponents, 
  PIXELUP_COMPONENT_DATA, 
  CORE_COMPONENT_DATA, 
  getPIXELUPComponentData, 
  getCoreComponentData, 
  getPIXELUPComponentDefaultData, 
  getCoreComponentDefaultData, 
  isBannerComponent, 
  isContentBlockComponent, 
  isMixedComponent, 
  getPendingComponents
} from '@/config/componentEnums';
import { ensureBannerHasImage } from '@/utils/imageUtils';

interface GeneratedId {
  component: string;
  type: 'banner' | 'contentBlock' | 'image';
      id: string;
  envVariable?: string;
}

interface TestResult {
  id: string;
  type: 'banner' | 'contentBlock' | 'image';
  status: 'success' | 'error' | 'not-found';
  message: string;
  data?: any;
  error?: any;
}

const ContentBlockForm: React.FC = () => {
  const [useCustomSiteId, setUseCustomSiteId] = useState(false);
  const [customSiteId, setCustomSiteId] = useState('');
  const [customToken, setCustomToken] = useState('');
  const [generatedIds, setGeneratedIds] = useState<GeneratedId[]>([]);
  const [loading, setLoading] = useState(false);
  const [useEnumSystem, setUseEnumSystem] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<PIXELUPComponents | CoreComponents | null>(null);
  const [pendingComponents, setPendingComponents] = useState<Array<{
    component: PIXELUPComponents | CoreComponents;
    data: any;
  }>>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testingIds, setTestingIds] = useState(false);
  const [testInputIds, setTestInputIds] = useState('');

  useEffect(() => {
    // Obtener componentes pendientes al cargar
    const pending = getPendingComponents();
    setPendingComponents(pending);
  }, []);

  const generarComponenteIndividual = async () => {
    if (!selectedComponent) {
      alert("Por favor, selecciona un componente del sistema de enums.");
      return;
    }

    const token = useCustomSiteId ? customToken : getCookie("AdminTokenAuth");
    const siteId = useCustomSiteId ? customSiteId : process.env.NEXT_PUBLIC_API_URL_SITEID;
    
    if (!token || (useCustomSiteId && !customSiteId)) {
      alert("Por favor, proporciona un token válido y un siteId.");
      return;
    }

    setLoading(true);

    try {
      const componentData = selectedComponent in PIXELUP_COMPONENT_DATA
        ? getPIXELUPComponentData(selectedComponent as PIXELUPComponents)
        : getCoreComponentData(selectedComponent as CoreComponents);

      console.log(`Creando componente: ${selectedComponent}`);
      console.log('Datos del componente:', {
        type: componentData.type,
        needsImage: componentData.needsImage,
        hasImageData: !!componentData.imageData,
        imageEnvVariable: componentData.imageEnvVariable
      });
      console.log('Datos por defecto:', componentData.defaultData);

      if (componentData.type === 'banner') {
        // Crear banner con datos por defecto
        const bannerData = ensureBannerHasImage({
          ...componentData.defaultData,
          siteId: siteId
        });
        
        const bannerResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners?siteId=${siteId}`,
          bannerData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (bannerResponse.data && bannerResponse.data.banner && bannerResponse.data.banner.id) {
          const bannerId = bannerResponse.data.banner.id;
          const newId: GeneratedId = {
            component: selectedComponent,
            type: 'banner',
            id: bannerId,
            envVariable: componentData.envVariable
          };
          
          setGeneratedIds(prev => [...prev, newId]);
          console.log(`✅ Banner creado exitosamente con ID: ${bannerId}`);

          // Si el componente necesita una imagen hija, crearla
          console.log(`🔍 Verificando imagen hija para ${selectedComponent}:`, {
            needsImage: componentData.needsImage,
            hasImageData: !!componentData.imageData,
            imageEnvVariable: componentData.imageEnvVariable
          });
          
          console.log(`🔍 Condición de imagen hija:`, {
            needsImage: componentData.needsImage,
            hasImageData: !!componentData.imageData,
            condition: componentData.needsImage && componentData.imageData
          });
          
          if (componentData.needsImage && componentData.imageData) {
            try {
              console.log(`🔄 Intentando crear imagen hija para ${selectedComponent}...`);
              
              // Crear la imagen hija con los datos completos
              const imageData = {
                ...componentData.imageData, // Ya contiene todos los campos necesarios
                siteId: siteId
              };

              console.log(`📤 Datos de imagen hija a enviar:`, imageData);

              const imageResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images?siteId=${siteId}`,
                imageData,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );

              console.log(`📥 Respuesta de la API para imagen hija:`, imageResponse.data);

              if (imageResponse.data && imageResponse.data.banner && imageResponse.data.banner.id) {
                const imageId = imageResponse.data.banner.id;
                const imageIdObj: GeneratedId = {
                  component: `${selectedComponent}_IMAGE`,
                  type: 'image',
                  id: imageId,
                  envVariable: componentData.imageEnvVariable
                };
                
                setGeneratedIds(prev => [...prev, imageIdObj]);
                console.log(`✅ Imagen hija creada para ${selectedComponent} con ID: ${imageId}`);
              } else {
                console.error(`❌ Respuesta de imagen hija no contiene ID válido:`, imageResponse.data);
              }
            } catch (imageError: any) {
              console.error(`❌ Error al crear imagen hija para ${selectedComponent}:`, imageError);
              console.error(`❌ Detalles del error:`, {
                message: imageError.message,
                response: imageError.response?.data,
                status: imageError.response?.status,
                url: imageError.config?.url
              });
            }
          }
        }

      } else if (componentData.type === 'contentBlock') {
        // Crear content block con datos por defecto
        const contentBlockResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks?siteId=${siteId}`,
          {
            ...componentData.defaultData,
            siteId: siteId
          },
        {
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (contentBlockResponse.data && contentBlockResponse.data.contentBlock && contentBlockResponse.data.contentBlock.id) {
          const contentBlockId = contentBlockResponse.data.contentBlock.id;
          const newId: GeneratedId = {
            component: selectedComponent,
            type: 'contentBlock',
            id: contentBlockId,
            envVariable: componentData.envVariable
          };
          
          setGeneratedIds(prev => [...prev, newId]);
          console.log(`✅ Content Block creado exitosamente con ID: ${contentBlockId}`);
        }

      } else if (componentData.type === 'mixed') {
        // Crear tanto banner como content block
        const bannerData = componentData.defaultData.banner;
        const contentBlockData = componentData.defaultData.contentBlock;

        if (bannerData) {
          const bannerDataWithImage = ensureBannerHasImage({
            ...bannerData,
            siteId: siteId
          });
          
          const bannerResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners?siteId=${siteId}`,
            bannerDataWithImage,
        {
          headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (bannerResponse.data && bannerResponse.data.banner && bannerResponse.data.banner.id) {
            const bannerId = bannerResponse.data.banner.id;
            const newId: GeneratedId = {
              component: `${selectedComponent}_BANNER`,
              type: 'banner',
              id: bannerId,
              envVariable: componentData.envVariable
            };
            
            setGeneratedIds(prev => [...prev, newId]);
            console.log(`✅ Banner creado exitosamente con ID: ${bannerId}`);

                        // Si el componente necesita una imagen hija, crearla
            if (componentData.needsImage && componentData.imageData) {
              try {
                // Crear la imagen hija con los datos completos
                const imageData = {
                  ...componentData.imageData, // Ya contiene todos los campos necesarios
                  siteId: siteId
                };

                const imageResponse = await axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images?siteId=${siteId}`,
                  imageData,
                  {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  }
                );

                if (imageResponse.data && imageResponse.data.image && imageResponse.data.image.id) {
                  const imageId = imageResponse.data.image.id;
                  const imageIdObj: GeneratedId = {
                    component: `${selectedComponent}_IMAGE`,
                    type: 'image',
                    id: imageId,
                    envVariable: componentData.imageEnvVariable
                  };
                  
                  setGeneratedIds(prev => [...prev, imageIdObj]);
                  console.log(`✅ Imagen hija creada para ${selectedComponent} con ID: ${imageId}`);
                }
              } catch (imageError) {
                console.error(`Error al crear imagen hija para ${selectedComponent}:`, imageError);
              }
            }
          }
        }

        if (contentBlockData) {
          const contentBlockResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks?siteId=${siteId}`,
            {
              ...contentBlockData,
              siteId: siteId
        },
        {
          headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (contentBlockResponse.data && contentBlockResponse.data.contentBlock && contentBlockResponse.data.contentBlock.id) {
            const contentBlockId = contentBlockResponse.data.contentBlock.id;
            const newId: GeneratedId = {
              component: `${selectedComponent}_CONTENTBLOCK`,
              type: 'contentBlock',
              id: contentBlockId,
              envVariable: componentData.envVariable
            };
            
            setGeneratedIds(prev => [...prev, newId]);
            console.log(`✅ Content Block creado exitosamente con ID: ${contentBlockId}`);
          }
        }
      }

      setSelectedComponent(null);
      alert(`Componente ${selectedComponent} generado exitosamente.`);
      
    } catch (error) {
      console.error("Error al crear componente:", error);
      alert(`Error al crear componente: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const generarTodosLosPendientes = async () => {
    const token = useCustomSiteId ? customToken : getCookie("AdminTokenAuth");
    const siteId = useCustomSiteId ? customSiteId : process.env.NEXT_PUBLIC_API_URL_SITEID;
    
    if (!token || (useCustomSiteId && !customSiteId)) {
      alert("Por favor, proporciona un token válido y un siteId.");
      return;
    }

    setLoading(true);

    try {
      const nuevosIds: GeneratedId[] = [];
      
      // Obtener componentes pendientes
      const pending = getPendingComponents();
      
      for (const { component, data } of pending) {
        console.log(`Creando componente: ${component}`);
        console.log('Datos por defecto:', data.defaultData);

        if (data.type === 'banner') {
          const bannerData = ensureBannerHasImage({
            ...data.defaultData,
            siteId: siteId
          });

      const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners?siteId=${siteId}`,
            bannerData,
        {
          headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data && response.data.banner && response.data.banner.id) {
            const bannerId = response.data.banner.id;
            nuevosIds.push({
              component: component,
              type: 'banner',
              id: bannerId,
              envVariable: data.envVariable
            });
            
            console.log(`✅ ${component} creado con ID: ${bannerId}`);

                        // Si el componente necesita una imagen hija, crearla
            console.log(`🔍 Verificando imagen hija para ${component}:`, {
              needsImage: data.needsImage,
              hasImageData: !!data.imageData,
              imageEnvVariable: data.imageEnvVariable
            });
            
            if (data.needsImage && data.imageData) {
              try {
                // Crear la imagen hija con los datos completos
                const imageData = {
                  ...data.imageData, // Ya contiene todos los campos necesarios
                  siteId: siteId
                };

                const imageResponse = await axios.post(
                  `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${bannerId}/images?siteId=${siteId}`,
                  imageData,
                  {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  }
                );

                if (imageResponse.data && imageResponse.data.image && imageResponse.data.image.id) {
                  const imageId = imageResponse.data.image.id;
                  nuevosIds.push({
                    component: `${component}_IMAGE`,
                    type: 'image',
                    id: imageId,
                    envVariable: data.imageEnvVariable
                  });
                  
                  console.log(`✅ Imagen hija creada para ${component} con ID: ${imageId}`);
                }
              } catch (imageError) {
                console.error(`Error al crear imagen hija para ${component}:`, imageError);
              }
            }
          }

        } else if (data.type === 'contentBlock') {
      const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks?siteId=${siteId}`,
        {
              ...data.defaultData,
              siteId: siteId
        },
        {
          headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data && response.data.contentBlock && response.data.contentBlock.id) {
            const contentBlockId = response.data.contentBlock.id;
            nuevosIds.push({
              component: component,
              type: 'contentBlock',
              id: contentBlockId,
              envVariable: data.envVariable
            });
            
            console.log(`✅ ${component} creado con ID: ${contentBlockId}`);
          }
        }
      }

      setGeneratedIds(prev => [...prev, ...nuevosIds]);
      alert(`Se generaron ${nuevosIds.length} componentes exitosamente.`);
      
    } catch (error) {
      console.error("Error al generar componentes:", error);
      alert(`Error al generar componentes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const generarIdsParaOtroSitio = async () => {
    if (!customSiteId || !customToken) {
      alert("Por favor, proporciona un Site ID y Token válidos para el otro sitio.");
      return;
    }

    setLoading(true);

    try {
      const nuevosIds: GeneratedId[] = [];
      
      // Obtener componentes pendientes
      const pending = getPendingComponents();
      
      for (const { component, data } of pending) {
        console.log(`Creando componente: ${component} para sitio: ${customSiteId}`);
        console.log('Datos por defecto:', data.defaultData);

        if (data.type === 'banner') {
          const bannerData = ensureBannerHasImage({
            ...data.defaultData,
            siteId: customSiteId
          });

          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners?siteId=${customSiteId}`,
            bannerData,
        {
          headers: {
                'Authorization': `Bearer ${customToken}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data && response.data.banner && response.data.banner.id) {
          const bannerId = response.data.banner.id;
          nuevosIds.push({
              component: component,
              type: 'banner',
            id: bannerId,
              envVariable: data.envVariable
            });
            
            console.log(`✅ ${component} creado con ID: ${bannerId} para sitio ${customSiteId}`);
          }

        } else if (data.type === 'contentBlock') {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks?siteId=${customSiteId}`,
            {
              ...data.defaultData,
              siteId: customSiteId
            },
            {
            headers: {
                'Authorization': `Bearer ${customToken}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data && response.data.contentBlock && response.data.contentBlock.id) {
            const contentBlockId = response.data.contentBlock.id;
          nuevosIds.push({
              component: component,
              type: 'contentBlock',
              id: contentBlockId,
              envVariable: data.envVariable
            });
            
            console.log(`✅ ${component} creado con ID: ${contentBlockId} para sitio ${customSiteId}`);
          }
        }
      }

      setGeneratedIds(prev => [...prev, ...nuevosIds]);
      alert(`Se generaron ${nuevosIds.length} componentes para el sitio ${customSiteId}.`);
      
    } catch (error) {
      console.error("Error al generar componentes para otro sitio:", error);
      alert(`Error al generar componentes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVariableInput = (variable: string) => {
    // Función eliminada - ya no se usa el mapeo de variables de entorno
    console.log(`Variable ${variable} - mapeo eliminado del sistema`);
  };

  const copiarIdsParaEnums = () => {
    // Agrupar por tipo de componente
    const bannerIds = generatedIds.filter(id => id.type === 'banner');
    const contentBlockIds = generatedIds.filter(id => id.type === 'contentBlock');
    
    let textToCopy = '// IDs generados para actualizar en config/componentEnums.ts\n\n';
    
    // IDs de Banners
    if (bannerIds.length > 0) {
      textToCopy += '// BANNERS\n';
      bannerIds.forEach(id => {
        textToCopy += `${id.component}: '${id.id}',\n`;
      });
      textToCopy += '\n';
    }
    
    // IDs de Content Blocks
    if (contentBlockIds.length > 0) {
      textToCopy += '// CONTENT BLOCKS\n';
      contentBlockIds.forEach(id => {
        textToCopy += `${id.component}: '${id.id}',\n`;
      });
      textToCopy += '\n';
    }
    
    // Lista completa para referencia
    textToCopy += '// LISTA COMPLETA\n';
    generatedIds.forEach(id => {
      textToCopy += `${id.component}: '${id.id}', // ${id.type}\n`;
    });
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('IDs copiados al portapapeles. Pega en config/componentEnums.ts');
    }).catch(() => {
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('IDs copiados al portapapeles. Pega en config/componentEnums.ts');
    });
  };

  const copiarIdsParaReemplazar = () => {
    // Crear un formato específico para reemplazar PENDING_ID en el archivo
    let textToCopy = '// ========================================\n';
    textToCopy += '// REEMPLAZAR PENDING_ID EN config/componentEnums.ts\n';
    textToCopy += '// ========================================\n\n';
    
    // Formato para búsqueda y reemplazo masivo
    textToCopy += '// FORMATO PARA BÚSQUEDA Y REEMPLAZO MASIVO:\n\n';
    generatedIds.forEach(id => {
      textToCopy += `// Buscar: [PIXELUPComponents.${id.component}]: {\n`;
      textToCopy += `//          id: 'PENDING_ID', // Se actualiza después de crear via API\n`;
      textToCopy += `// Reemplazar con: [PIXELUPComponents.${id.component}]: {\n`;
      textToCopy += `//                id: '${id.id}', // Generado via API\n\n`;
    });
    
    // Formato para copiar y pegar directamente
    textToCopy += '// ========================================\n';
    textToCopy += '// FORMATO PARA COPIAR Y PEGAR DIRECTAMENTE:\n';
    textToCopy += '// ========================================\n\n';
    
    generatedIds.forEach(id => {
      const componentData = id.component in PIXELUP_COMPONENT_DATA
        ? getPIXELUPComponentData(id.component as PIXELUPComponents)
        : getCoreComponentData(id.component as CoreComponents);
      
      textToCopy += `[PIXELUPComponents.${id.component}]: {\n`;
      textToCopy += `    id: '${id.id}', // Generado via API\n`;
      textToCopy += `    type: '${componentData.type}',\n`;
      textToCopy += `    jsonStructure: '${componentData.jsonStructure || 'simple'}',\n`;
      textToCopy += `    envVariable: '${componentData.envVariable || 'N/A'}',\n`;
      textToCopy += `    defaultData: {\n`;
      textToCopy += `      // ... mantener los datos por defecto existentes\n`;
      textToCopy += `    }\n`;
      textToCopy += `  },\n\n`;
    });
    
    // Lista simple para referencia rápida
    textToCopy += '// ========================================\n';
    textToCopy += '// LISTA SIMPLE PARA REFERENCIA:\n';
    textToCopy += '// ========================================\n\n';
    generatedIds.forEach(id => {
      textToCopy += `${id.component}: '${id.id}',\n`;
    });
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Formato de reemplazo copiado al portapapeles');
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Formato de reemplazo copiado al portapapeles');
    });
  };

  const limpiarIdsGenerados = () => {
    setGeneratedIds([]);
  };

  const copiarIdsSimples = () => {
    const simpleIds = generatedIds.map(id => `${id.component}: '${id.id}'`).join(',\n');
    const textToCopy = `// IDs simples para copiar y pegar\n\n${simpleIds}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('IDs simples copiados al portapapeles');
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('IDs simples copiados al portapapeles');
    });
  };

  const copiarReferenciasParaScript = () => {
    // Formato para copiar las referencias y pegarlas en el script
    let textToCopy = '// ========================================\n';
    textToCopy += '// REFERENCIAS PARA COPIAR EN EL SCRIPT\n';
    textToCopy += '// ========================================\n\n';
    
    textToCopy += '// Copia estas referencias y pégalas en el script:\n\n';
    
    generatedIds.forEach(id => {
      const enumType = id.component in PIXELUP_COMPONENT_DATA ? 'PIXELUPComponents' : 'CoreComponents';
      textToCopy += `${enumType}.${id.component},\n`;
    });
    
    textToCopy += '\n// ========================================\n';
    textToCopy += '// O usa este formato para el script:\n';
    textToCopy += '// ========================================\n\n';
    
    textToCopy += 'const componentesParaGenerar = [\n';
    generatedIds.forEach(id => {
      const enumType = id.component in PIXELUP_COMPONENT_DATA ? 'PIXELUPComponents' : 'CoreComponents';
      textToCopy += `  ${enumType}.${id.component},\n`;
    });
    textToCopy += '];\n';
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Referencias para script copiadas al portapapeles');
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Referencias para script copiadas al portapapeles');
      });
  };

  const copiarIdsParaReemplazoMasivo = () => {
    // Formato específico para el mapeo centralizado
    let textToCopy = '// ========================================\n';
    textToCopy += '// ACTUALIZACIÓN DEL MAPEO CENTRALIZADO\n';
    textToCopy += '// ========================================\n\n';
    
    textToCopy += '// INSTRUCCIONES:\n';
    textToCopy += '// 1. Abrir config/componentEnums.ts\n';
    textToCopy += '// 2. Buscar la sección "COMPONENT_IDS"\n';
    textToCopy += '// 3. Reemplazar los IDs correspondientes\n\n';
    
    textToCopy += '// ========================================\n';
    textToCopy += '// IDs GENERADOS PARA ACTUALIZAR:\n';
    textToCopy += '// ========================================\n\n';
    
    generatedIds.forEach(id => {
      textToCopy += `  '${id.component}': '${id.id}',\n`;
    });
    
    textToCopy += '\n// ========================================\n';
    textToCopy += '// FUNCIÓN PARA ACTUALIZAR TODO DE UNA VEZ:\n';
    textToCopy += '// ========================================\n\n';
    
    textToCopy += '// Copiar y pegar esto en la consola del navegador:\n';
    textToCopy += 'updateComponentIds({\n';
    generatedIds.forEach(id => {
      textToCopy += `  '${id.component}': '${id.id}',\n`;
    });
    textToCopy += '});\n';
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Formato para mapeo centralizado copiado al portapapeles');
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Formato para mapeo centralizado copiado al portapapeles');
      });
  };

  const probarIds = async () => {
    if (!testInputIds.trim()) {
      alert("Por favor, ingresa los IDs a probar (separados por comas o saltos de línea)");
      return;
    }

    const token = useCustomSiteId ? customToken : getCookie("AdminTokenAuth");
    const siteId = useCustomSiteId ? customSiteId : process.env.NEXT_PUBLIC_API_URL_SITEID;
    
    if (!token || (useCustomSiteId && !customSiteId)) {
      alert("Por favor, proporciona un token válido y un siteId.");
      return;
    }

    setTestingIds(true);
    setTestResults([]);

    try {
      // Parsear los IDs ingresados
      const ids = testInputIds
        .split(/[,\n]/)
        .map(id => id.trim())
        .filter(id => id.length > 0);

      console.log(`🧪 Probando ${ids.length} IDs...`);

      const results: TestResult[] = [];

      for (const id of ids) {
        console.log(`🔍 Probando ID: ${id}`);
        
        // Intentar probar como banner
        try {
          const bannerResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${id}?siteId=${siteId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (bannerResponse.data && bannerResponse.data.banner) {
            results.push({
              id,
              type: 'banner',
              status: 'success',
              message: `✅ Banner encontrado: ${bannerResponse.data.banner.title || 'Sin título'}`,
              data: bannerResponse.data.banner
            });

            // Probar si el banner tiene imágenes hijas
            try {
              const imagesResponse = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${id}/images?siteId=${siteId}&pageSize=100&pageNumber=1`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );

              if (imagesResponse.data && imagesResponse.data.bannerImages && imagesResponse.data.bannerImages.length > 0) {
                console.log(`🖼️ Banner ${id} tiene ${imagesResponse.data.bannerImages.length} imagen(es) hija(s)`);
                
                // Agregar cada imagen hija como resultado
                imagesResponse.data.bannerImages.forEach((image: any, index: number) => {
                  results.push({
                    id: image.id,
                    type: 'image',
                    status: 'success',
                    message: `🖼️ Imagen hija ${index + 1} del banner ${id}: ${image.title || 'Sin título'}`,
                    data: image
                  });
                });
              } else {
                console.log(`ℹ️ Banner ${id} no tiene imágenes hijas`);
              }
            } catch (imagesError: any) {
              console.log(`⚠️ Error al obtener imágenes del banner ${id}:`, imagesError.response?.status);
            }

            continue; // Si es banner, no probar como content block
          }
        } catch (bannerError: any) {
          console.log(`❌ ID ${id} no es un banner válido:`, bannerError.response?.status);
        }

        // Intentar probar como content block
        try {
          const contentBlockResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/content-blocks/${id}?siteId=${siteId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (contentBlockResponse.data && contentBlockResponse.data.contentBlock) {
            results.push({
              id,
              type: 'contentBlock',
              status: 'success',
              message: `✅ Content Block encontrado: ${contentBlockResponse.data.contentBlock.title || 'Sin título'}`,
              data: contentBlockResponse.data.contentBlock
            });
            continue;
          }
        } catch (contentBlockError: any) {
          console.log(`❌ ID ${id} no es un content block válido:`, contentBlockError.response?.status);
        }

        // Intentar probar como imagen individual (banner hijo)
        try {
          // Buscar en todos los banners para encontrar imágenes hijas
          const allBannersResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners?siteId=${siteId}&pageSize=100&pageNumber=1`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );

          if (allBannersResponse.data && allBannersResponse.data.banners) {
            let imageFound = false;
            
            for (const banner of allBannersResponse.data.banners) {
              try {
                const imagesResponse = await axios.get(
                  `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/banners/${banner.id}/images?siteId=${siteId}&pageSize=100&pageNumber=1`,
                  {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  }
                );

                if (imagesResponse.data && imagesResponse.data.bannerImages) {
                  const foundImage = imagesResponse.data.bannerImages.find((img: any) => img.id === id);
                  if (foundImage) {
                    results.push({
                      id,
                      type: 'image',
                      status: 'success',
                      message: `🖼️ Imagen encontrada como hija del banner ${banner.id}: ${foundImage.title || 'Sin título'}`,
                      data: foundImage
                    });
                    imageFound = true;
                    break;
                  }
                }
              } catch (imageError: any) {
                // Continuar con el siguiente banner
                continue;
              }
            }

            if (imageFound) {
              continue; // Si encontramos la imagen, no marcar como no encontrada
            }
          }
        } catch (imageSearchError: any) {
          console.log(`❌ Error al buscar imagen ${id}:`, imageSearchError.response?.status);
        }

        // Si llegamos aquí, el ID no existe
        results.push({
          id,
          type: 'banner', // tipo por defecto
          status: 'not-found',
          message: `❌ ID no encontrado como banner ni content block`,
          error: { message: 'ID no existe en el sistema' }
        });
      }

      setTestResults(results);
      console.log(`✅ Prueba completada. Resultados:`, results);
      
      } catch (error) {
      console.error("Error al probar IDs:", error);
      alert(`Error al probar IDs: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setTestingIds(false);
    }
  };

  const probarIdsGenerados = async () => {
    if (generatedIds.length === 0) {
      alert("No hay IDs generados para probar. Primero genera algunos componentes.");
      return;
    }

    // Usar los IDs generados en esta sesión
    const idsToTest = generatedIds.map(id => id.id).join(',\n');
    setTestInputIds(idsToTest);
    
    // Ejecutar la prueba automáticamente
    setTimeout(() => probarIds(), 100);
  };

  const limpiarResultadosPrueba = () => {
    setTestResults([]);
    setTestInputIds('');
  };

  const copiarIdsParaReemplazoDirecto = () => {
    // Formato específico para reemplazar solo los IDs
    let textToCopy = '// ========================================\n';
    textToCopy += '// REEMPLAZO MASIVO DE IDs EN config/componentEnums.ts\n';
    textToCopy += '// ========================================\n\n';
    
    textToCopy += '// INSTRUCCIONES:\n';
    textToCopy += '// 1. Usar Ctrl+H para buscar y reemplazar\n';
    textToCopy += '// 2. Copiar y pegar cada línea de abajo\n\n';
    
    textToCopy += '// ========================================\n';
    textToCopy += '// FORMATO PARA BÚSQUEDA Y REEMPLAZO MASIVO:\n';
    textToCopy += '// ========================================\n\n';
    
    generatedIds.forEach(id => {
      const enumType = id.component in PIXELUP_COMPONENT_DATA ? 'PIXELUPComponents' : 'CoreComponents';
      textToCopy += `id: ${enumType}.${id.component}, → id: '${id.id}',\n`;
    });
    
    textToCopy += '\n// ========================================\n';
    textToCopy += '// ALTERNATIVA: REEMPLAZO LÍNEA POR LÍNEA\n';
    textToCopy += '// ========================================\n\n';
    
    generatedIds.forEach(id => {
      const enumType = id.component in PIXELUP_COMPONENT_DATA ? 'PIXELUPComponents' : 'CoreComponents';
      textToCopy += `// Buscar: id: ${enumType}.${id.component},\n`;
      textToCopy += `// Reemplazar con: id: '${id.id}',\n\n`;
    });
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Formato de reemplazo masivo copiado al portapapeles');
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Formato de reemplazo masivo copiado al portapapeles');
      });
  };

    return (
    <div className="p-6 max-w-6xl mx-auto">
             <h1 className="text-3xl font-bold mb-6">Generador de Componentes con Sistema de Enums</h1>
       
       {/* Información sobre imágenes base64 */}
       <div className="bg-blue-50 p-4 rounded-lg mb-6">
         <h2 className="text-lg font-semibold mb-2">🖼️ Sistema de Imágenes Base64</h2>
         <p className="text-sm text-gray-600 mb-2">
           Los componentes de tipo <strong>banner</strong> requieren una imagen base64. 
           El sistema automáticamente incluye una imagen por defecto si no se especifica una.
         </p>
         <p className="text-sm text-gray-600">
           <strong>Estructura de imagen:</strong> name, type, size, data (base64 completo)
         </p>
            </div>

      {/* Configuración de Site ID y Token */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Configuración</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
            <label className="block text-sm font-medium mb-1">Site ID:</label>
              <input
                    type="text"
                    value={customSiteId}
                    onChange={(e) => setCustomSiteId(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Ingresa el Site ID"
              />
            </div>
          <div>
            <label className="block text-sm font-medium mb-1">Token:</label>
            <input
              type="text"
              value={customToken}
              onChange={(e) => setCustomToken(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Ingresa el token"
                  />
                </div>
          <div className="flex items-end">
            <button
              onClick={generarIdsParaOtroSitio}
              disabled={!customSiteId || !customToken || loading}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
            >
              {loading ? 'Generando...' : 'Generar para Otro Sitio'}
            </button>
        </div>
      </div>
              </div>

      {/* Selector de Sistema */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Sistema de Generación</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
                <input
                  type="radio"
              id="enumSystem"
              name="system"
              checked={useEnumSystem}
              onChange={() => setUseEnumSystem(true)}
                  className="mr-2"
                />
            <label htmlFor="enumSystem" className="font-medium text-green-700">
              🚀 Sistema de Enums (Recomendado)
              </label>
          </div>

          <div className="flex items-center">
                <input
                  type="radio"
              id="legacySystem"
              name="system"
              checked={!useEnumSystem}
              onChange={() => setUseEnumSystem(false)}
                  className="mr-2"
                />
            <label htmlFor="legacySystem" className="font-medium text-orange-700">
              ⚠️ Sistema de Variables de Entorno (Legacy)
              </label>
            </div>
        </div>
            </div>

      {useEnumSystem ? (
        /* Sistema de Enums */
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">🎯 Generación Individual con Enums</h3>

          <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Seleccionar Componente:</label>
              <select
                value={selectedComponent || ''}
                onChange={(e) => setSelectedComponent(e.target.value as PIXELUPComponents | CoreComponents)}
                className="w-full p-2 border rounded"
              >
                <option value="">Selecciona un componente...</option>
                <optgroup label="Componentes PIXELUP">
                  {Object.entries(PIXELUPComponents)
                    .filter(([key, value]) => !key.includes('_IMG')) // Filtrar componentes _IMG
                    .map(([key, value]) => {
                      const componentData = PIXELUP_COMPONENT_DATA[value as PIXELUPComponents];
                      const hasImage = componentData?.needsImage;
                      return (
                        <option key={value} value={value}>
                          {key.replace(/_/g, ' ')} {value !== key ? `(${value})` : ''} {hasImage ? '🖼️' : ''}
                        </option>
                      );
                    })}
                </optgroup>
                <optgroup label="Componentes Core">
                  {Object.entries(CoreComponents)
                    .filter(([key, value]) => !key.includes('_IMG')) // Filtrar componentes _IMG
                    .map(([key, value]) => {
                      const componentData = CORE_COMPONENT_DATA[value as CoreComponents];
                      const hasImage = componentData?.needsImage;
                      return (
                        <option key={value} value={value}>
                          {key.replace(/_/g, ' ')} {value !== key ? `(${value})` : ''} {hasImage ? '🖼️' : ''}
                        </option>
                      );
                    })}
                </optgroup>
              </select>
                </div>

            {selectedComponent && (
              <div className="bg-white p-4 rounded border mb-4">
                <h4 className="font-semibold mb-2">Datos por Defecto para {selectedComponent}:</h4>
                
                {/* Información de imagen hija */}
                {(() => {
                  const componentData = selectedComponent in PIXELUP_COMPONENT_DATA
                    ? getPIXELUPComponentData(selectedComponent as PIXELUPComponents)
                    : getCoreComponentData(selectedComponent as CoreComponents);
                  
                  if (componentData?.needsImage) {
                    return (
                      <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm text-blue-800">
                          <strong>🖼️ Imagen Hija:</strong> Este componente creará automáticamente una imagen hija asociada.
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          Se generarán 2 IDs: uno para el banner y otro para la imagen.
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}
                
                <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(
                    selectedComponent in PIXELUP_COMPONENT_DATA
                      ? getPIXELUPComponentDefaultData(selectedComponent as PIXELUPComponents)
                      : getCoreComponentDefaultData(selectedComponent as CoreComponents),
                    null,
                    2
                  )}
                </pre>
              </div>
            )}

                    <button
              onClick={generarComponenteIndividual}
              disabled={!selectedComponent || loading}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Creando...' : 'Crear Componente Seleccionado'}
                    </button>
                  </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">📋 Generación Masiva</h3>
            <p className="text-sm text-gray-600 mb-4">
              Componentes pendientes: {pendingComponents.length}
            </p>
            
            {pendingComponents.length > 0 && (
                    <button
                onClick={generarTodosLosPendientes}
                disabled={loading}
                className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 disabled:bg-gray-400"
              >
                {loading ? 'Generando todos...' : `Generar todos los componentes pendientes (${pendingComponents.length})`}
                    </button>
                )}
              </div>
          </div>
      ) : (
        /* Sistema Legacy */
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">⚠️ Sistema Legacy</h3>
          <p className="text-sm text-gray-600 mb-4">
            Este sistema usa variables de entorno. Los componentes se mapean automáticamente a enums cuando es posible.
          </p>
          
              <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Variable de Entorno:</label>
                <input
              type="text"
              placeholder="Ej: NEXT_PUBLIC_BANNERPRINCIPAL01_ID"
              className="w-full p-2 border rounded"
              onBlur={(e) => handleVariableInput(e.target.value)}
            />
          </div>

          {selectedComponent && (
            <div className="bg-white p-4 rounded border mb-4">
              <p className="text-sm">
                <strong>Mapeado a enum:</strong> {selectedComponent}
              </p>
          </div>
          )}
              </div>
      )}

      {/* Resultados */}
      {generatedIds.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mt-6">
                     <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-semibold">✅ IDs Generados ({generatedIds.length}):</h3>
                           <div className="space-x-2">
            <button
                  onClick={copiarIdsSimples}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
                  📋 Copiar IDs Simples
            </button>
                <button
                  onClick={copiarReferenciasParaScript}
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                >
                  📝 Referencias para Script
                </button>
                <button
                  onClick={copiarIdsParaEnums}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  📋 Copiar para Enums
                </button>
                <button
                  onClick={copiarIdsParaReemplazar}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                  🔄 Copiar para Reemplazar
                </button>
                <button
                  onClick={copiarIdsParaReemplazoDirecto}
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
                >
                  ⚡ Reemplazo Directo
                </button>
                <button
                  onClick={copiarIdsParaReemplazoMasivo}
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
                >
                  🔄 Mapeo Centralizado
                </button>
                <button
                  onClick={limpiarIdsGenerados}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  🗑️ Limpiar
                </button>
                  </div>
              </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Lista detallada */}
             <div className="bg-white p-4 rounded border">
               <h4 className="font-semibold mb-2">📋 Lista Detallada:</h4>
               <pre className="text-sm overflow-auto max-h-96">
{generatedIds.map((id, index) => 
`${index + 1}. ${id.component} (${id.type.toUpperCase()})
   ID: ${id.id}
   Variable: ${id.envVariable || 'N/A'}
`).join('\n')}
               </pre>
            </div>
             
             {/* Lista compacta para copiar */}
             <div className="bg-white p-4 rounded border">
               <h4 className="font-semibold mb-2">📋 Lista Compacta (para copiar):</h4>
               <pre className="text-sm overflow-auto max-h-96 bg-gray-50 p-2 rounded">
{generatedIds.map(id => `${id.component}: '${id.id}'`).join(',\n')}
               </pre>
        </div>
      </div>
              </div>
            )}

      {/* Probador de IDs */}
      <div className="bg-indigo-50 p-4 rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-4">🧪 Probador de IDs</h3>
        <p className="text-sm text-gray-600 mb-4">
          Prueba si los IDs existen como banners, content blocks o imágenes hijas en el sistema. 
          <br />
          <strong>Funcionalidades:</strong>
          <br />
          • 🎯 <strong>Banners:</strong> Prueba IDs de banners y automáticamente busca sus imágenes hijas
          <br />
          • 🖼️ <strong>Imágenes:</strong> Busca imágenes individuales en todos los banners
          <br />
          • 📄 <strong>Content Blocks:</strong> Prueba IDs de bloques de contenido
        </p>
        
        <div className="space-y-4">
          {/* Input para IDs */}
          <div>
            <label className="block text-sm font-medium mb-2">IDs a Probar:</label>
            <textarea
              value={testInputIds}
              onChange={(e) => setTestInputIds(e.target.value)}
              className="w-full p-3 border rounded-lg h-32"
              placeholder="Ingresa los IDs separados por comas o saltos de línea&#10;&#10;Ejemplos:&#10;• Banner con imagen hija: 42bc033c-e8aa-4301-8c8a-25f75cc1edbf&#10;• Imagen individual: f0f2aad1-291e-4aab-b3c9-befe227290c6&#10;• Content block: 64f8a1b2c3d4e5f6a7b8c9d0"
                />
              </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-2">
                <button
              onClick={probarIds}
              disabled={!testInputIds.trim() || testingIds}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {testingIds ? '🔍 Probando...' : '🧪 Probar IDs'}
                </button>
            
                <button
              onClick={probarIdsGenerados}
              disabled={generatedIds.length === 0 || testingIds}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              🎯 Probar IDs Generados
            </button>
            
            <button
              onClick={() => {
                setTestInputIds('42bc033c-e8aa-4301-8c8a-25f75cc1edbf\nf0f2aad1-291e-4aab-b3c9-befe227290c6');
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              🧪 Probar SEO Banner
            </button>
            
            <button
              onClick={limpiarResultadosPrueba}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              🗑️ Limpiar
                </button>
              </div>

          {/* Resultados de la prueba */}
          {testResults.length > 0 && (
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">📊 Resultados de la Prueba ({testResults.length}):</h4>
              
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      result.status === 'success' 
                        ? 'bg-green-50 border-green-200' 
                        : result.status === 'error'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            result.status === 'success' ? 'bg-green-500' : 
                            result.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}></span>
                          {result.id}
          </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {result.message}
        </div>
                        {result.data && (
                          <details className="mt-2">
                            <summary className="text-xs text-blue-600 cursor-pointer">
                              Ver detalles del {result.type}
                            </summary>
                            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-32">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 ml-2">
                        {result.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen */}
              <div className="mt-4 pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span>✅ Exitosos: {testResults.filter(r => r.status === 'success').length}</span>
                  <span>❌ No encontrados: {testResults.filter(r => r.status === 'not-found').length}</span>
                  <span>⚠️ Errores: {testResults.filter(r => r.status === 'error').length}</span>
                </div>
              </div>
            </div>
        )}
      </div>
      </div>

      {/* Información del Sistema */}
      <div className="bg-gray-100 p-4 rounded-lg mt-6">
        <h3 className="text-lg font-semibold mb-2">ℹ️ Información del Sistema</h3>
        <div className="text-sm space-y-1">
          <p><strong>Componentes PIXELUP:</strong> {Object.keys(PIXELUP_COMPONENT_DATA).length}</p>
          <p><strong>Componentes Core:</strong> {Object.keys(CORE_COMPONENT_DATA).length}</p>
          <p><strong>Variables mapeadas:</strong> 0 (sistema simplificado)</p>
          <p><strong>Componentes pendientes:</strong> {pendingComponents.length}</p>
          <p><strong>IDs generados en sesión:</strong> {generatedIds.length}</p>
        </div>
      </div>
      </div>
  );
};

export default ContentBlockForm;
