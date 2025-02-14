/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import CategoryModal from "./components/CategoryModal";
import CategoryPills from "./components/CategoryPills";
import Modal from "@/components/Core/Modals/ModalSeo";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";
import imageCompression from "browser-image-compression";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ImageData {
  name: string;
  type: string;
  size: number;
  url: string;
  data?: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  statusCode: string;
}

interface Post {
  id: string;
  title: string;
  previewContent: string;
  detailContent: string;
  previewImage: ImageData;
  detailImage: ImageData;
  creationDate: string;
  slug: string;
  articleCategories: Category[];
}

const CreateOrEditPost: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [previewContent, setPreviewContent] = useState<string>("");
  const [detailContent, setDetailContent] = useState<string>("");

  const [previewImage, setPreviewImage] = useState<ImageData | null>(null);
  const [detailImage, setDetailImage] = useState<ImageData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"preview" | "detail">("preview");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Agregar estados para el cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageType, setCurrentImageType] = useState<
    "preview" | "detail" | null
  >(null);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "preview" | "detail"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result as string);
        setCurrentImageType(type);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleCrop = async () => {
    if (!tempImage || !fileName) return;

    try {
      const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
      if (!croppedImage) {
        console.error("Error al recortar la imagen: croppedImage es null");
        return;
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1900,
        useWebWorker: true,
        initialQuality: 0.95,
      };
      const compressedFile = await imageCompression(
        croppedImage as File,
        options
      );
      const base64 = await convertToBase64(compressedFile);

      const imageInfo: ImageData = {
        name: fileName,
        type: compressedFile.type,
        size: compressedFile.size,
        url: URL.createObjectURL(compressedFile),
        data: base64,
      };

      if (currentImageType === "preview") {
        setPreviewImage(imageInfo);
      } else {
        setDetailImage(imageInfo);
      }

      setIsModalOpen(false);
      setTempImage(null);
      setCurrentImageType(null);
    } catch (error) {
      console.error("Error al recortar/comprimir la imagen:", error);
    }
  };

  const convertToBase64 = (file: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const postData: any = {
      title,
      previewContent,
      detailContent,
      articleCategories: selectedCategories.map((id) => ({ id })),
    };

    if (previewImage?.data) {
      postData.previewImage = previewImage;
    }
    if (detailImage?.data) {
      postData.detailImage = detailImage;
    }

    try {
      const token = getCookie("AdminTokenAuth");
      if (editingPostId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/articles/${editingPostId}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Post updated successfully");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/articles?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Post created successfully");
      }
      fetchPosts();
      resetForm();
    } catch (error) {
      console.error("Error creating/updating post", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/articles?pageSize=10&pageNumber=1&status=ACTIVE&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
      );
      console.log("Estructura de respuesta:", response.data);
      setPosts(response.data.articles);
    } catch (error) {
      console.error("Error fetching posts", error);
      setError("Failed to fetch posts. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setPreviewContent("");
    setDetailContent("");
    setPreviewImage(null);
    setDetailImage(null);
    setEditingPostId(null);
    setSelectedCategories([]);
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title);
    setPreviewContent(post.previewContent);
    setDetailContent(post.detailContent);
    setPreviewImage(post.previewImage);
    setDetailImage(post.detailImage);
    setEditingPostId(post.id);
    setSelectedCategories(post.articleCategories.map((cat) => cat.id));
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/article-categories?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}&pageSize=100&pageNumber=1`
      );
      setCategories(response.data.articleCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!postId) return;
    setPostToDelete(postId);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!postToDelete) return;

    try {
      const token = getCookie("AdminTokenAuth");
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/articles/${postToDelete}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchPosts();
      resetForm();
      setIsDeleteModalOpen(false);
      setPostToDelete(null);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([
        import("quill"),
        // @ts-ignore - Ignoramos error de tipado para el módulo de resize
        import("quill-image-resize-module-react"),
      ])
        .then(([Quill, ImageResize]) => {
          Quill.default.register("modules/imageResize", ImageResize.default);
        })
        .catch((err) => {
          console.error("Error loading Quill modules:", err);
        });
    }
  }, []);

  // Definimos dos configuraciones diferentes de módulos para los editores
  const previewModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const detailModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: ["", "center", "right", "justify"] }],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
    imageResize: {
      modules: ["Resize", "DisplaySize", "Toolbar"],
      displaySize: true,
      handleStyles: {
        backgroundColor: "#ec4899",
        border: "none",
        borderRadius: "50%",
      },
      toolbarStyles: {
        backgroundColor: "#f3f4f6",
        border: "none",
        borderRadius: "4px",
      },
      toolbarButtons: {
        alignLeft: true,
        alignCenter: true,
        alignRight: true,
      },
    },
  };

  const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "align",
    "color",
    "background",
    "blockquote",
    "code-block",
    "link",
    "image",
    "width",
  ];

  // Función para refrescar las categorías
  const refreshCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/article-categories?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}&pageSize=100&pageNumber=1`
      );
      setCategories(response.data.articleCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Panel de Posts Existentes */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Administrar Posts
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <select
                  onChange={(e) => {
                    const selectedPost = posts.find(
                      (post) => post.id === e.target.value
                    );
                    if (selectedPost) handleEdit(selectedPost);
                  }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
                             focus:ring-2 focus:ring-pink-500 focus:border-pink-500
                             appearance-none cursor-pointer"
                >
                  <option value="">Seleccionar un post para editar</option>
                  {posts
                    .sort(
                      (a, b) =>
                        new Date(b.creationDate).getTime() -
                        new Date(a.creationDate).getTime()
                    )
                    .map((post) => (
                      <option
                        key={post.id}
                        value={post.id}
                        className="flex justify-between"
                      >
                        {`[${new Date(
                          post.creationDate
                        ).toLocaleDateString()}] ${
                          post.title
                        }                                `}
                      </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              {/* Botón de eliminar */}
              {editingPostId && (
                <button
                  onClick={() => handleDelete(editingPostId)}
                  className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Eliminar Post Seleccionado</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Formulario de Creación/Edición */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {editingPostId ? "Editar Post" : "Crear Nuevo Post"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Sección superior: Título e Imágenes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Título - ocupa todo el ancho en móvil, 1/3 en desktop */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Ingresa el título del post"
                />
              </div>

              {/* Categorías */}
              <div className="lg:col-span-3">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Categorías
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="px-3 py-1 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                  >
                    + Nueva Categoría
                  </button>
                </div>

                {/* Pills de categorías */}
                <div className="bg-white dark:bg-gray-700 overflow-x-auto">
                  <CategoryPills
                    categories={categories as any}
                    selectedCategories={selectedCategories}
                    onCategorySelect={(categoryId) => {
                      if (selectedCategories.includes(categoryId)) {
                        setSelectedCategories(
                          selectedCategories.filter((id) => id !== categoryId)
                        );
                      } else {
                        setSelectedCategories([
                          ...selectedCategories,
                          categoryId,
                        ]);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Imágenes - ocupan 2/3 del espacio en desktop */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Preview Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imagen de Vista Previa
                  </label>
                  {previewImage ? (
                    <div className="relative group">
                      <img
                        src={previewImage.url}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setPreviewImage(null)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                          Eliminar imagen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-pink-500 transition-colors">
                      <label className="cursor-pointer block">
                        <div className="space-y-2">
                          <div className="mx-auto h-12 w-12 text-gray-400">
                            <svg
                              className="w-full h-full"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-pink-600 dark:text-pink-400 font-medium">
                              Haz clic para subir
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF hasta 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "preview")}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Detail Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Imagen de Detalle
                  </label>
                  {detailImage ? (
                    <div className="relative group">
                      <img
                        src={detailImage.url}
                        alt="Detail"
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setDetailImage(null)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                          Eliminar imagen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-pink-500 transition-colors">
                      <label className="cursor-pointer block">
                        <div className="space-y-2">
                          <div className="mx-auto h-12 w-12 text-gray-400">
                            <svg
                              className="w-full h-full"
                              stroke="currentColor"
                              fill="none"
                              viewBox="0 0 48 48"
                            >
                              <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-pink-600 dark:text-pink-400 font-medium">
                              Haz clic para subir
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF hasta 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, "detail")}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reemplazar la sección de Tabs y Editor por esto: */}
            <div className="mt-6 grid grid-cols-1 gap-12">
              {/* Editor de Vista Previa */}
              <div className="preview-editor">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Vista Previa (máx. 500 caracteres)
                </h3>
                <ReactQuill
                  value={previewContent}
                  onChange={(content) => {
                    const textOnly = content.replace(/<[^>]*>/g, "");
                    if (textOnly.length <= 500) {
                      setPreviewContent(content);
                    }
                  }}
                  modules={previewModules}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "list",
                    "bullet",
                  ]}
                  theme="snow"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {500 - previewContent.replace(/<[^>]*>/g, "").length}{" "}
                  caracteres restantes
                </p>
              </div>

              {/* Editor de Contenido Detallado */}
              <div className="detail-editor">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Contenido Detallado
                </h3>
                <ReactQuill
                  value={detailContent}
                  onChange={setDetailContent}
                  modules={detailModules}
                  formats={formats}
                  theme="snow"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-4 pt-6">
              {editingPostId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
              >
                {editingPostId ? "Actualizar Post" : "Crear Post"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de categorías */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryCreated={refreshCategories}
      />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

          {/* Modal */}
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              {/* Ícono de advertencia */}
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <svg
                  className="h-6 w-6 text-red-600 dark:text-red-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>

              {/* Contenido del modal */}
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
                  Confirmar eliminación
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ¿Estás seguro de que deseas eliminar este post? Esta acción
                    no se puede deshacer.
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 sm:col-start-2"
                  onClick={executeDelete}
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setPostToDelete(null);
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de recorte */}
      {isModalOpen && (
        <Modal
          showModal={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTempImage(null);
            setCurrentImageType(null);
          }}
        >
          <div className="relative h-96 w-full">
            <Cropper
              image={tempImage || ""}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={handleCropComplete}
            />
          </div>
          <div className="flex flex-col justify-end">
            <div className="w-full py-6">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.01}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="zoom-range w-full custom-range"
              />
            </div>
            <div className="flex justify-between w-full gap-2">
              <button
                onClick={handleCrop}
                className="bg-primary text-[13px] md:text-[16px] hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Recortar y Subir
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setTempImage(null);
                  setCurrentImageType(null);
                }}
                className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-[13px] md:text-[16px]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// Actualiza los estilos
const styles = `
  .ql-container {
    font-size: 16px;
  }

  .ql-editor {
    min-height: 150px;
    padding: 1rem;
    overflow-y: auto;
  }

  /* Editor de vista previa */
  .preview-editor .ql-editor {
    height: 150px;
  }

  /* Editor de contenido detallado */
  .detail-editor .ql-editor {
    height: 550px;
  }

  .ql-snow .ql-toolbar {
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .ql-container.ql-snow {
    border-bottom-left-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
    border: 1px solid #e5e7eb;
  }

  .dark .ql-toolbar {
    background-color: #374151;
    border-color: #4b5563;
  }

  .dark .ql-container {
    border-color: #4b5563;
  }

  .dark .ql-editor {
    color: #e5e7eb;
  }

  .dark .ql-snow .ql-stroke {
    stroke: #e5e7eb;
  }

  .dark .ql-snow .ql-fill {
    fill: #e5e7eb;
  }

  /* Personalización de la barra de herramientas */
  .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
    color: #ec4899;
  }

  .ql-snow .ql-stroke {
    stroke: #ec4899;
  }

  .ql-snow .ql-fill {
    fill: #ec4899;
  }

  .ql-snow .ql-picker.ql-expanded .ql-picker-label {
    border-color: #ec4899;
  }

  .ql-snow .ql-picker.ql-expanded .ql-picker-options {
    border-color: #ec4899;
  }

  .ql-snow .ql-toolbar button:hover,
  .ql-snow .ql-toolbar button:focus,
  .ql-snow .ql-toolbar button.ql-active,
  .ql-snow .ql-toolbar .ql-picker-label:hover,
  .ql-snow .ql-toolbar .ql-picker-label.ql-active,
  .ql-snow .ql-toolbar .ql-picker-item:hover,
  .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
    color: #ec4899;
  }

  .ql-snow .ql-toolbar button:hover .ql-stroke,
  .ql-snow .ql-toolbar button:focus .ql-stroke,
  .ql-snow .ql-toolbar button.ql-active .ql-stroke,
  .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
  .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
  .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
  .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke {
    stroke: #ec4899;
  }

  .ql-snow .ql-toolbar button:hover .ql-fill,
  .ql-snow .ql-toolbar button:focus .ql-fill,
  .ql-snow .ql-toolbar button.ql-active .ql-fill,
  .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
  .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
  .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
  .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill {
    fill: #ec4899;
  }

  /* Modo oscuro */
  .dark .ql-snow .ql-stroke {
    stroke: #f472b6; /* pink-400 */
  }

  .dark .ql-snow .ql-fill {
    fill: #f472b6;
  }

  .ql-editor p {
    clear: both;
    margin-top: 1em;
  }

  .ql-editor img {
    max-width: 100%;
    height: auto;
    display: inline-block;
    margin: 1em 0;
  }

  .image-resizer {
    clear: none !important;
  }

  /* Estilos de alineación de imágenes */
  .ql-editor .ql-align-left {
    text-align: left;
  }

  .ql-editor .ql-align-center {
    text-align: center;
  }

  .ql-editor .ql-align-right {
    text-align: right;
  }

  .ql-editor .ql-align-justify {
    text-align: justify;
  }

  /* Estilos específicos para imágenes */
  .ql-editor p img {
    max-width: 100%;
    height: auto;
    display: inline-block;
    margin: 1em 0;
  }

  .ql-editor p.ql-align-center img {
    margin-left: auto;
    margin-right: auto;
  }

  .ql-editor p.ql-align-right img {
    margin-left: auto;
    margin-right: 0;
  }

  .ql-editor p.ql-align-left img {
    margin-right: auto;
    margin-left: 0;
  }
`;

// Agrega los estilos al documento
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default CreateOrEditPost;
