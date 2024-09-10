"use client";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";
import { setPdfName } from "@/app/lib/features/dashboard/dashboardSlice";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

function Summary({ name }) {
  console.log("name", name);
  console.log("testing....");
  const [pdf, setPdf] = useState();
  const { data, error, loading } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_BASE_URL}/audiobook/${name}`
    // `${process.env.NEXT_PUBLIC_BASE_URL}/audiobooks`
  );
  // console.log("data:", data);
  // console.log("error:", error);
  // console.log("loading:", loading);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("data:", data?.data);
    setPdf(data?.data)
    dispatch(setPdfName(data?.data?.title))
  }, [data, error, loading]);

  if (error) console.log(error);
  if (error) {
    return (
      <div className="dashboard-main">
        <p className="text-center text-xl">There was an error fetching PDFs. Please try again later.</p>;
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
            {truncateText(setPdfName, 60)}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-10 px-2">
        <h2 className="text-2xl font-semibold text-p-text-darker">
          First Heading
        </h2>
        <p className="text-p-text text-lg">{pdf?.text}</p>
      </div>
    </div>
  );
}

export default Summary;
