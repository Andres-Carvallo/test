/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  previewContent: string;
  previewImage: { url: string };
  creationDate: string;
  detailContent: string;
  detailImage: { url: string };
  slug: string;
  articleCategories: Category[];
}

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, categoriesResponse] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/articles?pageSize=10&pageNumber=1&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/article-categories?siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}&pageSize=10&pageNumber=1`
          ),
        ]);

        setPosts(postsResponse.data.articles);
        setCategories(categoriesResponse.data.articleCategories || []);
      } catch (error) {
        console.error("Error fetching data", error);
        setError("Error al cargar los datos. Por favor, intente más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = selectedCategory
    ? posts.filter((post) =>
        post.articleCategories.some((cat) => cat.id === selectedCategory)
      )
    : posts;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center mb-6">Nuestro Blog</h1>
        <div className="flex justify-center mb-6">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Todas las categorías</option>
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Link
              href={`/blog/post/${post.id}`}
              className="block"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.previewImage.url}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex gap-2">
                    {post.articleCategories.map((cat) => (
                      <span
                        key={cat.id}
                        className="text-xs text-white px-2 py-1 rounded-full bg-indigo-600"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-3">
                <Link
                  href={`/blog/post/${post.id}`}
                  className="text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                >
                  {post.title}
                </Link>
              </h2>
              <div
                dangerouslySetInnerHTML={{ __html: post.previewContent }}
                className="text-gray-700 dark:text-gray-300 mb-4 prose prose-img:rounded-lg prose-img:mx-auto"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.creationDate).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <Link
                  href={`/blog/post/${post.id}`}
                  className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
                >
                  Leer más →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsList;
