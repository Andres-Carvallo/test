/* eslint-disable @next/next/no-img-element */
import { GetServerSideProps } from "next";
import axios from "axios";

interface Post {
  id: string;
  title: string;
  detailContent: string;
  detailImage: string;
}

interface PostDetailProps {
  post: Post;
}

const PostDetail: React.FC<PostDetailProps> = ({ post }) => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      {post.detailImage && (
        <img
          src={post.detailImage}
          alt={post.title}
          className="w-full h-auto mb-4"
        />
      )}
      <div className="prose">
        <p>{post.detailContent}</p>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;
  const siteID = process.env.NEXT_PUBLIC_API_URL_SITEID;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_BO_CLIENTE}/api/v1/articles/${id}?siteId=${siteID}`
    );
    return {
      props: {
        post: response.data,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};

export default PostDetail;
