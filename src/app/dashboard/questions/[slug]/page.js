"use client";
import Questions from "../_components/questions";
import back from "../../../../../public/icons/darkback.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
function Page({ params }) {
  const { slug } = params;
  const router = useRouter();

  return (
    // <div className="">
      <Questions slug={slug} />
    // </div>
  );
}

export default Page;
