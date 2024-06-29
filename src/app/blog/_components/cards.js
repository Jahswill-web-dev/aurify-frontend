import Image from "next/image";
import studyImage from "../../../../public/images/study.jpg";
import lofiImage from "../../../../public/images/lofi-8306349_1920.jpg";
import Link from "next/link";
import config from "@/app/config";

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

function MainCard({ title, description, image, urlSlug }) {
  return (
    <Link href={`/blog/${urlSlug}`}>
      <div
        className=" zoom-in flex flex-col md:flex-row md:items-center md:gap-5
      "
      >
        <Image
          alt=""
          src={`${config.strapi}${image}`}
          className="w-full md:w-1/2 h-[304px] object-cover"
          width={700}
          height={700}
        />
        <div className="flex flex-col gap-1 md:w-1/2">
          <h1 className="text-xx-head md:text-l-head font-semibold text-primary">
            {title}
          </h1>
          <p className="text-lg text-p-text">{description}</p>
        </div>
      </div>
    </Link>
  );
}

function Card({ title, description, urlSlug, thumbnail }) {
  return (
    <Link href={`/blog/${urlSlug}`}>
      <div className="zoom-in transition-all">
        {/* Images */}
        <Image
          alt="blog image"
          src={`${config.strapi}${thumbnail}`}
          className="w-full h-[304px] object-cover"
          width={800}
          height={800}
        />
        {/* texts */}
        <div className="flex flex-col gap-2">
          <h2 className="text-x-head md:text-l-sub-head font-semibold text-primary">
            {title}
          </h2>
          <p className="text-x-description md:text-l-description text-p-text">
            {truncateText(description, 60)}
          </p>
        </div>
      </div>
    </Link>
  );
}

export { Card, MainCard };
