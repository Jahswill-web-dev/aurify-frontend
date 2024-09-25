"use client";
import Image from "next/image";
import ellipse from "../../../../../public/icons/ellipse.svg";
import nextIcon from "../../../../../public/icons/next.svg";
import backIcon from "../../../../../public/icons/back.svg";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import back from "../../../../../public/icons/darkback.svg";
import Loading from "../../_components/loading";
function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

function Option({ value, onChange, isSelected }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    onChange(value);
  };

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
          checked={isSelected}
          onChange={handleChange}
        />
        <span className="p-1 border-p-text border-2 w-6 h-6 absolute top-0 left-0 rounded-[50%] peer-checked:bg-primary"></span>
      </label>
      <br />
    </div>
  );
}
function CheckBox({ value, isChecked, onChange }) {
  const [selectedOption, setSelectedOption] = useState();
  const handleChange = (event) => {
    setSelectedOption(event.target.checked);
    onChange(value, event.target.checked);
  };
  return (  
    <div className=" hover:bg-secondary text-xl border-2 border-p-text rounded-md p-1 flex gap-2 max-w-[300px]">
      <label className="pl-10 w-full cursor-pointer relative">
        {value}
        <input
          className="w-4 h-4 cursor-pointer peer absolute top-1 left-0 opacity-0"
          type="checkbox"
          name="checkbox"
          value={value}
          checked={isChecked}
          onChange={handleChange}
        />
        <span className="p-1 border-p-text border-2 w-6 h-6 absolute top-0 left-0 peer-checked:bg-primary"></span>
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
function MultipleChoiceQuestions({
  question,
  options,
  answer,
  add,
  subtract,
  onOptionChange,
  selectedAnswer,
  selectedCheckboxAnswers,
}) {
  // console.log(selectedCheckboxAnswers);
  return (
    <div className="flex flex-col gap-5 min-h-[600px] max-h-[700px] w-full">
      <p className="text-primary text-base sm:text-xl">{question} </p>
      <div className="flex flex-col gap-5">
        {Array.isArray(answer)
          ? options.map((option, index) => (
              <CheckBox
                key={index}
                value={option}
                isChecked={selectedCheckboxAnswers.includes(option)}
                onChange={onOptionChange}
              />
            ))
          : options.map((option, index) => (
              <Option
                key={index}
                value={option}
                onChange={onOptionChange}
                isSelected={selectedAnswer === option}
              />
            ))}

        {/* <Option value={answer} />
        <Option value={answer} />
        <Option value={answer} />
        <Option value={answer} /> */}
      </div>
      <div className="flex justify-between items-center max-w-[300px]">
        {/* previous button */}
        <div
          onClick={subtract}
          className="flex gap-1 items-center bg-primary text-white w-24 justify-center
        rounded-lg py-1 border-2 border-p-text"
        >
          <Image src={backIcon} alt="icon" width={16} height={16} />
          <p>Back</p>
        </div>
        {/* next button */}
        <div
          onClick={add}
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

function Questions({ slug }) {
  const [num, setNum] = useState(0);
  const [maxNum, setMaxNum] = useState(1);
  const [question, setQuestion] = useState();
  const [answers, setAnswers] = useState({});
  const [checkboxAnswers, setCheckboxAnswers] = useState({});
  // const [checkboxAnswer, setCheckboxAnswer] = useState();
  const router = useRouter();
  const { data, error, loading, refetch } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_BASE_URL}/audiobook/s/${slug}`
  );

  useEffect(() => {
    if (data?.data) {
      setQuestion(data?.data[1][0]);
      setMaxNum(data?.data[1].length - 1);
    }
  }, [data]);

  useEffect(() => {
    if (data?.data && num < maxNum) {
      setQuestion(data.data[1][num]); // Set question based on current num
    }
  }, [num, data, maxNum]);
  const add = () => {
    setNum((prevNum) => Math.min(prevNum + 1, maxNum));
    // console.log(num);
  };

  const subtract = () => {
    setNum((prevNum) => Math.max(prevNum - 1, 0));
  };
  const handleOptionChange = (value, isChecked) => {
    if (Array.isArray(question?.answer)) {
      console.log("Checked!!!");
      setCheckboxAnswers((prev) => {
        const updatedAnswers = [...(prev[num] || [])];
        if (isChecked) {
          updatedAnswers.push(value);
        } else if (!isChecked) {
          const index = updatedAnswers.indexOf(value);
          if (index > -1) {
            updatedAnswers.splice(index, 1);
          }
        }
        return { ...prev, [num]: updatedAnswers };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [num]: value }));
    }
    
  };
  //a code that checks if the option chosen is correct
  useEffect(() => {
    if (Array.isArray(question?.answer)) {
      const userAnswers = checkboxAnswers[num] || [];
      const correctAnswers = question?.answer;
      const isCorrect =
        userAnswers?.sort().toString() === correctAnswers?.sort().toString();
  
      if (isCorrect) {
        console.log("Correct");
      } else {
        console.log("Wrong");
      }
    } else {
      const selectedAnswer = answers[num];
      const isCorrect = selectedAnswer === question?.answer;
      if (isCorrect) {
        console.log("Correct");
      } else {
        console.log("Wrong");
      }
    }
  }, [checkboxAnswers[num], question, answers[num], num]);

  // console.log(question);
  // console.log(answers[num]);
  // console.log("question id:", num);
  // console.log("checkbox answer: ", checkboxAnswer);

  return (
    <div className="mx-auto w-full">
      <button
        onClick={() => router.back()}
        className="border-primary border-2 px-2 py-1 bg-white
      text-p-text text-base font-medium roboto-font flex items-center gap-2 w-24 my-2 rounded-md"
      >
        <Image src={back} width={25} height={25} alt="back button" />
        <p>Back</p>
      </button>
      <div
        className="inter-font bg-white px-5 rounded-md border-2 border-p-text 
      h-[700px] w-full overflow-y-scroll"
      >
        <div className="flex flex-col gap-2 my-2">
          <h2 className="text-2xl text-primary">Practice Questions</h2>
          <p className="text-p-text text-sm sm:text-xl">
            Studies have shown that Practice questions help you retain
            information better
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
        <div className="h-[500px] flex gap-5">
          {question && (
            <MultipleChoiceQuestions
              question={question.question}
              options={question.options}
              answer={question.answer}
              add={add}
              subtract={subtract}
              selectedAnswer={answers[num]}
              selectedCheckboxAnswers={checkboxAnswers[num] || []}
              onOptionChange={handleOptionChange}
            />
          )}

          {/* <MultipleChoiceQuestions
            question="What is Javascript"
            options="A Programming language"
            answer="A Programming language"
          />{" "} */}
        </div>
      </div>
    </div>
  );
}

export default Questions;
