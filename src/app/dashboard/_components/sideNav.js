"use client";
import Image from "next/image";
import questionIcon from "../../../../public/icons/questiion-icon.svg";
import closeIcon from "../../../../public/icons/closeicon.svg";
import logout from "../../../../public/icons/arrow-right-from-bracket-solid.svg";
import { useSelector, useDispatch } from "react-redux";
import { closeNav } from "@/app/lib/features/nav/navSlice";
import { toggleUpload } from "@/app/lib/features/dashboard/dashboardSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookie from "js-cookie";
import { useRouter } from "next/navigation";
import plus from "../../../../public/icons/ic_baseline-plus.svg";
import summary from "../../../../public/icons/summary-check.svg";
import audio from "../../../../public/icons/light_headphones.svg";

function MobileNav() {
  const pathname = usePathname();
  const { isNavOpen } = useSelector((store) => store.nav);
  const dispatch = useDispatch();
  const router = useRouter();
  function closeNavigation() {
    dispatch(closeNav());
  }
  function openUpload() {
    dispatch(toggleUpload());
  }
  const handleLogout = () => {
    Cookie.remove("accessToken", { path: "/" });
    router.push("/");
  };

  return (
    <div className="md:hidden roboto-font">
      <div className="pl-4">
        {/* upload Button */}
        {/* <div
          onClick={openUpload}
          className="bg-secondary cursor-pointer text-primary rounded-xl border-2 border-p-text
      flex gap-0 items-center w-[132px] drop-shadow-xl px-2 active:scale-95"
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
          <p className="roboto-font">
            Summarize
          </p>
        </div> */}
      </div>
      {/* mobile respon1sive nav */}
      <div className="">
        <div
          className={`transition-all duration-500 absolute ${
            isNavOpen ? "right-14" : "right-full"
          } bg-white h-[700px] w-4/5 top-[13%] rounded-md
        border-[3px] border-p-text py-5 roboto-font z-20`}
        >
          <div className="h-full flex flex-col justify-between">
            <div>
              {/* free plan close icon... */}
              <div className="flex justify-between items-center px-3 ">
                <div></div>
                <div className="bg-white border-2 text-p-text-darker inter-font border-primary rounded-md p-1">
                  Free plan
                </div>
                <div onClick={closeNavigation} className="cursor-pointer">
                  <Image alt="" src={closeIcon} width={35} height={35} />
                </div>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col gap-8 mt-10">
                <Link href="/dashboard" className="cursor-pointer">
                  <div className="flex items-center gap-3 pl-4 inter-bold font-medium hover:text-primary-100 hover:scale-90 p-2 rounded-r-3xl">
                    <Image
                      alt="summary icon"
                      src={summary}
                      width={20}
                      height={20}
                    />
                    <p>Summaries</p>
                  </div>
                </Link>
                <Link href="/dashboard/questions" className="cursor-pointer">
                  <div className="flex items-center gap-3 pl-4 inter-bold font-medium hover:text-primary-100 hover:scale-90 p-2 rounded-r-3xl">
                    <Image
                      alt="home icon"
                      src={questionIcon}
                      width={20}
                      height={20}
                    />
                    <p>Practice Question</p>
                  </div>
                </Link>
                <Link href="/dashboard/audiobooks" className="cursor-pointer">
                  <div className="flex items-center gap-3 pl-4 inter-bold font-medium hover:text-primary-100 hover:scale-90 p-2 rounded-r-3xl">
                    <Image alt="Audio Icon" src={audio} width={20} height={20} />
                    <p>Audio</p>
                  </div>
                </Link>
                <div
                  className="flex gap-3 inter-bold text-grey-50 font-medium hover:scale-100 pl-4 cursor-pointer active:scale-95 hover:text-primary"
                  onClick={handleLogout}
                >
                  <Image
                    alt="logout icon"
                    src={logout}
                    width={20}
                    height={20}
                  />
                  <p>Logout</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SideNav() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();
  function openUpload() {
    dispatch(toggleUpload());
  }
  const handleLogout = () => {
    // Remove the session cookie
    Cookie.remove("accessToken", { path: "/" });

    router.push("/");
  };
  return (
    <div className="w-0 sm:w-[30%] lg:w-[20%]">
      {/* Mobile nav */}
      <MobileNav />
      {/* Desktop Nav */}
      <div className="hidden sm:flex roboto-font relative md:flex flex-col items-start  md:justify-between h-full">
        <div>
          {/* Upload button */}
          <div className="pl-4">
            <div
              onClick={openUpload}
              className="active:scale-95 cursor-pointer bg-primary-50 text-off-white-50 rounded-xl
          flex items-center h-[60px] shadow-lg w-[132px] drop-shadow-xl px-2"
            >
              <Image src={plus} alt="" width={47} height={47} />
              <p className="poppins-font text-h4">Upload</p>
            </div>
          </div>

          {/* Nav Links */}

          <div className="mt-12 flex flex-col gap-5">
            <Link href="/dashboard" className="cursor-pointer">
              <div className="flex items-center gap-3 pl-4 text-grey-50 inter-bold font-medium hover:text-primary-100 hover:scale-90 bg-white p-2 rounded-r-3xl">
                <Image alt="home icon" src={summary} width={30} height={30} />
                <p>Summaries</p>
              </div>
            </Link>
            <Link href="/dashboard/questions" className="cursor-pointer">
              <div className="flex items-center gap-3 pl-4 text-grey-50 inter-bold font-medium hover:text-primary-100 hover:scale-90 bg-white p-2 rounded-r-3xl">
                <Image
                  alt="home icon"
                  src={questionIcon}
                  width={25}
                  height={25}
                />
                <p>Practice Question</p>
              </div>
            </Link>
            <Link href="/dashboard/audiobooks" className="cursor-pointer">
              <div className="flex items-center gap-3 pl-4 text-grey-50 inter-bold font-medium hover:text-primary-100 hover:scale-90 bg-white p-2 rounded-r-3xl">
                <Image alt="home icon" src={audio} width={35} height={35} />
                <p>Audio</p>
              </div>
            </Link>

            <div
              className="flex gap-3 text-grey-50 inter-bold font-medium hover:text-primary-100 hover:scale-90 pl-4 cursor-pointer active:scale-95"
              onClick={handleLogout}
            >
              <Image alt="logout icon" src={logout} width={20} height={20} />
              <p>Logout</p>
            </div>

            {/* <Link href="/dashboard/questions">
              <div className="flex items-center gap-3 pl-4 text-p-text">
                <Image
                  alt="question icon"
                  src={questionIcon}
                  width={20}
                  height={20}
                />
                <p>practice Questions</p>
              </div>
            </Link> */}
          </div>
        </div>
        {/* upgrade */}
      </div>
      {/* dark overlay */}
      <div className="hidden bg-black absolute top-0 bottom-0 left-0 right-0 opacity-30"></div>
    </div>
  );
}

export default SideNav;
