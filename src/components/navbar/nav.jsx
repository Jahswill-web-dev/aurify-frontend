"use client";
import Link from "next/link";
import Image from "next/image";
import aurifyLogo from "../../../public/icons/aurify-new-logo.png";
import ThemeToggle from "@/components/theme/ThemeToggle";

function Navbar() {
  return (
    <nav className="container mt-6">
      <div className="flex items-center justify-between">
        {/* logo */}
        <Image src={aurifyLogo} width={150} height={150} alt="Aurify AI Logo" />

        {/* Desktop Nav Links */}
        <div
          className="hidden px-8 py-3
        min-[710px]:flex gap-[2.8125rem] text-grey-100 text-h5 inter-font font-bold dark:text-dark-muted"
        >
          <Link href="#features" className="hover:text-primary dark:hover:text-primary-25">
            Features
          </Link>
          <Link href="/login" className="hover:text-primary dark:hover:text-primary-25">
            Login
          </Link>
        </div>
        {/* signup button */}
        <div className="flex items-center gap-2">
          <ThemeToggle className="px-2 sm:px-3" showLabel={false} />
          <div className="flex min-[600px]:gap-[1rem] items-center">
            {/* <Link
              href="/blogs"
              className="px-5 py-2 rounded-[50px] bg-primary-25 text-accent-25 
            text-h5 poppins-font-bold"
            >
              blogs
            </Link> */}
            <Link
              href="/signup"
              className="px-4 py-2 sm:px-5 rounded-[6px] bg-primary text-white
            text-h5 poppins-font transition-colors hover:bg-primary-200 dark:bg-dark-accent dark:text-[#16110a] dark:hover:bg-primary-25"
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

    </nav>
  );
}

export default Navbar;
