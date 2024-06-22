import Image from "next/image";
import studyImage from "../../../../public/images/study.jpg";
import lofiImage from "../../../../public/images/lofi-8306349_1920.jpg";
import Link from "next/link";

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

function MainCard({ title, description }) {
  return (
    <div
      className="flex flex-col md:flex-row md:items-center md:gap-5
    "
    >
      <Image
        alt="animated girl studying with a laptop"
        src={lofiImage}
        className="w-full md:w-1/2"
        width={700}
        height={700}
      />
      <div className="flex flex-col gap-1 md:w-1/2">
        <h1 className="text-xx-head md:text-l-head font-semibold text-primary">
          7 proven methods to prepare for an exam
        </h1>
        <p className="text-lg text-p-text">
          Learn to prepare for an exam the proper way
        </p>
      </div>
    </div>
  );
}

function Card({ title, description, urlSlug }) {
  return (
    <Link href={`/blog/${urlSlug}`}>
      <div className="hover:scale-105 cursor-pointer transition-all">
        {/* Images */}
        <Image
          alt="blog image"
          src={studyImage}
          className="w-full"
          width={700}
          height={700}
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
