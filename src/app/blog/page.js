import Navbar from "@/components/navbar/nav";
import { Card, MainCard } from "./_components/cards";
import axios from "axios";

async function getBlogs() {
  try {
    const res = await axios.get(
      `${process.env.STRAPI_API}api/aurify-blogs?populate=*`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.BLOG_TOKEN}`,
        },
        timeout: 5000,
      }
    );
    return res;
  } catch (error) {
    console.error(
      "Unable to fetch blog posts:",
      error.response?.status || error.code || error.message
    );
    return { data: { data: [] } };
  }
}

export default async function BlogPage() {
  const data = await getBlogs();
  const blogContent = data.data.data;
  const mainBlog = blogContent[2];

  if (!mainBlog) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <h2 className="text-x-head md:text-l-head roboto-font font-bold text-center mt-5 text-primary">
            The Aurify Blog
          </h2>
          <div className="my-20 text-center">
            <p className="text-lg text-p-text">
              No blog posts are available right now.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const title = mainBlog.attributes.title;
  const description = mainBlog.attributes.description;
  const urlSlug = mainBlog.attributes.urlSlug;
  const image = mainBlog.attributes.image.data.attributes.url;

  return (
    <div>
      <Navbar/>
      <div className="container">
        <h2 className="text-x-head md:text-l-head roboto-font font-bold text-center mt-5 text-primary">
          The Aurify Blog
        </h2>
        {/* Latest/popular */}
        <div className="my-10">
          <MainCard
            title={title}
            description={description}
            urlSlug={urlSlug}
            image={image}
          />
        </div>

        {/* others */}
        <div className="my-20 gap-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {blogContent?.map((blog) => (
            <Card
              key={blog.id}
              title={blog.attributes.title}
              description={blog.attributes.description}
              urlSlug={blog.attributes.urlSlug}
              thumbnail={blog.attributes.image.data.attributes.url}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
