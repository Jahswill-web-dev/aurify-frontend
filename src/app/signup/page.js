import Image from "next/image";
import CreateAccount from "./_components/creatAccount";
import signImage from "../../../public/images/signin-image.svg";
import logo from "../../../public/icons/aurify-new-logo.png";
import Link from "next/link";

function SignUpPage() {
  // Todo: ask chatgpt how to practice connecting to backend
  return (
    <div>
      <div className="container">
        {/* Logo */}
        <Link href="/">
          <div className="text-center mb-5 mt-5 flex justify-center">
            <Image width={200} height={200} src={logo} alt="Aurify AI logo" />
          </div>
        </Link>
        {/* form and illustration */}
        <div className="lg:flex justify-between items-start">
          {/* signup with socials and email */}
          <div>
            <div className="w-[400px] mx-auto pl-16 md:pl-0 text-center flex flex-col items-start">
              <span className="text-primary font-medium text-[18px] md:text-l-sub-head">
                Create an account
              </span>
              <div className="h-[2px] w-[70px] bg-primary"></div>
            </div>
            <CreateAccount />
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

export default SignUpPage;
