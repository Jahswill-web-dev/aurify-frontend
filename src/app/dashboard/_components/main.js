import Image from "next/image";
import moreIcon from "../../../../public/icons/more-icon.svg";

function Block({ first, selected }) {
  return (
    <div
      className={`flex justify-between  w-11/12 mx-auto py-2 border-2 border-primary border-x-0 ${
        first ? "border-t-2" : "border-t-0"
      } ${selected ? "bg-secondary" : "bg-white"} text-p-text`}
    >
      <p>Fullstack Web Development</p>
      <div className="hidden md:block">Book mark Icon</div>
      <div className="hidden md:block">audio Icon</div>
      <div className="">
        <Image alt="more details icons" src={moreIcon} width={27} height={27} />
      </div>
    </div>
  );
}

function Details() {
  return (
    <div className="overflow-hidden w-0 lg:w-[30%] bg-green-700">
      <div>Fullstack webdevelopment</div>
    </div>
  );
}

function Main() {
  return (
    <div className="px-4 w-full md:w-[70%] lg:w-[80%] mt-7 md:mt-0">
      <div className="w-full flex h-full">
        {/* Main */}
        <div className="bg-white text-p-text-darker px-3 py-5 rounded-md border-2 border-p-text h-full w-[100%] lg:w-[70%] min-h-[600px]">
          {/* <div className=""> */}
          <p className="text-primary text-x-sub-head pl-4 md:text-l-sub-head mb-4 inter-font">
            Summarized PDF's
          </p>
          <div>
            <div className="text-primary mb-3">
              <p className="pl-4">Name</p>
              <p className="hidden md:block">Bookmark</p>
              <p className="hidden md:block">audio</p>
              <p className="hidden md:block">Details</p>
            </div>
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
