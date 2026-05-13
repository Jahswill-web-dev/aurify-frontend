"use client";
import Link from "next/link";
import logo from "../../../public/icons/aurify-ai.svg";
import Image from "next/image";
import bars from "../../../public/icons/bars.svg";
import aurifyLogo from "../../../public/icons/aurify-new-logo.png";

import { useState } from "react";
function Navbar() {
  const [open, setOpen] = useState(false);

  const handleNav = () => {
    console.log("bar clicked!!!");
    setOpen(!open);
  };
  return (
    <nav className="container mt-6">
      <div className="flex items-center justify-between">
        {/* logo */}
        <Image src={aurifyLogo} width={150} height={150} alt="Aurify AI Logo" />

        {/* Desktop Nav Links */}
        <div
          className="hidden px-8 py-3
        min-[610px]:flex gap-[2.8125rem] text-grey-100 text-h5 inter-font font-bold"
        >
          <Link href="/blog" className="hover:text-primary-25">
            Blogs
          </Link>
          <Link href="#features" className="hover:text-primary-25">
            Features
          </Link>
          <Link href="/login" className="hover:text-primary-25">
            Login
          </Link>
        </div>
        {/* signup button */}
        <div className="flex gap-2">
          <div className="flex  min-[600px]:gap-[1rem] items-center">
            {/* <Link
              href="/blogs"
              className="px-5 py-2 rounded-[50px] bg-primary-25 text-accent-25 
            text-h5 poppins-font-bold"
            >
              blogs
            </Link> */}
            <Link
              href="/login"
              className="px-5 py-2 rounded-[6px] bg-primary-50 text-off-white-100
            text-h5 poppins-font"
            >
              Sign Up Free
            </Link>
          </div>
          {/* Mobile bars */}
          {/* <div className="min-[900px]:hidden" onClick={handleNav}>
            <Image src={bars} width={50} height={50} alt="bars" className="cursor-pointer"/>
          </div> */}
        </div>
      </div>

      {/* Side Nav */}
      <div
        className={`min-[900px]:hidden absolute top-0 bottom-0 left-0 bg-accent-100 w-3/4 min-[600px]:w-1/2 text-primary-25 text-h5 inter-font-bold
      p-10 transition-transform -translate-x-full ${
        open ? "translate-x-0" : ""
      }`}
      >
        <div className="flex flex-col gap-7">
          <Link href="/blog">Blogs</Link>
          <Link href="#features">Features</Link>
          {/* <Link href="/pricing">Pricing</Link> */}
        </div>
        <div className="flex flex-col-reverse gap-5 items-start mt-5">
          <Link
            href="/signup"
            className="px-5 py-2 rounded-[50px] bg-primary-25 text-accent-25 
            text-h5 poppins-font-bold"
          >
            Sign Up
          </Link>
          <Link
            href="/login"
            className="px-5 py-2 rounded-[50px] border-2 border-primary-200 text-primary-100 
            text-h5 poppins-font-bold"
          >
            Log In
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
