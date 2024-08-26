"use client";
import Image from "next/image";
import cancelIcon from "../../../../public/icons/cancel.svg";
import fileImage from "../../../../public/icons/upload-file.svg";
import { toggleUpload } from "@/app/lib/features/dashboard/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";

function Upload() {
  const dispatch = useDispatch();
  const { isUploadOpen } = useSelector((store) => store.dashboard);
  function close() {
    dispatch(toggleUpload());
  }

  return (
    <div
      className={`inter-font text-p-text absolute z-20 top-[6rem] h-[529px] left-0 right-0
    px-2 max-w-[826px] mx-auto transition-all duration-500 ${isUploadOpen ? 'scale-95':'scale-0'}`}
    >
      <div
        className="bg-white border-2 rounded-md relative h-full
      flex flex-col justify-between py-5 px-5 md:px-10 border-p-text"
      >
        {/* title and closeicon */}
        <div className="text-2xl text-primary flex justify-between items-center">
          <p>Upload PDF</p>{" "}
          <div onClick={close} className="cursor-pointer">
            <Image alt="cancel icon" src={cancelIcon} width={40} height={40} />
          </div>
        </div>
        {/* Upload Image and text */}
        <div>
          <div
            className="flex flex-col items-center justify-center gap-3 border-dashed border-2 border-p-text rounded-md px-3
          text-xl text-p-text h-[357px] text-center"
          >
            <Image
              src={fileImage}
              alt="file icon"
              width={115}
              height={115}
              className="mx-auto"
            />
            <p>
              Drag and Drop or{" "}
              <span className="text-primary">Click to Upload</span>
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div>
          <p className="text-xl text-p-text">Uploading...</p>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
