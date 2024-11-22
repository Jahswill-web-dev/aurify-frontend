"use client";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";
import { setPdfName } from "@/app/lib/features/dashboard/dashboardSlice";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "./loading";
import playIcon from "../../../../public/icons/play-icon.svg";
import pauseIcon from "../../../../public/icons/pause-icon.svg";
import Image from "next/image";

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

function Summary({ slug }) {
  const audioRef = useRef(null);

  const [pdf, setPdf] = useState();
  const { data, error, loading } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/audiobook/s/${slug}`
    // `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/audiobooks`
  );
  const dispatch = useDispatch();
  useEffect(() => {
    // console.log("data:", data?.data);
    setPdf(data?.data[0]);
    dispatch(setPdfName(pdf?.title));
  }, [data, error, loading, dispatch, pdf]);

  const handleAudio = () => {
    if(audioRef.current){
      if(audioRef.current.paused){
        audioRef.current.play();
      }else{
        audioRef.current.pause();
      };
    };
  }

  if (error) {
    return (
      <div className="dashboard-main">
        <p className="text-center text-xl">
          There was an error fetching PDFs. Please try again later.
        </p>
        ;
      </div>
    );
  }
  return (
    <div className="dashboard-main">
      <div>
        <div className="flex flex-col gap-2 my-2">
          <h2 className="text-2xl text-primary">Summary</h2>
        </div>
        <div className="my-4">
          <p className="text-lg text-p-text-darker font-semibold">Name</p>
          <div
            className="bg-secondary text-x-head font-semibold border-t-2 border-primary 
        pt-1 pb-4 pl-5 text-primary"
          >
            {!pdf?.title ? "loading..." : truncateText(pdf?.title, 60)}
          </div>
          {/* audio button */}
          <div
          onClick={handleAudio} 
          className="flex mt-5 gap-2 items-center">
            <p className="text-xl">Audio</p>
            <Image alt="play/pause button" src={pauseIcon} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-10 px-2">
        <div className="text-p-text text-lg">
          {pdf?.text ? (
            <p className="leading-relaxed tracking-wide inter-font">
              {pdf?.text}
            </p>
          ) : (
            <div className="relative top-10">
              <Loading />
            </div>
          )}
        </div>
      </div>
      <audio ref={audioRef} src={pdf?.url} />
    </div>
  );
}

export default Summary;
