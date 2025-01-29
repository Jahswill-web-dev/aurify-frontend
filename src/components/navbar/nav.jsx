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
          className="hidden rounded-[50px] border border-grey-50 px-8 py-3 bg-white
        min-[900px]:flex gap-[2.8125rem] text-primary-25 text-h5 inter-font-bold"
        >
          <Link href="/blogs">Blogs</Link>
          <Link href="#features">Features</Link>
          {/* <Link href="/pricing">Pricing</Link> */}
        </div>
        {/* signup and login buttons */}
        <div className="flex gap-2">
          <div className="hidden min-[600px]:flex  min-[600px]:gap-[1rem] items-center">
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
          {/* Mobile bars */}
          <div className="min-[900px]:hidden" onClick={handleNav}>
            <Image src={bars} width={50} height={50} alt="bars" className="cursor-pointer"/>
          </div>
        </div>
      </div>
      {/* Side Nav */}
      <div
        className={`min-[900px]:hidden absolute top-0 bottom-0 left-0 bg-accent-100 w-3/4 min-[600px]:w-1/2 text-primary-25 text-h5 inter-font-bold
      p-10 transition-transform -translate-x-full ${open ? "translate-x-0":""}`}
      >
        <div className="flex flex-col gap-7">
          <Link href="/blogs">Blogs</Link>
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
