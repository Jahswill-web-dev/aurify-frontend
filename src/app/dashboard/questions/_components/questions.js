"use client";
import Image from "next/image";
import ellipse from "../../../../../public/icons/ellipse.svg";
import nextIcon from "../../../../../public/icons/next.svg";
import backIcon from "../../../../../public/icons/back.svg";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";
import { useSelector } from "react-redux";
import { useState } from "react";

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

function Option({ value }) {
  const [selectedOption, setSelectedOption] = useState("");
  
  const handleChange = (event) =>{
    setSelectedOption(event.target.value)
  }

  // console.log(value)
  return (
    <div className=" hover:bg-secondary text-xl border-2 border-p-text rounded-md p-1 flex gap-2 max-w-[300px]">
      <label className="pl-10 w-full cursor-pointer relative">
        {value}
        <input
          className="w-4 h-4 cursor-pointer peer absolute top-1 left-0 opacity-0"
          type="radio"
          name="radio"
          value={value}
          onChange={handleChange}
        />
        <span className="p-1 border-p-text border-2 w-6 h-6 absolute top-0 left-0 rounded-[50%] peer-checked:bg-primary"></span>
      </label>
      <br />
    </div>
  );
}

// Intro questions
function IntroQuestions() {
  return (
    <div className="flex flex-col gap-5 max-h-[700px] overflow-scroll min-h-[600px]">
      <p className="text-primary text-base sm:text-xl">
        How many practice questions would you like?
      </p>
      <div className="flex flex-col gap-5">
        <Option value={10} />
        <Option value={15} />
        <Option value={20} />
        <Option value="Type your desired amount" />
      </div>
    </div>
  );
}
// multiple-choice questions
function MultipleChoiceQuestions() {

  return (
    <div className="flex flex-col gap-5 min-h-[600px] max-h-[700px] overflow-auto">
      <p className="text-primary text-base sm:text-xl">What is Javascript? </p>
      <div className="flex flex-col gap-5">
        <Option value="Programming Language" />
        <Option value="Scripting language" />
        <Option value="Markup Language" />
        <Option value="None of the above" />
      </div>
      <div className="flex justify-between items-center max-w-[300px]">
        {/* previous button */}
        <div
          className="flex gap-1 items-center bg-primary text-white w-24 justify-center
        rounded-lg py-1 border-2 border-p-text"
        >
          <Image src={backIcon} alt="icon" width={16} height={16} />
          <p>Back</p>
        </div>
        {/* next button */}
        <div
          className="flex gap-1 items-center bg-primary text-white w-24 justify-center
        rounded-lg py-1 border-2 border-p-text"
        >
          <p>Next</p>
          <Image src={nextIcon} alt="icon" width={16} height={16} />
        </div>
      </div>
    </div>
  );
}
// open-ended questions
function OpenEndedQuestions() {
  return (
    <div className="flex flex-col gap-5 min-h-[600px] max-h-[700px] overflow-scroll">
      <p className="text-xl text-primary">2. Explain Hoisting in Javascript</p>
      <div className="flex flex-col gap-2 max-w-[500px]">
        <label>Answer</label>
        <textarea
          cols={20}
          row={20}
          name="answer"
          className="border-2 border-p-text 
            outline-primary p-2 rounded-md resize-none"
        />
      </div>
    </div>
  );
}

function Questions() {
  const { data, error, loading, refetch } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_BASE_URL}/audiobook/s`
  );
  console.log(data?.data);

  return (
    <div className="inter-font dashboard-main bg-white px-5 rounded-md border-2 border-p-text">
      <div className="flex flex-col gap-2 my-2">
        <h2 className="text-2xl text-primary">Practice Questions</h2>
        <p className="text-p-text text-sm sm:text-xl">
          Studies have shown that Practice questions help you retain information
          better
        </p>
      </div>
      <div className="my-4">
        <p className="text-lg text-primary font-semibold">Name</p>
        <div
          className="bg-secondary text-p-text border-t-2 border-primary 
          pt-1 pb-4 pl-5"
        >
          {truncateText("Full Stack Web Development Practice questions", 60)}
        </div>
      </div>
      {/* questions */}
      <div>
        {/* <IntroQuestions/> */}
        <MultipleChoiceQuestions />
        {/* <OpenEndedQuestions /> */}
      </div>
    </div>
  );
}

export default Questions;
