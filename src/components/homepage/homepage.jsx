import Image from "next/image";
import Link from "next/link";
import hero2 from "../../../public/images/hero-2.png";
import questionImage from "../../../public/images/question.png";
import proffesionals from "../../../public/images/professional.png";
import students from "../../../public/images/student.png";
import arrowDown from "../../../public/icons/arrow-down.svg";
import productivityImage from "../../../public/images/productivity-image.svg";
import clock from "../../../public/icons/clock.svg";
import bolt from "../../../public/icons/bolt.svg";
import report from "../../../public/icons/report.svg";
import lock from "../../../public/icons/lock.svg";
import audioBook from "../../../public/icons/audio-book.svg";
import statsImage from "../../../public/icons/stats.svg";
import brain from "../../../public/icons/brain-book.svg";
function HomePage() {
  return (
    <div>
      {/* hero Section */}
      <div>
        <div className="flex flex-col sm:flex-row-reverse sm:items-center px-2 sm:px-4">
          {/* hero-Image */}
          <Image
            src={hero2}
            alt="hero Image"
            width={800}
            height={800}
            className="mx-auto mt-5 w-[272px] sm:w-5/12"
          />
          {/* hero-texts */}
          <div className="sm:w-1/2 flex flex-col gap-2 items-center sm:items-start ">
            <h1 className="roboto-font text-x-head lg:text-l-head text-primary text-center sm:text-left font-semibold">
              Convert your PDFs into concise audio summaries that highlight the
              main points.
            </h1>
            <p className="inter-font text-lg lg:text-l-description text-p-text text-center sm:text-left font-normal">
              Effortlessly absorb information with our AI summarized Free
              audiobooks.
            </p>
            <Link
              href="/signup"
              className="text-secondary py-2 px-6 bg-primary rounded-lg font-semibold"
            >
              Summarize Your PDFs Now!!
            </Link>
          </div>
        </div>
      </div>
      {/* Second Section */}
      <div className="flex flex-col gap-2 my-10 md:flex-row md:items-center">
        <div className="md:w-1/2">
          <Image
            src={questionImage}
            alt="question image"
            className="w-[772] h-[772] hidden md:block"
            width={700}
            height={700}
          />
        </div>
        <div className="roboto-font md:w-1/2">
          <h2 className="text-primary font-semibold text-2xl text-center m-5">
            Who can use Aurify AI?
          </h2>
          <div className="flex w-full justify-center items-center p-5">
            <Image src={arrowDown} width={30} height={30} className="" alt=""/>
          </div>
          <div className="flex flex-col gap-10">
            {/*  */}
            <div className="flex items-center">
              <Image
                src={proffesionals}
                width={200}
                height={200}
                alt=""
                className=""
              />
              <div className="text-left">
                <h3 className="text-2xl text-primary font-semibold inter-font">
                  Professionals
                </h3>
                <p className="text-p-text text-base md:text-l-description">
                  Say goodbye to endless hours of reading. Read more quickly and
                  have the important notes read to you.
                </p>
              </div>
            </div>
            {/*  */}
            <div className="flex items-center">
              <Image
                src={students}
                width={200}
                height={200}
                alt=""
                className=""
              />
              <div className="text-left">
                <h3 className="text-2xl text-primary font-semibold inter-font">
                  Students
                </h3>
                <p className="text-p-text text-base md:text-l-description">
                  Prepare for exams faster and recollect information quickly by
                  getting the main points read to you
                </p>
              </div>
            </div>
            {/*  */}
          </div>
        </div>
      </div>

      {/* third section */}
      <div className="flex flex-col sm:flex-row gap-2 items-center mt-20">
        {/* Image */}
        <div className="sm:w-1/2">
          <Image
            src={productivityImage}
            alt=""
            width={537}
            height={358}
            className="min-w-[354px] min-h-[236px]"
          />
        </div>
        {/* text */}
        <div className="sm:w-1/2 flex flex-col relative">
          <div className="mb-5">
            <Image src={clock} alt="" width={40} height={40} />
          </div>
          <p className="inter-font text-primary text-xl font-bold inter-font md:text-2xl lg:text-3xl">
            enhance your productivity and stay ahead in your busy schedule.
          </p>
          <div>
            <Image
              src={bolt}
              alt=""
              width={70}
              height={70}
              className="absolute right-0"
            />
          </div>
        </div>
      </div>
      {/* fourth Section */}
      <div className="mt-20">
        <h2 className="text-primary text-2xl md:text-3xl font-bold text-center inter-font mb-10">
          Why Aurify?
        </h2>
        {/* Cards container */}
        <div
          className="grid-rows-1 grid-cols-1
        grid lg:grid-rows-2 lg:grid-cols-2 gap-2 gap-y-10 place-items-center"
        >
          <Card
            title="Summarization Excellence"
            image={report}
            text="Our AI-powered summarization algorithms distill the essence of lengthy documents, delivering concise and relevant content."
          />
          <Card
            title="Effortless Accessibility"
            image={lock}
            text="Say goodbye to the constraints of traditional reading. Aurify AI allows you to absorb information audibly, freeing you to multitask and learn on your terms."
          />
          <Card
            title="Audiobooks"
            image={audioBook}
            text="Aurify AI creates audiobooks tailored to your preferences, ensuring an immersive and enjoyable learning journey"
          />
          <Card
            title="Maximized Productivity"
            image={statsImage}
            text="Make the most of every moment. Whether you're commuting, exercising, or working on other projects, our platform empowers you to absorb information effortlessly."
          />
        </div>
      </div>

      {/* Fifth Section */}
      <div className="mt-20">
        {/* border Container */}
        <div className="border-2 border-p-text flex flex-col items-center p-4 gap-4 max-w-[1196px] mx-auto">
          <div>
            <Image src={brain} alt="" width={150} height={150} />
          </div>
          <h3 className="text-xl text-primary font-semibold roboto-font">
            Listen, Learn, Elevate, Aurify
          </h3>
          <p className="text-center text-p-text font-medium inter-font text-lg">
            Join us on this journey as we reshape how you interact with
            knowledge.Discover the joy of Aurify AI where every document becomes
            an enriching audiobook. Start your personalized learning experience
            today!
          </p>
          <Link
            href="/signup"
            className="text-secondary font-medium text-xl bg-primary rounded-md
            px-8 py-4"
          >
            Learn smarter
          </Link>
        </div>
      </div>
    </div>
  );
}
function Card({ title, image, text }) {
  return (
    <div
      className="shadow-2xl bg-white flex flex-col max-w-[404px] max-h-[313px]
      justify-evenly p-5"
    >
      <div>
        <Image src={image} alt="" width={60} height={60} />
      </div>
      <h4 className="text-primary font-semibold text-xl inter-font">{title}</h4>
      <p className="text-p-text text-lg">{text}</p>
    </div>
  );
}
export default HomePage;
