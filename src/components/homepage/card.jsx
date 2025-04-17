import Image from "next/image";
import audioImg from "../../../public/images/pexels-cottonbro-6686306.jpg";
import summarizeImg from "../../../public/images/summarizeimg.jpg";

function FirstCard() {
  return (
    <div className="w-[365px] h-[485px] relative">
      {/* <div className="w-[494px] h-[657px] relative"> */}
      <Image
        src={summarizeImg}
        className="w-full h-full"
        alt="someone summarizing some notes"
      />
      <div
        className="h-1/4 w-full 
      text-off-white-50"
      >
        <div className="absolute top-0 z-10 pt-5 px-2">
          <h3 className="text-h2 poppins-font-italics mb-2">Summarization</h3>
          <p className="text-h4 poppins-font-bold">
            Quickly condense complex PDFs into easy-to-understand summaries for
            faster study.
          </p>
        </div>
        <div className="bg-black h-[35%] w-full absolute top-0 opacity-[25%]"></div>
      </div>
      {/* </div> */}
    </div>
  );
}
function SecondCard() {
  return (
    <div className=" w-[365px] h-[485px] relative">
      {/* <div className="w-[494px] h-[657px] relative"> */}
      <Image
        src={audioImg}
        className="w-full h-full"
        alt="someone summarizing some notes"
      />
      <div
        className="h-1/4 w-full 
          text-off-white-50"
      >
        <div className="absolute bottom-0 z-10 pb-5 px-2">
          <h3 className="text-h2 poppins-font-italics mb-2">Audio Generation</h3>
          <p className="text-h4 poppins-font-bold">
          Turn your study materials into audio for hands-free learning on the go.
          </p>
        </div>
        <div className="bg-black h-[35%] w-full absolute bottom-0 opacity-[25%]"></div>
      </div>
      {/* </div> */}
    </div>
  );
}
export { FirstCard, SecondCard };
