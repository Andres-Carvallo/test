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
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
      {post.detailImage?.url && (
        <div className="relative w-full h-96 mb-6">
          <img
            src={post.detailImage.url}
            alt={post.title}
            className="rounded-md w-full h-full object-cover"
          />
        </div>
      )}
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Published on {new Date(post.creationDate).toLocaleDateString()}
      </p>
      <div className="prose max-w-none dark:prose-invert prose-img:rounded-lg prose-img:mx-auto mb-4">
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
