import Image from "next/image";
import productImage from "../../../public/images/product-image.png";
import Link from "next/link";
import productImage2 from "../../../public/images/product-image2.png";
import { FirstCard, SecondCard } from "./card";
import questionImg from "../../../public/images/question-img.png";
import allFeatureImage from "../../../public/images/all-feature-image.png";
import allFeatureMobileImage from "../../../public/images/all-feature-mobile-image.png";

function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="flex flex-col gap-5 items-center mt-10 md:mt-32">
        <h1 className="poppins-font-bold text-h3 md:text-h1 text-primary-100 text-center ">
          Study Smarter, Not Harder - Everything You Need to Become an A+
          Student!
        </h1>
        <h4 className="text-grey-50 inter-font-bold text-h5 md:text-h4 text-center">
          Learn Faster, Retain More—The AI-Powered Tool to Help You Become an A+
          Student.
        </h4>
        <Link
          href="/signup"
          className="border border-grey-50 poppins-font-bold text-h4 bg-accent-100 px-[36px] py-[20px] text-primary-100 rounded-[11.56px]"
        >
          Get Started
        </Link>
        <Image
          src={productImage}
          width={924}
          height={667}
          alt="product Image"
        />
      </div>
      {/* About Product Section */}
      <div className="flex flex-col gap-5 items-center md:flex-row mt-28">
        <div className="md:w-1/2 flex justify-end">
          <Image src={productImage2} alt="products Image" className="max-w-[400px]" />
        </div>
        <div className="text-center md:text-left flex flex-col gap-5 md:w-1/2">
          <h2 className="text-primary-100 text-h3 md:text-h4 lg:text-h3 poppins-font-bold">
            The One Tool To Become Your Best
          </h2>
          <p className="text-grey-50 inter-font text-h4 md:text-h4 lg:text-h3">
            Our AI-powered tool helps you study smarter by summarizing content,
            generating audio, and creating practice questions to maximize
            retention and save time.
          </p>
        </div>
      </div>
      {/* Features */}
      <div id="features">
        <div className="mt-20 flex flex-col gap-2 items-center md:flex-row justify-center">
          <FirstCard />
          <SecondCard />
        </div>

        <div className="mt-20 flex flex-col-reverse md:flex-row gap-2 md:gap-20
         items-center max-w-[900px] mx-auto ">
          {/* texts */}
          <div className="md:w-1/2 text-center md:text-left md:pl-10">
            <h3 className="text-primary-100 text-h3 poppins-font">
              Practice Questions
            </h3>
            <p className="text-grey-50 inter-font text-h4 px-5 md:p-0">
              Generate custom practice questions to reinforce key concepts and
              boost retention.
            </p>
          </div>
          <div className="">
            <Image src={questionImg} className="w-[317px] h-[218px]" />
          </div>
        </div>
      </div>
      {/* Last section */}
      <div className="flex flex-col-reverse md:flex-row items-center mt-40 gap-5">
        <div className="md:w-1/2 flex gap-5 flex-col inter-font-bold pl-10">
          <h2 className="hidden md:flex text-h3 text-primary-100 poppins-font">All you ever need in one place</h2>
          <p className="text-h5 text-grey-200 min-w-[302px] max-w-[500px]">
            Our tool condenses complex materials into easy-to-understand
            summaries, helping you grasp key concepts faster,
          </p>
          <p className="text-h5 text-grey-200 min-w-[302px] max-w-[500px]">
            Plus, the audio feature lets you absorb information on the go, and
            making the most of your time.
          </p>
          <p className="text-h5 text-grey-200 min-w-[302px] max-w-[500px]">
            Our practice question feature allows you to test yourself and
            identify areas for improvement,
          </p>
        </div>
        <div className="md:w-1/2 md:flex md:justify-center flex flex-col items-center gap-5">
        <h3 className="md:hidden text-h3 text-primary-50">All you ever need in one place</h3>
          <Image src={allFeatureImage} className="w-[300px] h-[400px] hidden md:flex" />
          <Image src={allFeatureMobileImage} className="w-[400px] h-[300px] flex md:hidden" />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
