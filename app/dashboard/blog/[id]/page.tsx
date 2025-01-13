"use client";
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Post {
  id: string;
  title: string;
  detailContent: string;
  detailImage: string;
  creationDate: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        const data = await response.json();
        setPost(data.article);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            {error}
          </div>
        </div>
      ) : post ? (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <time className="text-gray-500 dark:text-gray-400">
                {new Date(post.creationDate).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </header>

          {post.detailImage && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <img
                src={post.detailImage}
                alt={post.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: post.detailContent }}
              className="text-gray-800 dark:text-gray-200"
            />
          </div>
        </article>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="text-gray-600 dark:text-gray-400 text-xl">
            Post no encontrado
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
