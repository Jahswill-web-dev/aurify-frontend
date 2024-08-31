import Link from "next/link";
import Main from "../_components/main";
import Questions from "../_components/questions";

function QuestionPage() {
  // return <Main centerComp={<Questions />} name="questions" />;
  return (
    <div
      className="text-xl text-primary font-semibold text-center 
  w-full h-full flex flex-col items-center justify-center"
    >
      Coming Soon
      <Link
        href="/dashboard"
        className="border-2 border-p-text p-1 m-1 rounded-md bg-white"
      >
        Go back
      </Link>
    </div>
  );
}

export default QuestionPage;
