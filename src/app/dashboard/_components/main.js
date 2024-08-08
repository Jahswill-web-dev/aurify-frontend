import { Details } from "./details";
import Pdfs from "./pdfs";
import Questions from "./questions";
import Summary from "./summary";

function Main() {
  return (
    // Change View based on url in the browser
    <div className="px-4 w-full md:w-[70%] lg:w-[80%] mt-7 md:mt-0">
      <div className="w-full flex h-full gap-2">
        {/* <Pdfs /> */}
        {/* <Questions/> */}
        {/* Details */}
        <Summary/>
        <Details />
      </div>
    </div>
  );
}

export default Main;
