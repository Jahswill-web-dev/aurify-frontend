import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useSelector } from "react-redux";
import { store } from "@/app/lib/store";

function AudioControlls() {
  const { audioSrc } = useSelector((store) => store.dashboard);

  return (
    <div className="w-full fixed bottom-0">
      {audioSrc && <AudioPlayer src={audioSrc} autoPlay/>}
    </div>
  );
}

export default AudioControlls;
