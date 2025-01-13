/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import CategoryModal from "./components/CategoryModal";
import CategoryPills from "./components/CategoryPills";

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

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImage: (image: ImageData) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result?.toString().split(",")[1] || "";
        setImage({
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          data: `data:${file.type};base64,${base64Data}`,
        });
      };
      reader.readAsDataURL(file);
    }
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

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      ["link", "image"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
    // @ts-ignore
    imageResize: {
      modules: ["Resize", "DisplaySize"],
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105"
                >
                  {post.previewImage && (
                    <img
                      src={post.previewImage.url}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-gray-500 dark:text-gray-300">
                        {new Date(post.creationDate).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => handleEdit(post)}
                        className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
                          onChange={(e) =>
                            handleImageUpload(e, setPreviewImage)
                          }
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
                          onChange={(e) => handleImageUpload(e, setDetailImage)}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs para los editores */}
            <div className="mt-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                  <button
                    type="button"
                    onClick={() => setActiveTab("preview")}
                    className={`${
                      activeTab === "preview"
                        ? "border-pink-500 text-pink-600 dark:text-pink-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Vista Previa
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("detail")}
                    className={`${
                      activeTab === "detail"
                        ? "border-pink-500 text-pink-600 dark:text-pink-400"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400"
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Contenido Detallado
                  </button>
                </nav>
              </div>

              {/* Editor Contenido */}
              <div
                className="mt-4"
                style={{ minHeight: "600px" }}
              >
                <ReactQuill
                  value={
                    activeTab === "preview" ? previewContent : detailContent
                  }
                  onChange={(content) => {
                    if (activeTab === "preview") {
                      setPreviewContent(content);
                    } else {
                      setDetailContent(content);
                    }
                  }}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                  className="h-[600px]"
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
    </div>
  );
};

// Actualiza los estilos
const styles = `
  .ql-container {
    font-size: 16px;
  }

  .ql-editor {
    min-height: 550px;
    height: 550px;
    padding: 1rem;
    overflow-y: auto;
  }

  .ql-editor img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1em auto;
    cursor: pointer;
  }

  /* Estilos para imágenes redimensionables */
  .ql-editor .image-resizer {
    position: relative;
    display: inline-block;
  }

  .ql-editor .image-resizer img {
    display: block;
  }

  .ql-editor .image-resizer .resize-handle {
    position: absolute;
    height: 8px;
    width: 8px;
    background-color: #ec4899;
    border-radius: 50%;
  }

  .ql-editor .image-resizer .resize-handle.se {
    bottom: -4px;
    right: -4px;
    cursor: se-resize;
  }

  .ql-editor .image-resizer .resize-handle.sw {
    bottom: -4px;
    left: -4px;
    cursor: sw-resize;
  }

  .ql-editor .image-resizer .resize-handle.ne {
    top: -4px;
    right: -4px;
    cursor: ne-resize;
  }

  .ql-editor .image-resizer .resize-handle.nw {
    top: -4px;
    left: -4px;
    cursor: nw-resize;
  }

  .ql-snow .ql-toolbar {
    border-top-left-radius: 0.375rem;
    border-top-right-radius: 0.375rem;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    z-index: 10;
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
`;

// Agrega los estilos al documento
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default CreateOrEditPost;
