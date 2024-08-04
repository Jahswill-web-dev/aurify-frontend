import Image from "next/image";
import moreIcon from "../../../../public/icons/more-icon.svg";
import bookmarkIcon from "../../../../public/icons/transparent-bookmark.svg";
import coloredBookMarkIcon from "../../../../public/icons/colored-bookmark.svg";
import playIcon from "../../../../public/icons/play-icon.svg";
import pauseIcon from "../../../../public/icons/pause-icon.svg";
import questionIcon from "../../../../public/icons/questiion-icon.svg";
import headphoneIcon from "../../../../public/icons/headphone.svg";
import summaryIcon from "../../../../public/icons/summary.svg";
import shareIcon from "../../../../public/icons/share.svg";
import deleteIcon from "../../../../public/icons/delete.svg";

function Block({ first, selected }) {
  return (
    <div>
      <div
        className={`flex justify-between w-11/12 mx-auto py-2 border-2 border-primary border-x-0 ${
          first ? "border-t-2" : "border-t-0"
        } ${selected ? "bg-secondary" : "bg-white"} text-p-text`}
      >
        <p>Fullstack Web Development</p>
        <div className="hidden md:block">
          <Image
            alt="bookmark icon"
            src={bookmarkIcon}
            height={21}
            width={17}
          />
        </div>
        <div className="hidden md:block">
          <Image alt="play Icon" src={playIcon} width={20} height={20} />
        </div>
        <div className="">
          <Image
            alt="more details icons"
            src={moreIcon}
            width={27}
            height={27}
          />
        </div>
      </div>
    </div>
  );
}

function Details() {
  return (
    <div className="inter-font overflow-hidden hidden w-0 lg:block lg:w-[30%] bg-white rounded-md border-2 border-p-text px-2 py-3">
      <div className="flex flex-col gap-2">
        <h1 className="text-primary font-semibold text-xl">
          Fullstack webdevelopment
        </h1>
        {/* options */}
        <div className="flex flex-col gap-5 items-start mt-3">
          <div className="flex  gap-3 items-center hover:text-primary">
            <Image
              src={questionIcon}
              alt="question icon"
              width={30}
              height={30}
            />
            <p>Take Test questions</p>
          </div>
          <div className="flex  gap-3 items-center hover:text-primary">
            <Image
              src={headphoneIcon}
              alt="audio icon"
              width={30}
              height={30}
            />
            <p>listen to audio</p>
          </div>
          <div className="flex  gap-3 items-center hover:text-primary">
            <Image
              src={summaryIcon}
              alt="summary icon"
              width={30}
              height={30}
            />
            <p>Read summary</p>
          </div>
          <div className="flex  gap-3 items-center hover:text-primary">
            <Image src={shareIcon} alt="share icon" width={30} height={30} />
            <p>listen to audio</p>
          </div>
          <div className="flex  gap-3 items-center hover:text-primary">
            <Image src={deleteIcon} alt="delete icon" width={30} height={30} />
            <p>listen to audio</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Main() {
  return (
    <div className="px-4 w-full md:w-[70%] lg:w-[80%] mt-7 md:mt-0">
      <div className="w-full flex h-full gap-2">
        {/* Main */}
        <div className="bg-white text-p-text-darker px-3 py-5 rounded-md border-2 border-p-text h-full w-[100%] lg:w-[70%] min-h-[600px]">
          {/* <div className=""> */}
          <p className="text-primary text-x-sub-head pl-4 md:text-l-sub-head mb-4 inter-font">
            Summarized PDF's
          </p>
          <div>
            {/* <div className="text-primary mb-3 md:flex items-center  md:w-11/12 md:mx-auto
            ">
              <p className="pl-4 w-[50%]">Name</p>
              <p className="hidden md:block w-[20%]">Bookmark</p>
              <p className="hidden md:block w-[30%]">audio</p>
              <p className="hidden md:block w-[20%]">Details</p>
            </div> */}
            {/* Blocks container */}
            <div className="flex flex-col gap-2">
              {/* Single Blocks */}
              <Block first={true} selected={true} />
              <Block />
              <Block />
              <Block />
            </div>
          </div>
          {/* </div> */}
        </div>
        {/* Details */}
        <Details />
      </div>
    </div>
  );
}

export default Main;
