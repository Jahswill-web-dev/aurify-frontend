"use client";
import Image from "next/image";
import moreIcon from "../../../../public/icons/more-icon.svg";
import bookmarkIcon from "../../../../public/icons/transparent-bookmark.svg";
import playIcon from "../../../../public/icons/play-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleDetails,
  setPdfName,
} from "@/app/lib/features/dashboard/dashboardSlice";

function Block({ first, selected, name }) {
  const dispatch = useDispatch();
  function detail() {
    dispatch(setPdfName(name));
    dispatch(toggleDetails());
  }

  return (
    <div>
      <div
        className={`flex justify-between w-11/12 mx-auto py-2 border-2 border-primary border-x-0 ${
          first ? "border-t-2" : "border-t-0"
        } ${selected ? "bg-secondary" : "bg-white"} text-p-text roboto-font`}
      >
        <p className="w-[130px]">{name}</p>
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
        <div onClick={detail} className="cursor-pointer">
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

function Pdfs() {
  return (
    <div className="dashboard-main">
      <p className="text-primary text-x-sub-head pl-4 md:text-l-sub-head mb-4 inter-font">
        {`Summarized PDF's`}
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
          <Block first={true} selected={true} name="Web development" />
          <Block name="Math Notes" />
          <Block name="Biology Notes" />
          <Block name="English Essay" />
          <Block name="English Essays" />
        </div>
      </div>
    </div>
  );
}

export default Pdfs;
