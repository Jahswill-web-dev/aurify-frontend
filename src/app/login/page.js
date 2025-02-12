import Image from "next/image";
import Login from "./_components/login";
import signImage from "../../../public/images/signin-image.svg";
import logo from "../../../public/icons/aurify-new-logo.png";
import Link from "next/link";
function LoginPage() {
  return (
    <div>
      <div className="container">
        {/* logo */}
        <Link href="/">
          <div className="text-center mb-5 mt-5 flex justify-center">
            <Image width={200} height={200} src={logo} alt="Aurify AI logo" />
          </div>
        </Link>
        {/* form and illustration */}
        <div className="lg:flex justify-between items-start">
          {/* signup with socials and email */}
          <div>
            <div className="w-[400px] mx-auto md:pl-0 pl-16 text-left flex flex-col items-start">
              <span className="text-primary font-medium text-[18px] md:text-l-sub-head">
                Log In
              </span>
              <div className="h-[2px] w-[50px] bg-primary"></div>
            </div>
            <Login />
          </div>
          {/* image/illustration */}
          <div className="hidden lg:flex">
            <Image
              src={signImage}
              alt="sign in illustration"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
