import notFound from "../../../../public/images/404.svg";
import Image from "next/image";
import Link from "next/link";

export default function PageNotFound() {
  return (
    <div className="flex items-center flex-col sm:flex-row-reverse container">
      {/* Image */}
      <div className="w-full md:w-1/2">
        <Image 
          className="w-[400px] md:w-full"
          src={notFound}
          width={200}
          height={200}
          alt="404 not found Image"
        />
      </div>
      {/* text */}
      <div className="text-left w-full md:w-1/2 text-x-head md:text-l-head text-primary">
        OOPS!!
        <p className="text-xl text-p-text">
            Wrong url maybe?
            <br/>
          we may have updated the title so pls check the blog page
        </p>
        <div>
          <Link
            href="/blog"
            className="text-x-description md:text-x-sub-head underline"
          >
            Go back to blog page
          </Link>
        </div>
      </div>
    </div>
  );
}
