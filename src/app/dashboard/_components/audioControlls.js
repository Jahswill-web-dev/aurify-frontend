import prev from "../../../../public/icons/prev.svg";
import next from "../../../../public/icons/next.svg";
import pause from "../../../../public/icons/pause-rounded.svg";
import play from "../../../../public/icons/play-bold.svg";
import download from "../../../../public/icons/download.png";
import Image from "next/image";


function AudioControlls() {
  return (
    <div className="bg-accent-100 w-full h-[70px] flex items-center justify-center
    fixed bottom-0">
      <div className="flex items-center justify-center gap-10">
        {/* Player controlls */}
        <div className="flex gap-4 items-center">
          <Image src={prev} alt="" width={30} height={30}/>
          <div>
            {/* <Image src={play} alt="" width={30} height={30}/> */}
            <Image src={pause} alt="" width={40} height={40}/>
          </div>
          <Image src={next} alt="" width={30} height={30}/>
        </div>
        {/* Progress bar*/}
        <div>
          <input
            type="range"
            min="0"
            max={100}
            value={80}
            onChange={(e) => onSeek(e.target.value)}
          />
        </div>
        {/* Download */}
        <div>
            <Image src={download} alt="" width={40} height={40}/>
        </div>
      </div>
    </div>
  );
}

export default AudioControlls;
