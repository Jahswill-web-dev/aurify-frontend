import Image from "next/image";
import bookmarkIcon from "../../../../public/icons/transparent-bookmark.svg";
import coloredBookMarkIcon from "../../../../public/icons/colored-bookmark.svg";
import playIcon from "../../../../public/icons/play-icon.svg";
import pauseIcon from "../../../../public/icons/pause-icon.svg";
import questionIcon from "../../../../public/icons/questiion-icon.svg";
import headphoneIcon from "../../../../public/icons/headphone.svg";
import summaryIcon from "../../../../public/icons/summary.svg";
import shareIcon from "../../../../public/icons/share.svg";
import deleteIcon from "../../../../public/icons/delete.svg";
import cheveronDown from "../../../../public/icons/chevron-down.svg";

function Details() {
  return (
    <div className="hidden inter-font overflow-hidden w-0 lg:block lg:w-[30%] bg-white rounded-md border-2 border-p-text px-2 py-3">
      <div className="flex flex-col gap-2">
        <h1 className="text-primary font-semibold text-xl">
          Fullstack webdevelopment
        </h1>
        {/* options */}
        <div className="flex flex-col gap-5 items-start mt-3">
          <div className="flex  gap-3 items-center hover:text-primary">
            <Image
              src={questionIcon}
              alt="question icon"
              width={30}
              height={30}
            />
            <p>Take Test questions</p>
          </div>
          <div className="flex  gap-3 items-center hover:text-primary">
            <Image
              src={headphoneIcon}
              alt="audio icon"
              width={30}
              height={30}
            />
            <p>listen to audio</p>
          </div>
          <div className="flex  gap-3 items-center hover:text-primary">
            <Image
              src={summaryIcon}
              alt="summary icon"
              width={30}
              height={30}
            />
            <p>Read summary</p>
          </div>
          <div className="flex  gap-3 items-center hover:text-primary">
            <Image src={shareIcon} alt="share icon" width={30} height={30} />
            <p>share</p>
          </div>
          <div className="flex  gap-3 items-center hover:text-primary">
            <Image src={deleteIcon} alt="delete icon" width={30} height={30} />
            <p>Delete</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileDetails() {
  return (
    <div className="md:hidden">
      <div className="inter-font fixed bottom-0  w-full bg-white rounded-lg border-2 border-p-text py-4 px-4">
        <div className="flex w-full items-center mb-4 justify-center">
          <Image src={cheveronDown} alt="icon" width={40} height={40} />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-primary font-semibold text-xl roboto-font">
            Fullstack web development
          </h1>
          {/* options */}
          <div className="flex flex-col gap-5 items-start mt-3 text-p-text inter-font">
            <div className="flex  gap-4 items-center hover:text-primary">
              <Image
                src={questionIcon}
                alt="question icon"
                width={40}
                height={40}
              />
              <p>Take Test questions</p>
            </div>
            <div className="flex  gap-4 items-center hover:text-primary">
              <Image
                src={headphoneIcon}
                alt="audio icon"
                width={40}
                height={40}
              />
              <p>Listen to audio</p>
            </div>
            <div className="flex  gap-4 items-center hover:text-primary">
              <Image
                src={summaryIcon}
                alt="summary icon"
                width={40}
                height={40}
              />
              <p>Read summary</p>
            </div>
            <div className="flex  gap-4 items-center hover:text-primary">
              <Image src={shareIcon} alt="share icon" width={40} height={40} />
              <p>Share</p>
            </div>
            <div className="flex  gap-4 items-center hover:text-primary">
              <Image
                src={deleteIcon}
                alt="delete icon"
                width={40}
                height={40}
              />
              <p>Delete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Details, MobileDetails };
