import config from "@/app/config";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export default function Post({ title, description, content, imgUrl, altText, date }) {
  return (
    <div>
      {/* thumbnail and title */}
      <div className="flex flex-col md:flex-row md:items-center gap-8 my-5">
        <Image
          alt={altText}
          width={500}
          height={500}
          src={`${config.strapi}${imgUrl}`}
          className="w-full md:w-1/2"
        />

        <div className="flex gap-2 flex-col">
          <p className="text-p-text inter-font">{date}</p>
          <h1 className="text-x-head md:text-l-head text-primary font-bold roboto-font leading-10">
            {title}
          </h1>
          <p className="text-p-text inter-font leading-7">{description}</p>
        </div>
      </div>
      {/* Content */}
      <ReactMarkdown
        className="markdown"
        children={content}
        components={{
          p: ({ node, ...props }) => <p {...props} />,
          h1: ({ node, ...props }) => <h1 {...props} />,
          h2: ({ node, ...props }) => <h2 {...props} />,
          ul: ({ node, ...props }) => <ul {...props} />,
          ol: ({ node, ...props }) => <ol {...props} />,
          blockquote: ({ node, ...props }) => <blockquote {...props} />,
          a: ({ node, ...props }) => <a {...props} />,
          code: ({ node, ...props }) => <code {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
