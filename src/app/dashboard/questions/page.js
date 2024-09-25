import { redirect } from "next/navigation";

function QuestionPage() {
  // return <Main centerComp={<Questions />} name="questions" />;
  return redirect("/dashboard");
}

export default QuestionPage;
