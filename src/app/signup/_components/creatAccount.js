"use client";
import Image from "next/image";
import googleIcon from "../../../../public/icons/google-icon.svg";
import chevron from "../../../../public/icons/chevron-right.svg";
import facebookIcon from "../../../../public/icons/facebook-icon.svg";
import xIcon from "../../../../public/icons/x-icon.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password cannot be more than 20 characters long"),
});

function InputForm({ type, title, name, id, register, errors }) {
  const errorMessage = errors?.[name]?.message;
  return (
    <div>
      <p className="text-p-text-darker pb-2 text-lg">{title}</p>
      <input
        {...register}
        type={type}
        id={id}
        placeholder=""
        className="focus:border-primary border-p-text-darker w-64 md:w-[400px] h-[35px] text-x-sub-head border-2
              p-2"
      ></input>
      <p className="text-red-600 m-0 p-0 text-left">{errorMessage}</p>
    </div>
  );
}
function SocialSignIn({ name, logo }) {
  return (
    <div className="text-p-text-darker flex justify-around items-center bg-white w-[300px] py-2 rounded-md">
      <Image src={logo} width={30} height={30} alt="google icon" />
      <div>{name}</div>
      <Image src={chevron} alt="chevron right" width={30} height={30} />
    </div>
  );
}



function CreateAccount() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

const onSubmit = async (data) => {
 await axios.post("https://reqres.in/api/users", data)
  .then((response)=>{
    console.log(response);
    console.log("data sent successfully")
  })
  .catch((error)=>{
    console.log(error)
  })
  
  // console.log(data);
};


  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col items-center"
      >
        <div className="flex flex-col items-center justify-center gap-4 mt-4">
          <InputForm
            type="text"
            name="name"
            title="User name"
            id="user-name"
            register={register("name")}
            errors={errors}
          />
          {/* {errors.name && (
            <p className="text-red-600 m-0 p-0 text-left">
              {errors.name.message}
            </p>
          )} */}
          <InputForm
            type="email"
            name="email"
            title="Email"
            id="email"
            register={register("email")}
            errors={errors}
          />
          {/* {errors.email && (
            <p className="text-red-600">{errors.email.message}</p>
          )} */}
          <InputForm
            type="password"
            name="password"
            title="Password"
            id="password"
            register={register("password")}
            errors={errors}
          />
          {/* {errors.password && (
            <p className="text-red-600">{errors.password.message}</p>
          )} */}
        </div>

        <button
          type="submit"
          className="my-4 bg-primary text-white py-2 px-6 rounded-md font-semibold roboto-font
          lg:text-xl lg:font-semibold lg:my-6 w-[256px]"
        >
          Create account
        </button>
        {isSubmitting && <p className="text-xl text-primary">Loading...</p>}
      </form>
      {/*  */}
      <div className="flex items-center gap-2 w-full justify-center">
        <div className="w-[200px] h-[2px] bg-p-text-darker"></div>
        <p className="text-p-text text-xl text-center pb-3">or</p>
        <div className="w-[200px] h-[2px] bg-p-text-darker"></div>
      </div>

      <div className="flex flex-col gap-5 items-center justify-center">
        <SocialSignIn name="Sign in with Google" logo={googleIcon} />
        <SocialSignIn name="Sign in Facebook" logo={facebookIcon} />
        <SocialSignIn name="Sign in Twitter" logo={xIcon} />
      </div>
      <p className="text-center my-7">
        Already have an account?{" "}
        <span className="text-primary underline">Log In</span>
      </p>
    </div>
  );
}

export default CreateAccount;
