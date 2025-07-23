"use client";
import Questions from "../_components/questions";
import back from "../../../../../public/icons/darkback.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { QuizInterface } from "../_components/quizInterface";
function Page({ params }) {
  const { slug } = params;
  const router = useRouter();

  return (
    // <div className="">
      <QuizInterface slug={slug} />
    // </div>
  );
}

export default Page;
