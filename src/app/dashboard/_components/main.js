"use client";
import { Details } from "./details";
import back from "../../../../public/icons/darkback.svg";
import { useRouter } from "next/navigation";
import Image from "next/image";

function Main({ comp, name }) {
  // const pathname = usePathname();-
  // console.log(pathname);
  // let componentToRender;
  // switch (pathname) {
  //   case "#questions":
  //     componentToRender = <Questions />;
  //     break;
  //   case "#summary":
  //     componentToRender = <Summary />;
  //     break;
  //   default:
  //     componentToRender = <Pdfs />;
  // }
  const router = useRouter();

  return (
    // Change View based on url in the browser
    <div className="px-4 w-full md:w-[70%] lg:w-[80%] mt-7 md:mt-0">
      {name !== "pdf" && (
        <button
          onClick={() => router.back()}
          className="border-primary border-2 px-2 py-1 bg-white 
      text-p-text text-base font-medium roboto-font flex items-center gap-2 w-24 my-2 rounded-md"
        >
          <Image src={back} width={25} height={25} alt="back button" />
          <p>Back</p>
        </button>
      )}
      <div className="w-full flex h-full gap-2">
        {comp}
        <Details />
      </div>
    </div>
  );
}

export default Main;
