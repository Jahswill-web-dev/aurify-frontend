import Image from "next/image";
import ellipse from "../../../../public/icons/ellipse.svg";
import nextIcon from "../../../../public/icons/next.svg";
import backIcon from "../../../../public/icons/back.svg";

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

function Option({ value }) {
  return (
    <div className="text-xl border-2 border-p-text rounded-md p-1 flex gap-2 max-w-[300px]">
      <div>
        <Image src={ellipse} alt="ellipse icon" width={24} height={24} />
      </div>
      <p>{value}</p>
    </div>
  );
}

// Intro questions
function IntroQuestions() {
  return (
    <div className="flex flex-col gap-5">
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
    <div className="flex flex-col gap-5">
      <p className="text-primary text-base sm:text-xl">What is Javascript? </p>
      <div className="flex flex-col gap-5">
        <Option value="Programming Language" />
        <Option value="Scripting language" />
        <Option value="Markup Language" />
        <Option value="None of the above" />
      </div>
      <div className="flex justify-between items-center w-[300px]">
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
  return <div></div>;
}

function Questions() {
  return (
    <div className="inter-font bg-white text-p-text px-3 py-5 rounded-md border-2 border-p-text h-full w-[100%] lg:w-[70%] min-h-[600px]">
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
      </div>
    </div>
  );
}

export default Questions;
