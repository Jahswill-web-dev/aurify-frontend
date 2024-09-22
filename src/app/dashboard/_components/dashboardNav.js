"use client";
import Image from "next/image";
import avatar from "../../../../public/icons/avatar.svg";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleNav } from "../../lib/features/nav/navSlice.js";

// logSomething()

function DashboardNav() {
  const { isNavOpen } = useSelector((store) => store.nav);
  const { userName, userSubscription } = useSelector((store) => store.dashboard);
  const dispatch = useDispatch();

  function navToggle() {
    dispatch(toggleNav());
  }
  

  return (
    <div className="w-full roboto-font">
      {/* Mobile Nav */}
      <div className="md:hidden border-2 border-p-text-darker p-2 w-[95%] mx-auto rounded-lg my-2">
        <div
          className="flex justify-between items-center+"
          >
          {/* bar Icon */}
          <div onClick={navToggle} className="cursor-pointer">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 22.6667C4 21.9303 4.59695 21.3333 5.33333 21.3333H26.6667C27.403 21.3333 28 21.9303 28 22.6667C28 23.403 27.403 24 26.6667 24H5.33333C4.59695 24 4 23.403 4 22.6667ZM4 16C4 15.2636 4.59695 14.6667 5.33333 14.6667H26.6667C27.403 14.6667 28 15.2636 28 16C28 16.7364 27.403 17.3333 26.6667 17.3333H5.33333C4.59695 17.3333 4 16.7364 4 16ZM4 9.33333C4 8.59695 4.59695 8 5.33333 8H26.6667C27.403 8 28 8.59695 28 9.33333C28 10.0697 27.403 10.6667 26.6667 10.6667H5.33333C4.59695 10.6667 4 10.0697 4 9.33333Z"
                fill="#817474"
              />
            </svg>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            <p className="text-lg sm:text-xl text-primary">
              Hello, {userName}
            </p>
            <Image
              alt="user Profile Image"
              src={avatar}
              width={35}
              height={35}
            />
          </div>
        </div>
        {/*  */}
        <div className="hidden">dropDown</div>
      </div>
      {/* desktop Nav */}
      <div className="hidden md:flex items-center max-w-[981px] mr-[20%] pl-10 py-2 justify-between">
        <div className="flex flex-row-reverse items-center gap-2">
          <p className="text-xl text-primary">Hello, {userName}</p>
          <Image alt="user Profile Image" src={avatar} width={65} height={65} />
        </div>
        <div className="bg-white border-2 border-primary rounded-md p-1">
          {userSubscription ? "Pro":"Free"}
        </div>
        {/* Settings */}
        <div>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.7496 20.95V19.0375L36.1496 16.9375C36.592 16.5476 36.8823 16.0138 36.9692 15.4305C37.0561 14.8472 36.9341 14.252 36.6246 13.75L33.6746 8.75002C33.4554 8.37035 33.1402 8.055 32.7606 7.8356C32.3811 7.6162 31.9505 7.50047 31.5121 7.50002C31.2404 7.49794 30.9702 7.54016 30.7121 7.62502L27.6746 8.65002C27.1509 8.30039 26.6037 7.98716 26.0371 7.71252L25.3996 4.56252C25.2853 3.98703 24.9722 3.47007 24.5152 3.10215C24.0581 2.73423 23.4862 2.53878 22.8996 2.55002H17.0496C16.463 2.53878 15.8911 2.73423 15.434 3.10215C14.977 3.47007 14.6639 3.98703 14.5496 4.56252L13.9121 7.71252C13.342 7.98834 12.7908 8.30152 12.2621 8.65002L9.28708 7.57502C9.0262 7.50705 8.75605 7.48172 8.48708 7.50002C8.04868 7.50047 7.6181 7.6162 7.23854 7.8356C6.85898 8.055 6.54379 8.37035 6.32458 8.75002L3.37458 13.75C3.08282 14.2513 2.9744 14.8383 3.06789 15.4107C3.16139 15.9831 3.45099 16.5052 3.88708 16.8875L6.24958 19.05V20.9625L3.88708 23.0625C3.43867 23.4475 3.14115 23.9789 3.04733 24.5625C2.95351 25.146 3.06945 25.7439 3.37458 26.25L6.32458 31.25C6.54379 31.6297 6.85898 31.945 7.23854 32.1644C7.6181 32.3838 8.04868 32.4996 8.48708 32.5C8.75877 32.5021 9.02898 32.4599 9.28708 32.375L12.3246 31.35C12.8483 31.6996 13.3954 32.0129 13.9621 32.2875L14.5996 35.4375C14.7139 36.013 15.027 36.53 15.484 36.8979C15.9411 37.2658 16.513 37.4613 17.0996 37.45H22.9996C23.5862 37.4613 24.1581 37.2658 24.6151 36.8979C25.0722 36.53 25.3853 36.013 25.4996 35.4375L26.1371 32.2875C26.7071 32.0117 27.2583 31.6985 27.7871 31.35L30.8121 32.375C31.0702 32.4599 31.3404 32.5021 31.6121 32.5C32.0505 32.4996 32.4811 32.3838 32.8606 32.1644C33.2402 31.945 33.5554 31.6297 33.7746 31.25L36.6246 26.25C36.9163 25.7488 37.0248 25.1617 36.9313 24.5893C36.8378 24.0169 36.5482 23.4949 36.1121 23.1125L33.7496 20.95ZM31.5121 30L27.2246 28.55C26.2203 29.3993 25.0734 30.0637 23.8371 30.5125L22.9496 35H17.0496L16.1621 30.5625C14.9355 30.1011 13.7948 29.4378 12.7871 28.6L8.48708 30L5.53708 25L8.93708 22C8.70595 20.7061 8.70595 19.3814 8.93708 18.0875L5.53708 15L8.48708 10L12.7746 11.45C13.7789 10.6008 14.9258 9.9363 16.1621 9.48752L17.0496 5.00002H22.9496L23.8371 9.43752C25.0636 9.8989 26.2044 10.5622 27.2121 11.4L31.5121 10L34.4621 15L31.0621 18C31.2932 19.2939 31.2932 20.6186 31.0621 21.9125L34.4621 25L31.5121 30Z"
              fill="#817474"
            />
            <path
              d="M20 27.5C18.5166 27.5 17.0666 27.0601 15.8332 26.236C14.5999 25.4119 13.6386 24.2406 13.0709 22.8701C12.5032 21.4997 12.3547 19.9917 12.6441 18.5368C12.9335 17.082 13.6478 15.7456 14.6967 14.6967C15.7456 13.6478 17.082 12.9335 18.5368 12.6441C19.9917 12.3547 21.4997 12.5032 22.8701 13.0709C24.2406 13.6386 25.4119 14.5999 26.236 15.8332C27.0601 17.0666 27.5 18.5166 27.5 20C27.51 20.9877 27.3229 21.9675 26.9495 22.882C26.5762 23.7964 26.0241 24.6272 25.3257 25.3257C24.6272 26.0241 23.7964 26.5762 22.882 26.9495C21.9675 27.3229 20.9877 27.51 20 27.5ZM20 15C19.3392 14.9846 18.6821 15.1034 18.0685 15.3492C17.4549 15.5951 16.8976 15.9628 16.4302 16.4302C15.9628 16.8976 15.5951 17.4549 15.3492 18.0685C15.1034 18.6821 14.9846 19.3392 15 20C14.9846 20.6608 15.1034 21.3179 15.3492 21.9315C15.5951 22.5451 15.9628 23.1024 16.4302 23.5698C16.8976 24.0372 17.4549 24.4049 18.0685 24.6508C18.6821 24.8966 19.3392 25.0154 20 25C20.6608 25.0154 21.3179 24.8966 21.9315 24.6508C22.5451 24.4049 23.1024 24.0372 23.5698 23.5698C24.0372 23.1024 24.4049 22.5451 24.6508 21.9315C24.8966 21.3179 25.0154 20.6608 25 20C25.0154 19.3392 24.8966 18.6821 24.6508 18.0685C24.4049 17.4549 24.0372 16.8976 23.5698 16.4302C23.1024 15.9628 22.5451 15.5951 21.9315 15.3492C21.3179 15.1034 20.6608 14.9846 20 15Z"
              fill="#817474"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default DashboardNav;
