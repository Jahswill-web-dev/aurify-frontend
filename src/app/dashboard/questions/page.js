import { redirect } from "next/navigation";
import SideNav from "../_components/sideNav";
import DashboardNav from "../_components/dashboardNav";
import AllQuestsions from "./_components/allquestions";

function QuestionPage() {
  // return <Main centerComp={<Questions />} name="questions" />;
  // return redirect("/dashboard");
  return (
    <div>
      <DashboardNav />
      <div className="flex w-full py-3">
        <SideNav />
        <div className="min-[200px]:w-full sm:w-[70%] lg:w-[80%] flex justify-end">
          <AllQuestsions/>
        </div>
      </div>
    </div>
  );
}

export default QuestionPage;
