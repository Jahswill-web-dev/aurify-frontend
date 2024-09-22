"use client";
import Image from "next/image";
import bookmarkIcon from "../../../../public/icons/transparent-bookmark.svg";
import coloredBookMarkIcon from "../../../../public/icons/colored-bookmark.svg";
import playIcon from "../../../../public/icons/play-icon.svg";
import pauseIcon from "../../../../public/icons/pause-icon.svg";
import questionIcon from "../../../../public/icons/questiion-icon.svg";
import headphoneIcon from "../../../../public/icons/headphone.svg";
import summaryIcon from "../../../../public/icons/summary.svg";
import shareIcon from "../../../../public/icons/share.svg";
import deleteIcon from "../../../../public/icons/delete.svg";
import cheveronDown from "../../../../public/icons/chevron-down.svg";
import { useSelector, useDispatch } from "react-redux";
import {
  closeDetails,
  setDeleteState,
} from "@/app/lib/features/dashboard/dashboardSlice";
import Link from "next/link";
import axios from "axios";
import { useDeleteWithToken } from "@/app/hooks/useCustomHook";

function Details() {
  const dispatch = useDispatch();
  const { pdfName, firstPdfName, pdfSlug, firstPdfSlug, firstPdfId, pdfId } =
    useSelector((store) => store.dashboard);
    const deletePdf = () => {
    useDeleteWithToken(pdfId);
    dispatch(setDeleteState(true));
  };
  return (
    <div className="hidden inter-font overflow-hidden w-0 lg:block lg:w-[30%] bg-white rounded-md border-2 border-p-text px-2 py-3">
      <div className="flex flex-col gap-2">
        <h1 className="text-primary font-semibold text-xl">
          {pdfName === "" ? firstPdfName : pdfName}
        </h1>
        {/* options */}
        <div className="flex flex-col gap-5 items-start mt-3">
          <Link href="/dashboard/questions">
            <div className="flex  gap-3 items-center hover:text-primary">
              <Image
                src={questionIcon}
                alt="question icon"
                width={30}
                height={30}
              />
              <p>Take Test questions</p>
            </div>
          </Link>
          <div className="flex cursor-pointer gap-3 items-center hover:text-primary">
            <Image
              src={headphoneIcon}
              alt="audio icon"
              width={30}
              height={30}
            />
            <p>listen to audio</p>
          </div>
          <Link href={`/dashboard/summary/${pdfSlug}`}>
            <div className="flex  gap-3 items-center hover:text-primary">
              <Image
                src={summaryIcon}
                alt="summary icon"
                width={30}
                height={30}
              />
              <p>Read summary</p>
            </div>
          </Link>

          <div className="flex  gap-3 items-center hover:text-primary">
            <Image src={shareIcon} alt="share icon" width={30} height={30} />
            <p>share</p>
          </div>
          <div
            onClick={deletePdf}
            className="flex  gap-3 items-center hover:text-primary cursor-pointer"
          >
            <Image src={deleteIcon} alt="delete icon" width={30} height={30} />
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileDetails() {
  const dispatch = useDispatch();
  const { isdetailsOpen, pdfName, firstPdfName, pdfId, pdfSlug } = useSelector(
    (store) => store.dashboard
  );

  const close = () => {
    dispatch(closeDetails());
  };
  const deletePdf = () => {
    useDeleteWithToken(pdfId);
    dispatch(setDeleteState(true));
  };

  return (
    <div className="lg:hidden">
      <div
        className={`transition-all duration-500 inter-font mb-1 fixed ${
          isdetailsOpen ? "top-[140px]" : "top-full"
        } bottom-0 right-[1px] z-20
      w-[99%] bg-white rounded-xl border-4 border-p-text py-4 px-4 overflow-scroll`}
      >
        <div
          onClick={close}
          className="flex w-full items-center mb-4 justify-center  cursor-pointer
          mt-5"
        >
          <Image
            src={cheveronDown}
            alt="icon"
            width={40}
            height={40}
            className=""
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-primary font-medium text-xl roboto-font">
            {pdfName}
          </h1>
          {/* options */}
          <div className="flex flex-col gap-5 items-start mt-3 text-p-text inter-font">
            <Link href="/dashboard/questions" onClick={close}>
              <div className="flex  gap-4 items-center hover:text-primary">
                <Image
                  src={questionIcon}
                  alt="question icon"
                  width={30}
                  height={30}
                />
                <p>Take Test questions</p>
              </div>
            </Link>
            <div className="flex cursor-pointer gap-4 items-center hover:text-primary">
              <Image
                src={headphoneIcon}
                alt="audio icon"
                width={30}
                height={30}
              />
              <p>Listen to audio</p>
            </div>
            <Link href={`/dashboard/summary/${pdfSlug}`} onClick={close}>
              <div className="flex  gap-4 items-center hover:text-primary">
                <Image
                  src={summaryIcon}
                  alt="summary icon"
                  width={30}
                  height={30}
                />
                <p>Read summary</p>
              </div>
            </Link>

            <div className="flex  gap-4 items-center hover:text-primary">
              <Image
                src={bookmarkIcon}
                alt="delete icon"
                width={25}
                height={25}
              />
              <p>Bookmark</p>
            </div>
            <div className="flex  gap-4 items-center hover:text-primary">
              <Image src={shareIcon} alt="share icon" width={30} height={30} />
              <p>Share</p>
            </div>
            <div
              onClick={deletePdf}
              className="flex  gap-4 items-center hover:text-primary"
            >
              <Image
                src={deleteIcon}
                alt="delete icon"
                width={30}
                height={30}
              />
              <p>Delete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Details, MobileDetails };
