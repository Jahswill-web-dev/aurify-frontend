import Image from "next/image";
import hero from "../../../public/images/hero-img.png";
import hero2 from "../../../public/images/hero-2.png";
import { InterLoader, RobotoLoader } from "../fonts/fontloader";
import Form from "../form/form";
function WaitList() {
  return (
    <>
      <div className="py-3">
        <div className="flex flex-col sm:flex-row-reverse sm:items-center px-4">
          {/* hero-Image */}
          <Image
            src={hero2}
            alt="hero Image"
            width={800}
            height={800}
            className="mx-auto mt-5 w-[272px] sm:w-5/12"
          />
          {/* hero-texts */}
          <div className="sm:w-1/2">
            <RobotoLoader>
              <h1 className="text-x-head lg:text-l-head text-primary text-center sm:text-left font-semibold">
                Convert your PDFs into concise audio summaries that highlight
                the main points.
              </h1>
            </RobotoLoader>
            <InterLoader>
              <p className="text-x-description lg:text-l-description text-p-text text-center sm:text-left font-normal">
                Effortlessly absorb information with our AI summarized Free
                audiobooks.
              </p>
            </InterLoader>
          </div>
        </div>

        {/* Form */}
        <Form />
      </div>
    </>
  );
}

export default WaitList;
