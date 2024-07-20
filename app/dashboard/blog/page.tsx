/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css"; // Import styles

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ImageData {
  name: string;
  type: string;
  size: number;
  url: string;
  data?: string;
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

  const resetForm = () => {
    setTitle("");
    setPreviewContent("");
    setDetailContent("");
    setPreviewImage(null);
    setDetailImage(null);
    setEditingPostId(null);
  };

  const handleEdit = (post: Post) => {
    setTitle(post.title);
    setPreviewContent(post.previewContent);
    setDetailContent(post.detailContent);
    setPreviewImage(post.previewImage);
    setDetailImage(post.detailImage);
    setEditingPostId(post.id);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  console.log("Rendering ReactQuill");

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="pb-4">
        <h2 className="text-2xl font-bold mt-8 mb-4">Edit Posts</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li
                key={post.id}
                className="p-4 border rounded-md shadow-sm flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  {/* <p
                    dangerouslySetInnerHTML={{ __html: post.previewContent }}
                    className="text-gray-700 dark:text-gray-300 mb-4"
                  /> */}
                </div>
                <button
                  onClick={() => handleEdit(post)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preview Content:
          </label>
          {/* <textarea
            value={previewContent}
            onChange={(e) => setPreviewContent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          /> */}
          <ReactQuill
            value={previewContent}
            onChange={setPreviewContent}
            className="mt-1 h-auto bg-white"
            modules={modules}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Detail Content:
          </label>
          <ReactQuill
            value={detailContent}
            onChange={setDetailContent}
            className="mt-1 h-auto bg-white"
            modules={modules}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preview Image:
          </label>
          <input
            type="file"
            onChange={(e) => handleImageUpload(e, setPreviewImage)}
            className="mt-1 block w-full text-sm text-gray-900 border-gray-300 rounded-md cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
          />
          {previewImage && (
            <img
              src={previewImage.url}
              alt="Preview"
              className="mt-2 h-40"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Detail Image:
          </label>
          <input
            type="file"
            onChange={(e) => handleImageUpload(e, setDetailImage)}
            className="mt-1 block w-full text-sm text-gray-900 border-gray-300 rounded-md cursor-pointer focus:outline-none focus:border-indigo-500 focus:ring-indigo-500"
          />
          {detailImage && (
            <img
              src={detailImage.url}
              alt="Detail"
              className="mt-2 h-40"
            />
          )}
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {editingPostId ? "Update Post" : "Create Post"}
          </button>
          {editingPostId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center px-4 py-2 ml-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreateOrEditPost;
