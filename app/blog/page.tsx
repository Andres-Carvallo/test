/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

interface Post {
  id: string;
  title: string;
  previewContent: string;
  previewImage: { url: string };
  creationDate: string;
  detailContent: string;
  detailImage: { url: string };
  slug: string;
}

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_CLIENTE}/api/v1/articles?pageSize=10&pageNumber=1&siteId=${process.env.NEXT_PUBLIC_API_URL_SITEID}`
        );
        setPosts(response.data.articles);
      } catch (error) {
        console.error("Error fetching posts", error);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative overflow-hidden rounded-sm bg-white shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-dark"
          >
            <Link
              href={`/blog/post/${post.id}`}
              className="relative block aspect-w-16 aspect-h-9"
            >
              <img
                src={post.previewImage.url}
                alt={post.title}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                <Link
                  href={`/blog/post/${post.id}`}
                  className="text-gray-900 hover:text-indigo-600 dark:text-white dark:hover:text-indigo-400"
                >
                  {post.title}
                </Link>
              </h2>
              <p
                dangerouslySetInnerHTML={{ __html: post.previewContent }}
                className="text-gray-700 dark:text-gray-300 mb-4"
              />

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Published on {new Date(post.creationDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsList;
