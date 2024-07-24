import Image from "next/image";
import googleIcon from "../../../../public/icons/google-icon.svg";
import chevron from "../../../../public/icons/chevron-right.svg";
import facebookIcon from "../../../../public/icons/facebook-icon.svg";
import xIcon from "../../../../public/icons/x-icon.svg";

function CreateAccount() {
  return (
    <div>
      <form className="flex flex-col items-center">
        <div className="flex flex-col items-center justify-center gap-4 mt-4">
          <div>
            <p className="text-p-text-darker pb-2 text-lg">User Name</p>
            <input
              type="email"
              id="email"
              placeholder="Johndoe@gmail.com"
              className="focus:border-primary border-p-text-darker w-64 md:w-[400px] h-[35px] text-x-sub-head border-2"
            ></input>
          </div>
          <div>
            <p className="text-p-text-darker pb-2 text-lg">Email</p>
            <input
              type="password"
              id="password"
              placeholder=""
              className="focus:border-primary border-p-text-darker w-64 md:w-[400px] h-[35px] text-x-sub-head border-2"
            ></input>
          </div>
          <div>
            <p className="text-p-text-darker pb-2 text-lg">Password</p>
            <input
              type="password"
              id="confirm password"
              placeholder=""
              className="focus:border-primary border-p-text-darker w-64 md:w-[400px] h-[35px] text-x-sub-head border-2"
            ></input>
          </div>
        </div>

        <button
          type="submit"
          className="my-4 bg-primary text-white py-2 px-6 rounded-md roboto-font
          lg:text-xl lg:font-semibold lg:my-6"
        >
          Create account
        </button>
      </form>
      <div className="flex items-center gap-2 w-full justify-center">
        <div className="w-[200px] h-[2px] bg-p-text-darker"></div>
        <p className="text-p-text text-xl text-center pb-3">or</p>
        <div className="w-[200px] h-[2px] bg-p-text-darker"></div>
      </div>

      <div className="flex flex-col gap-5 items-center justify-center">
        <div className="text-p-text-darker flex justify-around items-center bg-white w-[300px] py-2 rounded-md">
          <Image src={googleIcon} width={30} height={30} alt="google icon" />
          <div>Sign in with Google</div>
          <Image src={chevron} alt="chevron right" width={30} height={30} />
        </div>
        <div className="text-p-text-darker flex justify-around items-center bg-white w-[300px] py-2 rounded-md">
          <Image src={facebookIcon} width={30} height={30} alt="google icon" />
          <div>Sign in Facebook</div>
          <Image src={chevron} alt="chevron right" width={30} height={30} />
        </div>
        <div className="text-p-text-darker flex justify-around items-center bg-white w-[300px] py-2 rounded-md">
          <Image src={xIcon} width={30} height={30} alt="google icon" />
          <div>Sign in Twitter</div>
          <Image src={chevron} alt="chevron right" width={30} height={30} />
        </div>
      </div>
      <p className="text-center my-7">
        Already have an account?{" "}
        <span className="text-primary underline">Log In</span>
      </p>
    </div>
  );
}

export default CreateAccount;
