/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Post {
  id: string;
  title: string;
  detailContent: string;
  detailImage: { url: string };
  creationDate: string;
  previewContent: string;
  previewImage: { url: string };
}

const styles = `
  /* Estilos base */
  .ql-editor {
    padding: 0;
    overflow-x: hidden;
    max-width: 100%;
  }

  /* Estilos de texto */
  .ql-editor p {
    margin-bottom: 1em;
    clear: both;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  /* Encabezados */
  .ql-editor h1 {
    font-size: 2em;
    font-weight: bold;
    margin-bottom: 0.5em;
  }

  .ql-editor h2 {
    font-size: 1.5em;
    font-weight: bold;
    margin-bottom: 0.5em;
  }

  .ql-editor h3 {
    font-size: 1.17em;
    font-weight: bold;
    margin-bottom: 0.5em;
  }

  /* Alineación */
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

  /* Imágenes */
  .ql-editor img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1em auto;
    object-fit: contain;
  }

  /* Contenedores de imágenes */
  .ql-editor p:has(img) {
    max-width: 100%;
    overflow: hidden;
  }

  /* Ajustes para imágenes alineadas */
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

  /* Asegurar que todos los elementos respeten el ancho máximo */
  .ql-editor * {
    max-width: 100%;
    box-sizing: border-box;
  }

  /* Estilos de texto */
  .ql-editor strong {
    font-weight: bold;
  }

  .ql-editor em {
    font-style: italic;
  }

  .ql-editor u {
    text-decoration: underline;
  }

  .ql-editor strike {
    text-decoration: line-through;
  }

  /* Blockquotes */
  .ql-editor blockquote {
    border-left: 4px solid #ccc;
    margin-bottom: 1em;
    margin-top: 1em;
    padding-left: 16px;
  }

  /* Código */
  .ql-editor pre {
    background-color: #f0f0f0;
    border-radius: 3px;
    padding: 1em;
    margin-bottom: 1em;
    white-space: pre-wrap;
  }

  /* Modo oscuro */
  .dark .ql-editor pre {
    background-color: #2d3748;
  }

  .dark .ql-editor blockquote {
    border-left-color: #4a5568;
  }
`;

// Agregar los estilos al documento
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/articles/${id}?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
        );
        setPost(response.data.article);
      } catch (error) {
        console.error("Error fetching post", error);
        setError("Failed to fetch post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  if (!post) {
    return <div className="text-center mt-8">Post not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 overflow-hidden">
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
      {post.detailImage?.url && (
        <div className="relative w-full mb-6 overflow-hidden">
          <img
            src={post.detailImage.url}
            alt={post.title}
            className="rounded-md w-full object-cover"
          />
        </div>
      )}
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Published on {new Date(post.creationDate).toLocaleDateString()}
      </p>
      <div className="ql-editor prose dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: post.detailContent }} />
      </div>
      {post.previewImage?.url && (
        <div className="relative w-full h-48 mt-6">
          <img
            src={post.previewImage.url}
            alt="Preview"
            className="rounded-md w-full h-full object-cover"
          />
        </div>
      )}
      <div className="prose dark:prose-dark">
        <div dangerouslySetInnerHTML={{ __html: post.previewContent }} />
      </div>
    </div>
  );
};

export default PostDetail;
