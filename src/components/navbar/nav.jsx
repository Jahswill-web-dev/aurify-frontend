"use client";
import Link from "next/link";
import logo from "../../../public/icons/aurify-logo.svg";
import Image from "next/image";
import bars from "../../../public/icons/bars.svg";
import { useState } from "react";
function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="container flex flex-col justify-between items-center my-5
    md:flex-row md:justify-between"
    >
      {/* Logo */}
      <div className="flex items-center w-full justify-between">
        <Link href="/" className="">
          <Image
            className="mx-auto mt-2"
            src={logo}
            alt="aurify logo"
            width={100}
            height={100}
          />
        </Link>
        {/* bars icon */}
        <Image
          onClick={() => setOpen(!open)}
          src={bars}
          width={40}
          height={40}
          className="cursor-pointer md:hidden"
        />
      </div>

      {/* Links */}
      <div
        className={`${
          open ? "h-[80px]" : "h-0"
        } md:h-auto w-full flex flex-col gap-2 md:gap-10 items-center
      md:flex-row md:justify-end overflow-hidden transition-all`}
      >
        <Link
          href="/blog"
          className="text-p-text-darker roboto-font text-x-sub-head hover:text-p-text"
        >
          Blog
        </Link>
        <Link
          href="/signup"
          className="px-5 py-2 rounded-lg roboto-font font-semibold bg-primary text-secondary
          active:scale-95 transition-transform"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
