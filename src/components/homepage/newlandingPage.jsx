import Image from "next/image";
import webImg from "../../../public/images/desktopimg.png";
import mobImg from "../../../public/images/mobilepageimg.png";
import Link from "next/link";
function NewLandingPage() {
  return (
    <>
      <section>
        <div className="flex flex-col items-center md:w-1/2">
          <div className="text-center mb-10 flex flex-col items-center gap-2">
            <h1>Master Your Studies with Smart Tools</h1>
            <p className="text-lg text-grey-100">
              Simplify your learning journey with PDF summaries, audio notes,
              and instant practice questions.
            </p>
          </div>
          <div>
            <Link
              href="/signup"
              className="px-5 py-2 rounded-[50px] bg-primary-25 text-off-white-50"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <Image className="hidden max-[610px]:flex" src={mobImg} alt="" />
          <Image className="max-[610px]:hidden" src={webImg} alt="" />
        </div>
      </section>
    </>
  );
}

export default NewLandingPage;
