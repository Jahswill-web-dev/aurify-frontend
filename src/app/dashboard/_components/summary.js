"use client";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

function Summary({ name }) {
  const { pdfName } = useSelector((store) => store.dashboard);
  const [pdfSummary, setPdfSummary] = useState();
  // fetch the data from the backend
  const { data, error, loading } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_BASE_URL}/audiobooks`
  );
  // use url slug to find the the data
  const dataArray = data?.data;
  const matchedItem = data?.data?.find((data) => data.slug === name);
  if (matchedItem) {
    console.log(matchedItem);
  }
  useEffect(() => {
    // console.log(data?.data);
    setPdfSummary(matchedItem)
  }, []);

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
            {truncateText(pdfName, 60)}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-10 px-2">
        <h2 className="text-2xl font-semibold text-p-text-darker">
          First Heading
        </h2>
        <p className="text-p-text text-lg">{pdfSummary?.text}</p>
      </div>
    </div>
  );
}

export default Summary;
