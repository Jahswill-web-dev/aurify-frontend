import Post from "../_components/post";
import axios from "axios";
import moment from "moment";
import Link from "next/link";
import config from "@/app/config";
import PageNotFound from "../_components/notfound";
// or Dynamic metadata
export async function generateMetadata({ params }) {
  const response = await axios.get(`${process.env.STRAPI_API}api/aurify-blogs?populate=*`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BLOG_TOKEN}`,
      },
    });
  const posts = response.data.data;
  const post = posts.find((post) => post.attributes.urlSlug === params.slug);

  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    title: post.attributes.title,
    description: post.attributes.description,
  };
}

// Fetch data for a single blog post based on the slug
export async function generateStaticParams() {
  const response = await axios.get(`${process.env.STRAPI_API}api/aurify-blogs?populate=*`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BLOG_TOKEN}`,
      },
    });
  const posts = response.data.data;

  if (!posts) {
    return {
      notFound: true,
    };
  }

  return posts.map((post) => ({
    slug: post.attributes.urlSlug,
  }));
}

export default async function Page({ params }) {
  const response = await axios.get(`${process.env.STRAPI_API}api/aurify-blogs?populate=*`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.BLOG_TOKEN}`,
      },
    });
  const posts = response.data.data;
  const filteredPost = posts.find(
    (post) => post.attributes.urlSlug === params.slug
  );

  if (!filteredPost) {
    return(
      <PageNotFound/>
    )
  }
  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };
  const formatDate = (dateString) => {
    const date = moment(dateString);
    const day = date.date();
    const dayWithSuffix = getOrdinalSuffix(day);
    const month = date.format("MMMM");
    const year = date.format("YYYY");

    return `Published ${dayWithSuffix} ${month} ${year}`;
  };

  const { attributes } = filteredPost;
  const title = attributes?.title;
  const description = attributes?.description;
  const content = attributes?.content;
  const img = attributes?.image?.data?.attributes?.url;
  const altText = attributes?.image?.data?.attributes?.alternativeText;
  console.log(img)
  const formattedDate = formatDate(attributes?.publishedAt);

  return (
    <div className="container">
      <Post
        title={title}
        description={description}
        content={content}
        imgUrl={img}
        altText={altText}
        date={formattedDate}
      />
    </div>
  );
}
