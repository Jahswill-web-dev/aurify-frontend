import Link from "next/link";
import logo from "../../../public/icons/aurify-logo.svg";
import Image from "next/image";
function Navbar() {
  return (
    <nav className="container flex justify-between items-center my-5">
      {/* Logo */}
      <div>
        <Link href="/">
          <Image
            className="mx-auto mt-2"
            src={logo}
            alt="aurify logo"
            width={100}
            height={100}
          />
        </Link>
      </div>
      {/* Links */}
      <div>
        <Link
          href="/blog"
          className="text-p-text-darker roboto-font text-x-sub-head hover:text-p-text"
        >
          Blog
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
