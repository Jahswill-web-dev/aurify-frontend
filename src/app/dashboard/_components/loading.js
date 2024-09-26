import { RingSpinner } from "@/components/ui/ui";
import { Circles } from "react-loader-spinner";

function Loading() {
  return (
    <div>
      <div
        className="absolute h-full w-full flex items-center
        justify-center"
      >
        <div className="absolute h-full w-72 md:w-[408px]"></div>
        <div className="absolute z-20">
          <Circles
            height="100"
            width="100"
            color="#F7931A"
            ariaLabel="circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      </div>
    </div>
  );
}

export default Loading;
