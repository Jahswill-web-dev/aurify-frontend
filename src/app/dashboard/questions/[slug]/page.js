"use client";
import Main from "../../_components/main";
import Questions from "../_components/questions";
import back from "../../../../../public/icons/darkback.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
function Page({ params }) {
  const { slug } = params;
  const router = useRouter();

  return (
      <Questions slug={slug} />
  );
}

export default Page;
