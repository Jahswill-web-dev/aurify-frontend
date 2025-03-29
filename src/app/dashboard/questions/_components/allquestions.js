"use client";
import Image from "next/image";
import axios from "axios";
import Swal from "sweetalert2";
import moreIcon from "../../../../../public/icons/more-icon.svg";
import deleteIcon from "../../../../../public/icons/delete.svg";
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
} from "@/app/lib/features/dashboard/dashboardSlice";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";
// import Loading from "./../loading";
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
function Block({ first, selected, name, playing, slug, id, onPlayPause, url }) {
  const { pdfNam0e, pdfId } = useSelector((store) => store.dashboard);
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  // {
  //   pdfName ? pdfName : selected && name;
  // }

  useEffect(() => {
    // if (selected) {
    //   dispatch(setFirstPdfName(name));
    //   dispatch(setFirstPdfSlug(slug));
    //   dispatch(setPdfId(id));
    //   dispatch(setFirstPdfId(id));
    // }
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
    // Pause or end audio at the end of the audio
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
  return (
    <div onClick={detail}>
      <div
        className={`cursor-pointer flex justify-between w-11/12 mx-auto py-2 px-2 
           ${selected ? "bg-secondary" : ""} text-grey-50 roboto-font`}
      >
        <p className="w-[400px] poppins-font text-h4">
          {truncateText(name, 30)}
        </p>
        <div className="hidden md:block active:scale-90" onClick={handleDeletePdf}>
          <Image alt="Delete icon" src={deleteIcon} height={35} width={35} />
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

function AllQuestsions() {
  const [summaries, setSummaries] = useState();
  const { uploadSuccess, isDeleted, audioId } = useSelector(
    (store) => store.dashboard
  );
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [selectedPdfId, setSelectedPdfId] = useState();
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
        console.log("hola!!!");
        dispatch(setDeleteState(false));
      });
    }
  }, [uploadSuccess, refetch, dispatch, isDeleted]);

  const handlePlayPause = (id) => {
    //check is if audio is already playing
    if (audioId === id) {
      // setPlayingAudioId(null);
      dispatch(setAudioId(null));
      //plays audio
    } else {
      // setPlayingAudioId(id);
      dispatch(setAudioId(id));
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
        Practice questions
      </p>
      <div>
        {/* Blocks container */}
        <div className="flex flex-col gap-5">
          {/* Single Blocks */}
          {summaries?.map((summary, index) => (
            <Link  key={summary.id} href={`/dashboard/questions/${summary.slug}`}>
            <Block
              first={index + 1 === 1}
              key={summary.id}
              name={summary.title}
              slug={summary.slug}
              id={summary.id}
              url={summary.url}
              playing={audioId === summary.id}
              onPlayPause={() => handlePlayPause(summary.id)}
              />
              </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllQuestsions;
