"use client";
import Image from "next/image";
import cancelIcon from "../../../../public/icons/cancel.svg";
import fileImage from "../../../../public/icons/upload-file.svg";
import {
  toggleUpload,
  toggleUploadSuccess,
} from "@/app/lib/features/dashboard/dashboardSlice";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { usePostWithToken } from "@/app/hooks/useCustomHook";
import axios from "axios";
import { RingSpinner } from "@/components/ui/ui";
import Swal from "sweetalert2";

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

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

function Upload() {
  const dispatch = useDispatch();
  const { isUploadOpen, uploadSuccess } = useSelector(
    (store) => store.dashboard
  );
  const { accessToken } = useSelector((store) => store.auth);
  function close() {
    dispatch(toggleUpload());
  }
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState();
  const [uploading, setUploading] = useState(false);
  // const [uploadSuccess, toggleUploadSuccess] = useState(false);

  // prevents the browser from opening the file in another tab which is the default behaviour
  const handleDragOver = (event) => {
    event.preventDefault();
  };
  // capture the file when dropped in the dropZone Lol
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
    console.log(files);
  };
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };
  // Upload to the server
  const handleUpload = async () => {
    // check files length
    if (files.length === 0) {
      // console.log("No files to upload");
      return;
    }
    setUploading(true);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });
// upload for summarization
    try {
      const token = sessionStorage.getItem("accessToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/pdf2ai`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(toggleUploadSuccess());
      Toast.fire({
        icon: "success",
        title: "Upload Sucessful",
      });
      // console.log("Files uploaded successfully", response.data);
      // Handle success (e.g., show success message, reset state, etc.)
    } catch (error) {
      // console.error("Error uploading files", error)
      if (error.message === "Network Error") {
        Toast.fire({
          icon: "error",
          title: "Check Your Internet",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Failed to Upload",
        });
      }
      // Handle error (e.g., show error message)
    } finally {
      setUploading(false);
      setFiles([]);
      dispatch(toggleUpload());
    }
// upload to generate Practice questions

  };

  return (
    <div
      className={`inter-font text-p-text absolute z-20 top-[6rem] h-[529px] left-0 right-0
    px-2 max-w-[826px] mx-auto transition-all duration-500 ${
      isUploadOpen ? "scale-95" : "scale-0"
    }`}
    >
      <div
        className="bg-white border-2 rounded-md relative h-full
      flex flex-col justify-between py-5 px-5 md:px-10 border-p-text"
      >
        {/* title and closeicon */}
        <div className="text-2xl text-primary flex justify-between items-center">
          <p>Upload File</p>{" "}
          <div onClick={close} className="cursor-pointer">
            <Image alt="cancel icon" src={cancelIcon} width={40} height={40} />
          </div>
        </div>
        {/* Upload Image and text */}
        <div>
          <div
            className="flex flex-col items-center justify-center gap-3 border-dashed border-2 border-p-text rounded-md px-3
          text-xl text-p-text h-[357px] text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Image
              src={fileImage}
              alt="file icon"
              width={80}
              height={80}
              className="mx-auto"
            />
            <p>
              Drag and Drop or{" "}
              <label
                htmlFor="file-upload"
                className="text-primary cursor-pointer"
              >
                Click to Upload
              </label>
            </p>
            <div>
              File:
              {files.map((file, index) => (
                <p key={index}>
                  {index + 1}. {truncateText(file.name, 20)}
                </p>
              ))}
            </div>

            <button
              className="text-white bg-primary inter-font px-4 py-2 rounded active:scale-95"
              onClick={() => handleUpload()}
            >
              Submit
            </button>
            <input
              id="file-upload"
              type="file"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />
          </div>
        </div>
        {/*.......  */}

        {/* Progress bar */}
        {uploading && (
          <div
            className="bg-white opacity-80 top-0 left-0 right-0 bottom-0 absolute 
          flex flex-col gap-2 items-center justify-center"
          >
            <div>
              <RingSpinner />
            </div>
            <p className="text-center text-xl text-p-text-darker font-semibold">
              {"Summarizing PDF's..."}
              <br/>
              {"pls be patient this may take a while..."}
            </p>
          </div>
        )}
        {/* Success Message */}
        {uploadSuccess && (
          <div
            className="bg-white opacity-80 top-0 left-0 right-0 bottom-0 absolute 
          flex flex-col gap-2 items-center justify-center"
          >
            <div>
              <RingSpinner />
            </div>
            <p className="text-xl text-p-text-darker font-semibold">
              {"Summarizing PDF's..."}
              
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
