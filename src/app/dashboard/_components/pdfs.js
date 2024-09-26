"use client";
import Image from "next/image";
import moreIcon from "../../../../public/icons/more-icon.svg";
import bookmarkIcon from "../../../../public/icons/transparent-bookmark.svg";
import playIcon from "../../../../public/icons/play-icon.svg";
import pauseIcon from "../../../../public/icons/pause-icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  toggleDetails,
  setPdfName,
  setFirstPdfName,
  toggleUpload,
  setFirstPdfSlug,
  setPdfSlug,
  setPdfId,
  setPdfSummary,
  toggleUploadSuccess,
  setFirstPdfId,
  setDeleteState,
} from "@/app/lib/features/dashboard/dashboardSlice";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";
import Loading from "./loading";
function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}
function Block({ first, selected, name, playing, slug, id, onPlayPause, url }) {
  const { pdfName } = useSelector((store) => store.dashboard);
  const dispatch = useDispatch();
  const audioRef = useRef(null);

  // {
  //   pdfName ? pdfName : selected && name;
  // }
  useEffect(() => {
    if (selected) {
      dispatch(setFirstPdfName(name));
      dispatch(setFirstPdfSlug(slug));
      dispatch(setPdfId(id));
      dispatch(setFirstPdfId(id));
    }
    if (first) {
      dispatch(setPdfName(name));
      dispatch(setPdfSlug(slug));
      // dispatch(setPdfId(id));
      dispatch(setFirstPdfId(id));
    }
  }, [selected, name, dispatch, slug, id, first]);

  function detail() {
    if (window.matchMedia("(max-width:1023px)").matches) {
      dispatch(toggleDetails());
    }
    dispatch(setPdfName(name));
    dispatch(setPdfSlug(slug));
    dispatch(setPdfId(id));
  }
  useEffect(() => {
    if (playing) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [playing]);

  useEffect(() => {
    const handleEnded = () => {
      onPlayPause();
    };
    // console.log("Audio url", url)
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("ended", handleEnded);
    }
    return () => {
      if (audioElement) {
        audioElement.removeEventListener("ended", handleEnded);
      }
    };
  }, [onPlayPause]);
  // console.log("pdf idd", id)
  // console.log("first", first);
  return (
    <div onClick={detail}>
      <div
        className={`cursor-pointer flex justify-between w-11/12 mx-auto py-2 px-2 border-2 border-primary border-x-0 ${
          first ? "border-t-2" : "border-t-0"
        } ${selected ? "bg-secondary" : "bg-white"} text-p-text roboto-font`}
      >
        <p className="w-[250px]">{truncateText(name, 30)}</p>
        <div className="hidden md:block">
          <Image
            alt="bookmark icon"
            src={bookmarkIcon}
            height={21}
            width={17}
          />
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onPlayPause();
            // console.log("play button is clicked!!!")
          }}
          className="hidden md:block"
        >
          <Image
            alt="play Icon"
            src={playing ? pauseIcon : playIcon}
            width={20}
            height={20}
          />
        </div>
        <div className="cursor-pointer lg:hidden">
          <Image
            alt="more details icons"
            src={moreIcon}
            width={27}
            height={27}
          />
        </div>
      </div>
      <audio ref={audioRef} src={url} />
    </div>
  );
}

function Pdfs() {
  const [summaries, setSummaries] = useState();
  const { uploadSuccess, isDeleted } = useSelector((store) => store.dashboard);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [selectedPdfId, setSelectedPdfId] = useState();
  const dispatch = useDispatch();
  const { data, error, loading, refetch } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_BASE_URL}/audiobooks`
  );

  useEffect(() => {
    if (data && !error && !loading) {
      // console.log(data.data);
      setSummaries(data.data);
    }
  }, [data, loading, error]);

  useEffect(() => {
    if (uploadSuccess || isDeleted) {
      refetch().then(() => {
        dispatch(toggleUploadSuccess());
        // console.log("holaa")
        dispatch(setDeleteState(false))
      });
    }
  }, [uploadSuccess, refetch, dispatch, isDeleted]);

  const handlePlayPause = (id) => {
    if (playingAudioId === id) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(id);
    }
  };
  // ...........................
  if (error) {
    console.log("could not fetch pdf");
    return (
      <div className="dashboard-main">
        <p>There was an error fetching PDFs. Please refresh the page.</p>;
      </div>
    );
  }

  return data?.data?.length === 0 ? (
    <div className="dashboard-main flex items-center justify-center">
      <div
        className="text-white bg-primary rounded py-2 px-4 inter-font cursor-pointer active:scale-95"
        onClick={() => dispatch(toggleUpload())}
      >
        Upload a file
      </div>
    </div>
  ) : (
    <div className="dashboard-main">
      <p className="text-primary text-x-sub-head pl-4 md:text-l-sub-head mb-4 inter-font">
        {`Summarized PDF's`}
      </p>
      <div>
        {/* Blocks container */}
        <div className="flex flex-col gap-2">
          {/* Single Blocks */}
          {summaries?.map((summary, index) => (
            <Block
              first={index + 1 === 1}
              key={summary.id}
              name={summary.title}
              slug={summary.slug}
              id={summary.id}
              url={summary.url}
              playing={playingAudioId === summary.id}
              onPlayPause={() => handlePlayPause(summary.id)}
            />
          ))}
          {/* <Block
            first={true}
            name="Web-development"
            playing={true}
          />
          <Block name="Math-Notes" playing={false} />
          <Block name="Biology-Notes" playing={false} />
          <Block name="English-Essay" playing={false} />
          <Block name="English-Essays" playing={false} /> */}
        </div>
      </div>
    </div>
  );
}

export default Pdfs;
