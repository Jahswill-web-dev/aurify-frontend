import Image from "next/image";
import Login from "./_components/login";
import signImage from "../../../public/images/signin-image.svg";
import Navbar from "@/components/navbar/nav";
function LoginPage() {
  return (
    <div>
      <div className="container">
        {/* title */}
        <div className="text-center mb-5">
          <h2 className="text-x-head md:text-l-head text-center text-primary roboto-font font-semibold">
            Welcome Back To Aurify
          </h2>
          <p className="text-p-text-darker font-medium roboto-font">
            Enter your email or sign in with google, facebook or twitter
          </p>
        </div>
        {/* form and illustration */}
        <div className="lg:flex justify-between items-start">
          {/* signup with socials and email */}
          <div>
            <div className="text-center flex flex-col items-center">
              <span className="text-primary font-medium text-[18px] md:text-l-sub-head">
                Log In
              </span>
              <div className="h-[2px] w-[200px] bg-primary"></div>
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
