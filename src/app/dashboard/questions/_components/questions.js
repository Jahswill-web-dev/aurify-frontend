"use client";
import Image from "next/image";
import ellipse from "../../../../../public/icons/ellipse.svg";
import nextIcon from "../../../../../public/icons/next.svg";
import backIcon from "../../../../../public/icons/back.svg";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import back from "../../../../../public/icons/darkback.svg";
import Loading from "../../_components/loading";
import Link from "next/link";

//...........................
// Break it down step by step
//...........................

function truncateText(text, maxLength) {
  if (typeof text !== "string") {
    return "";
  }
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

function Option({ id, value, onChange, isSelected, isCorrect, isWrong }) {
  const [selectedOption, setSelectedOption] = useState("");
  // console.log(id);
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
    onChange(value);
  };
  if (isSelected) {
    var backgroundColor = "bg-white";
    backgroundColor = isCorrect
      ? "bg-green-300"
      : isWrong
      ? "bg-red-300"
      : isSelected && correctAnswer.includes(value)
      ? "bg-green-500"
      : "bg-white";
  }
  let letter;
  switch (id) {
    case 0:
      letter = "(A)";
      break;
    case 1:
      letter = "(B)";
      break;
    case 2:
      letter = "(C)";
      break;
    case 3:
      letter = "(D)";
      break;

    default:
      break;
  }
  // console.log(letter);
  return (
    <div className="flex items-center gap-5">
      <p className="text-h3">{letter}</p>
      <div
        className={`hover:scale-105 text-xl border border-grey-50 rounded-[15px] p-1 flex gap-2 w-[400px] ${backgroundColor}
        px-2`}
      >
        <label
          className="text-grey-200 w-full cursor-pointer relative text-h5 poppins-font flex items-center justify-between
        "
        >
          {value}
          <input
            className="w-4 h-4 cursor-pointer peer top-1 left-0 opacity-0"
            type="radio"
            name="radio"
            value={value}
            checked={isSelected}
            onChange={handleChange}
          />
          <span className="p-1 border-p-text border w-8 h-8 rounded-full peer-checked:bg-primary"></span>
        </label>
        <br />
      </div>
    </div>
  );
}
function CheckBox({
  value,
  isChecked,
  onChange,
  correctAnswer,
  isCorrect,
  isWrong,
}) {
  const [selectedOption, setSelectedOption] = useState();
  const handleChange = (e) => {
    // setSelectedOption(isChecked);
    onChange(value);
    // console.log(e.target)
  };
  if (isChecked) {
    var backgroundColor = "bg-white";
    backgroundColor = isCorrect
      ? "bg-green-500"
      : isWrong
      ? "bg-red-500"
      : isChecked && correctAnswer.includes(value)
      ? "bg-green-500"
      : "bg-white";
  }

  return (
    <div>
      <div
        className={` hover:scale-105 hover:text-primary text-xl border-2 border-p-text rounded-md p-1 flex gap-2 max-w-[300px] ${backgroundColor}`}
      >
        <label className="pl-10 w-full cursor-pointer relative">
          {value}
          <input
            className="w-4 h-4 cursor-pointer peer absolute top-1 left-0 opacity-0"
            type="checkbox"
            name="checkbox"
            value={value}
            checked={isChecked}
            onChange={(e) => handleChange(e)}
          />
          <span className="p-1 border-p-text border-2 w-6 h-6 absolute top-0 left-0 peer-checked:bg-primary"></span>
        </label>
        <br />
      </div>
    </div>
  );
}
// Intro questions
function TotalScore({
  totalScore,
  totalScorePercentage,
  totalNumOfQuestions,
  numOfIncorrectAns,
}) {
  return (
    <div>
      <p className="text-grey-100 text-h3">
      Performance Overview
      </p>
      <div className="flex flex-col gap-2 pt-10 pb-5 sm:py-10 sm:flex-row">
        <div className="bg-accent-100 inline-block px-4 py-4 rounded-lg text-grey-50">
          <p>Total Questions</p>
          <p className="text-h3">{totalNumOfQuestions}</p>
        </div>

        <div className="bg-accent-100 inline-block px-4 py-4 rounded-lg text-grey-50">
          <p>Correct Answers</p>
          <p className="text-h3">{totalScore}</p>
        </div>

        <div className="bg-red-400 inline-block px-4 py-4 rounded-lg text-off-white">
          <p>Incorrect Answers</p>
          <p className="text-h3">{numOfIncorrectAns}</p>
        </div>
        <div className="bg-accent-100 inline-block px-4 py-4 rounded-lg text-grey-50">
          <p>Score</p>
          <p className="text-h3">{totalScorePercentage}</p>
        </div>
      </div>
      <Link
        href="/dashboard/questions"
        className="text-off-white-50 bg-red-400 inline-block px-5 py-2 rounded-lg"
      >
        Exit
      </Link>
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
  isCorrectAnswer,
  correctAnswer,
  numOfQuestions,
  currentNum,
  sendDataToQuestions,
  calculateScores,
}) {
  const [isFinished, setIsFinished] = useState(false);
  // console.log(question);
  function finished() {
    setIsFinished(!isFinished);
    calculateScores();
  }
  useEffect(() => {
    sendDataToQuestions(isFinished);
  }, [isFinished]);

  return (
    <div className="flex flex-col gap-5 min-h-[600px] max-h-[700px] w-full">
      <p className="text-primary-50 text-h5 inter-font">
        Question {currentNum + 1} of {numOfQuestions}
      </p>
      <p className="text-grey-100 text-h4 poppins-font sm:text-xl">
        {question}{" "}
      </p>
      <div className="flex flex-col gap-5">
        {Array.isArray(answer)
          ? options.map((option, index) => {
              const isCorrectOption = correctAnswer.includes(option);
              const isSelectedWrong =
                selectedCheckboxAnswers.includes(option) &&
                !correctAnswer.includes(option);

              return (
                <CheckBox
                  key={index}
                  value={option}
                  isChecked={selectedCheckboxAnswers.includes(option)}
                  onChange={onOptionChange}
                  isCorrect={isCorrectOption}
                  isWrong={isSelectedWrong}
                  correctAnswer={correctAnswer}
                />
              );
            })
          : options.map((option, index) => {
              const isCorrectOption = correctAnswer === option;
              const isSelectedWrong =
                selectedAnswer === option && correctAnswer !== option;
              return (
                <Option
                  id={index}
                  key={index}
                  value={option}
                  onChange={onOptionChange}
                  isSelected={selectedAnswer === option}
                  isCorrect={isCorrectOption}
                  isWrong={isSelectedWrong}
                />
              );
            })}

        {/* <Option value={answer} />
        <Option value={answer} />
        <Option value={answer} />
        <Option value={answer} /> */}
      </div>

      {/* ...................................... */}
      <div className="flex justify-between items-center max-w-[300px] ml-10 md:ml-24 gap-3">
        {/* previous button */}
        <div
          onClick={subtract}
          className="flex gap-1 items-center bg-primary-50 text-accent-25 w-24 justify-center
        rounded-[50px] py-1 hover:cursor-pointer active:scale-105 text-h5 poppins-font-bold"
        >
          <p>Back</p>
        </div>
        {/* Quit button */}
        <Link
          href="/dashboard/questions"
          className="flex gap-1 items-center bg-red-500 text-accent-25 w-24 justify-center
        rounded-[50px] py-1 border-2 hover:cursor-pointer active:scale-105 poppins-font-bold text-h5"
        >
          <p>Quit</p>
        </Link>
        {/* next button */}

        <div>
          {currentNum + 1 === numOfQuestions ? (
            <div
              onClick={finished}
              className="flex gap-1 items-center bg-grey-100 text-accent-25 w-24 justify-center
          rounded-[50px] py-1 hover:cursor-pointer active:scale-105 text-h5 poppins-font-bold"
            >
              <p>Finish</p>
            </div>
          ) : (
            <div
              onClick={add}
              className="flex gap-1 items-center bg-primary-50 text-accent-25 w-24 justify-center
        rounded-[50px] py-1 hover:cursor-pointer active:scale-105 text-h5 poppins-font-bold"
            >
              <p>Next</p>
            </div>
          )}
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
  const [answers, setAnswers] = useState({}); //user answers
  const [checkboxAnswers, setCheckboxAnswers] = useState({});
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(null);
  const [currentpdfName, setPdfName] = useState();
  const [numberOfQuestions, setNumberOfQuestions] = useState();
  const [isFinished, setIsFinished] = useState(); //flag to track the end of the test
  const [extractedAns, setExtractedAns] = useState(); // Correct answers
  const [isNextEnabled, setIsNextEnabled] = useState();
  const [totalScore, setTotalScore] = useState();
  const [totalScorePercentage, setTotalScorePercentage] = useState();
  const [totalNumOfQuestions, setTotalNumOfQuestions] = useState();
  const [numOfIncorrectAns, setNumOfIncorrectAns] = useState();

  const latestValueRef = useRef();

  const hasExtractedRef = useRef(false);

  const router = useRouter();
  const { data, error, loading, refetch } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/audiobook/s/${slug}`
  );
  // console.log(data)
  const { pdfName } = useSelector((store) => store.dashboard);

  useEffect(() => {
    // console.log(data.data[1]);
    if (!hasExtractedRef.current && data?.data) {
      let questions = data?.data[1];
      if (Array.isArray(questions)) {
        const allAnswers = questions.map((question) => question.answer);
        setExtractedAns((prevAns) => [...(prevAns || []), ...allAnswers]);
        hasExtractedRef.current = true;
      }
    }
  }, [data]);

  useEffect(() => {
    if (extractedAns) {
      console.log("Updated extractedAns:", extractedAns);
    }
  }, [extractedAns]);

  useEffect(() => {
    if (data?.data && data.data[0].title !== currentpdfName) {
      setPdfName(data.data[0].title); // Only set when the title changes
    }
  }, [data, currentpdfName]);

  useEffect(() => {
    if (data?.data) {
      setQuestion(data?.data[1][0]);
      setMaxNum(data?.data[1].length);
      setNumberOfQuestions(data.data[1].length);
      // console.log(data);
    }
  }, [data]);

  // console.log("component rendered");
  useEffect(() => {
    if (data?.data && num < maxNum) {
      setQuestion(data.data[1][num]); // Set question based on current num
    }
  }, [num, data, maxNum]);
  const add = () => {
    setNum((prevNum) => Math.min(prevNum + 1, maxNum));
    // console.log(num);
    setIsNextEnabled(true);
  };

  const subtract = () => {
    setNum((prevNum) => Math.max(prevNum - 1, 0));
    setIsNextEnabled(false);
  };
  const handleOptionChange = (value, isChecked) => {
    // console.log(value);
    if (Array.isArray(question?.answer)) {
      //checks if the current question expects multiple answers
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

  // checks if the option chosen is correct
  useEffect(() => {
    if (Array.isArray(question?.answer)) {
      const userAnswers = checkboxAnswers[num] || [];
      const correctAnswers = question?.answer;
      const isCorrect =
        userAnswers?.sort().toString() === correctAnswers?.sort().toString();
      setIsCorrectAnswer(isCorrect);
    } else {
      const selectedAnswer = answers[num];
      const isCorrect = selectedAnswer === question?.answer;
      setIsCorrectAnswer(isCorrect);
    }
  }, [question, num, answers, checkboxAnswers]);

  function handleDataFromMultiple(data) {
    setIsFinished(data);
  }

  // useEffect(() => {
  //   console.log(answers);
  //   console.log(extractedAns);
  // }, [answers]);

  //A function that calculates total scores
  function calculateScores() {
    let score = 0;
    let scorePercentage;
    let correctQuestions = [];
    let IncorrectQuestions = [];
    //Calculates number of correct answers for single choice questions
    for (let i = 0; i < extractedAns.length; i++) {
      if (answers[i] === extractedAns[i]) {
        score++;
      }
    }
    setTotalScore(score);
    scorePercentage = (score / extractedAns.length) * 100;
    setTotalScorePercentage(`${scorePercentage}%`);
    setTotalNumOfQuestions(extractedAns.length);
    setNumOfIncorrectAns(extractedAns.length - score);
    // console.log(`${score} / ${extractedAns.length}`);
    //get questions answered wrong and present the correct answers
  }
  return (
    <div className="mx-auto w-full px-10 md:pl-24 py-5">
      {isFinished ? (
        <TotalScore
          totalScore={totalScore}
          totalScorePercentage={totalScorePercentage}
          totalNumOfQuestions={totalNumOfQuestions}
          numOfIncorrectAns={numOfIncorrectAns}
        />
      ) : (
        <div className="">
          <div className="my-4 text-grey-50 text-h2 poppins-font">
            <div>{truncateText(currentpdfName, 60)}</div>
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
                isCorrectAnswer={isCorrectAnswer}
                correctAnswer={question.answer}
                numOfQuestions={numberOfQuestions}
                currentNum={num}
                sendDataToQuestions={handleDataFromMultiple}
                calculateScores={calculateScores}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Questions;

// get an array of all the correct answers
// get an array of all the picked answers
// get the matching ones between the arrays
//get the numbers of the matched ones
//substract the matched ones from the picked answes
