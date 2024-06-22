import Post from "../_components/post";
import axios from "axios";
import config from "@/app/config";
import Link from "next/link";
async function getBlogPost() {
  try {
    const response = await axios.get("http://localhost:3000/blog/api/");
    return response;
  } catch (error) {
    console.error(error);
    return { data: { data: [] } };
  }
}

export default async function Page({ params }) {
  const data = await getBlogPost();

  const blogArray = data?.data?.data;
  const filterdPost = blogArray?.filter(
    (blog) => blog.attributes.urlSlug === params.slug
  );
  
  if (!filterdPost || filterdPost.length === 0) {
    return (
      <div
        className="text-x-head md:text-l-head text-primary flex h-[100vh]
      items-center justify-center flex-col"
      >
        Post not found
        <div>
          <Link
            href="/blog"
            className="text-x-sub-head md:text-l-sub-head underline"
          >
            Go back to blog page
          </Link>
        </div>
      </div>
    );
  }
  const blogContent = filterdPost[0];
  const title = blogContent?.attributes?.title;
  const description = blogContent?.attributes?.description;
  const content = blogContent?.attributes?.content;
  const img = blogContent?.attributes?.image?.data?.attributes?.url;
  const altText =
    blogContent?.attributes?.image?.data?.attributes?.alternativeText;

  return (
    <div className="container">
      <Post
        title={title}
        description={description}
        content={content}
        imgUrl={img}
        altText={altText}
      />
    </div>
  );
}
