"use client";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";
import { setPdfName } from "@/app/lib/features/dashboard/dashboardSlice";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Loading from "./loading";

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

function Summary({ slug }) {
  // const { pdfId, pdfName } = useSelector((store) => store.dashboard);
  console.log("slug:", slug);
  // console.log("testing....");
  const [pdf, setPdf] = useState();
  const { data, error, loading } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/audiobook/s/${slug}`
    // `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/audiobooks`
  );
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("data:", data?.data);
    setPdf(data?.data[0]);
    dispatch(setPdfName(pdf?.title));
  }, [data, error, loading, dispatch, pdf]);

  console.log("title:", pdf?.title);
  if (error) console.log(error);
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
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-10 px-2">
        <div className="text-p-text text-lg">
          {pdf?.text ? (
            <p className="leading-relaxed tracking-wide inter-font">{pdf?.text}</p>
          ) : (
            <div className="relative top-10">
              <Loading />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Summary;
