import Image from "next/image";
import WhiteHomeIcon from "../../../../public/icons/white-home-icon.svg";
import homeIcon from "../../../../public/icons/home-icon.svg";
import bookmarkIcon from "../../../../public/icons/bookmark-icon.svg";
import questionIcon from "../../../../public/icons/questiion-icon.svg";
import crown from "../../../../public/icons/crown-icon.svg";
import settingsIcon from "../../../../public/icons/settings.svg";
import closeIcon from "../../../../public/icons/closeicon.svg";

function SideNav() {
  return (
    <div className="w-[30%] lg:w-[20%]">
      {/* Mobile nav */}
      <div className="md:hidden roboto-font ">
        <div className="pl-4">
          <div
            className="bg-secondary text-primary rounded-xl border-2 border-p-text
          flex gap-2 items-center w-[122px] drop-shadow-xl"
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.1673 29.3333V14.3916L15.4007 19.1583L12.834 16.5L22.0007 7.33331L31.1673 16.5L28.6007 19.1583L23.834 14.3916V29.3333H20.1673ZM11.0007 36.6666C9.99232 36.6666 9.12943 36.3079 8.41198 35.5905C7.69454 34.873 7.33521 34.0095 7.33398 33V27.5H11.0007V33H33.0007V27.5H36.6673V33C36.6673 34.0083 36.3086 34.8718 35.5912 35.5905C34.8737 36.3091 34.0102 36.6679 33.0007 36.6666H11.0007Z"
                fill="#F7931A"
              />
            </svg>
            <p className="roboto-font">Upload</p>
          </div>
        </div>
        {/* mobile responsive nav */}
        <div className="hidden">
          <div
            className="absolute bg-white h-[90%] w-4/5 top-[13%] rounded-md
            border-[3px] border-p-text py-5 roboto-font z-10"
          >
            <div className="flex justify-between items-center px-3 ">
              <div></div>
              <div className="bg-white border-2 border-primary rounded-md p-1">
                free plan
              </div>
              <div>
                <Image alt="" src={closeIcon} width={35} height={35} />
              </div>
            </div>

            {/* Nav Links */}
            <div className="flex flex-col gap-4 mt-10">
              <div className="flex items-center gap-3 pl-4 text-p-text">
                <Image alt="home icon" src={homeIcon} width={20} height={20} />
                <p>Home</p>
              </div>
              <div className="flex gap-3 text-p-text pl-4">
                <Image
                  alt="bookmark icon"
                  src={bookmarkIcon}
                  width={20}
                  height={20}
                />
                <p>Bookmarks</p>
              </div>
              <div className="flex items-center gap-3 pl-4 text-p-text">
                <Image
                  alt="question icon"
                  src={questionIcon}
                  width={20}
                  height={20}
                />
                <p>Practice Questions</p>
              </div>
              <div className="flex items-center gap-3 pl-4 text-p-text">
                <Image
                  alt="settings icon"
                  src={settingsIcon}
                  width={28}
                  height={28}
                />
                <p>Settings</p>
              </div>
            </div>
          </div>
        </div>
        <div className="pl-4 roboto-font">
          <div
            className="absolute bottom-0 bg-p-text w-[205px] h-[244px] text-white flex
          flex-col gap-3 pt-5 pb-2 px-2 rounded-md border-2 border-p-text-darker
          bg-gradient-to-b from-p-text via-p-text via-60% to-white z-10"
          >
            <p className="text-xl">Upgrade to Premium</p>
            <p className="text-[12px]">
              Experience the true power of Aurify by upgrading to Premium,
              limitless practice question and much more{" "}
            </p>
            <div
              className="flex gap-8 items-center justify-center bg-gradient-to-r from-p-text
             to-secondary rounded-md border-2 border-white mt-11"
            >
              <p className="lg:text-xl">Upgrade</p>
              <Image alt="crown icon" src={crown} width={39} height={39} />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Nav */}
      <div className="hidden roboto-font relative md:flex flex-col items-start h-[80vh]">
        {/* Upload button */}
        <div className="pl-4">
          <div
            className=" bg-secondary text-primary rounded-xl border-2 border-p-text
          flex gap-2 items-center w-[122px] h-[60px] drop-shadow-xl"
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.1673 29.3333V14.3916L15.4007 19.1583L12.834 16.5L22.0007 7.33331L31.1673 16.5L28.6007 19.1583L23.834 14.3916V29.3333H20.1673ZM11.0007 36.6666C9.99232 36.6666 9.12943 36.3079 8.41198 35.5905C7.69454 34.873 7.33521 34.0095 7.33398 33V27.5H11.0007V33H33.0007V27.5H36.6673V33C36.6673 34.0083 36.3086 34.8718 35.5912 35.5905C34.8737 36.3091 34.0102 36.6679 33.0007 36.6666H11.0007Z"
                fill="#F7931A"
              />
            </svg>
            <p className="roboto-font">Upload</p>
          </div>
        </div>
        {/* Nav Links */}
        <div className="mt-12 flex flex-col gap-5">
          <div className="flex items-center gap-3 pl-4 text-p-text">
            <Image alt="home icon" src={homeIcon} width={20} height={20} />
            <p>Home</p>
          </div>
          <div className="flex gap-3 text-p-text pl-4">
            <Image
              alt="bookmark icon"
              src={bookmarkIcon}
              width={20}
              height={20}
            />
            <p>Bookmarks</p>
          </div>
          <div className="flex items-center gap-3 pl-4 text-p-text">
            <Image
              alt="question icon"
              src={questionIcon}
              width={20}
              height={20}
            />
            <p>practice Questions</p>
          </div>
        </div>
        {/* upgrade */}
        <div className="pl-4 roboto-font">
          <div
            className="absolute bottom-0 bg-p-text w-[205px] h-[244px] text-white hidden md:flex
          flex-col gap-3 pt-5 pb-2 px-2 rounded-md border-2 border-p-text-darker
          bg-gradient-to-b from-p-text via-p-text via-60% to-white"
          >
            <p className="text-xl">Upgrade to Premium</p>
            <p className="text-[12px]">
              Experience the true power of Aurify by upgrading to Premium,
              limitless practice question and much more{" "}
            </p>
            <div
              className="flex gap-8 items-center justify-center bg-gradient-to-r from-p-text
             to-secondary rounded-md border-2 border-white mt-11"
            >
              <p className="lg:text-xl">Upgrade</p>
              <Image alt="crown icon" src={crown} width={39} height={39} />
            </div>
          </div>
        </div>
      </div>
      {/* dark overlay */}
      <div className="hidden bg-black absolute top-0 bottom-0 left-0 right-0 opacity-30">
      </div>
    </div>
  );
}

export default SideNav;
