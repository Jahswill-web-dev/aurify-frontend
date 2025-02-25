"use client";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
import moreIcon from "../../../../../public/icons/more-icon.svg";
import deleteIcon from "../../../../../public/icons/delete.svg";
import playIcon from "../../../../../public/icons/play-bold.svg";
import pauseIcon from "../../../../../public/icons/pause-rounded.svg";
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
  setAudioId,
  setAudioSrc,
  setPlaying,
} from "@/app/lib/features/dashboard/dashboardSlice";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";
// import Loading from "./../loading";
import ReactHowler from "react-howler";
import Cookies from "js-cookie";
import Link from "next/link";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});
function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}
function Block({
  first,
  selected,
  name,
  playing,
  slug,
  id,
  onPlayPause,
  url,
}) {
  const { pdfName, pdfId, audioSrc, } = useSelector(
    (store) => store.dashboard
  );
  const dispatch = useDispatch();

  useEffect(() => {
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
  
  const handleDeletePdf = () => {
    const token = Cookies.get("accessToken");
    axios
      .delete(`${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/audiobook/${pdfId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        dispatch(setDeleteState(true));
        Toast.fire({
          icon: "success",
          title: "File Deleted Sucessful",
        });
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: "Failed to Delete",
        });
      });
    // };
  };

 

  useEffect(() => {
    // console.log("audio url: ", url);
    dispatch(setAudioSrc(url));
  }, [url]);

  return (
    <div onClick={detail} className="hover:bg-grey-25 rounded transition-all">
      <div
        className={`flex justify-between w-11/12 mx-auto py-2 px-2 
        roboto-font text-grey-200 items-center`}
      >
        <div className="flex gap-2 items-center">
          <Image
            src={playing ? pauseIcon : playIcon}
            alt=""
            width={30}
            height={30}
            onClick={onPlayPause}
            className="cursor-pointer"
          />
          <p className="w-[400px] poppins-font text-h4">
            {truncateText(name, 30)}
          </p>
        </div>
        <p className="text-h4 hidden lg:block">1:45</p>
        <div
          className="hidden lg:block active:scale-90"
          onClick={handleDeletePdf}
        >
          <Image alt="Delete icon" src={deleteIcon} height={35} width={35} />
        </div>
        {/* More Icon */}
        <div className="cursor-pointer lg:hidden">
          <Image
            alt="more details icons"
            src={moreIcon}
            width={27}
            height={27}
          />
        </div>
      </div>

      {/* <ReactHowler src={audioSrc} playing={false} volume={1} ref={audioRef} /> */}
    </div>
  );
}

function Audios() {
  const [summaries, setSummaries] = useState();
  const { uploadSuccess, isDeleted, audioId, audioSrc, playing } = useSelector(
    (store) => store.dashboard
  );
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [currentAudioId, setCurrentAudioId] = useState(null);
  const dispatch = useDispatch();
  const { data, error, loading, refetch } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/audiobooks`
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
        // console.log("hola!!!");
        dispatch(setDeleteState(false));
      });
    }
  }, [uploadSuccess, refetch, dispatch, isDeleted]);

  
  const handlePlayPause = (id, url) => {
    // If the selected audio is already playing, stop it
    if (currentAudioId === id) {
      setCurrentAudioId(null);
      dispatch(setAudioSrc(""));
      dispatch(setPlaying(playing));
    } else {
      // Otherwise, play the selected audio
      setCurrentAudioId(id);
      dispatch(setAudioSrc(url));
      dispatch(setPlaying(false));
    }
  };
  // ...........................
  if (error) {
    // console.log("could not fetch pdf");
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
        Audios
      </p>
      <div>
        {/* Blocks container */}
        <div className="flex flex-col gap-5">
          {/* Single Blocks */}
          {summaries?.map((summary, index) => (
            <Block
              first={index + 1 === 1}
              key={summary.id}
              name={summary.title}
              slug={summary.slug}
              id={summary.id}
              url={summary.url}
              playing={currentAudioId === summary.id}
              onPlayPause={() => handlePlayPause(summary.id, summary.url)}
              audioId={audioId}
            />
          ))}
        </div>
        {audioSrc && (
          <ReactHowler src={audioSrc} playing={playing} volume={1} />
        )}
      </div>
    </div>
  );
}

export default Audios;
