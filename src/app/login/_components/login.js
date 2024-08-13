"use client";
import Image from "next/image";
import googleIcon from "../../../../public/icons/google-icon.svg";
import chevron from "../../../../public/icons/chevron-right.svg";
import facebookIcon from "../../../../public/icons/facebook-icon.svg";
import xIcon from "../../../../public/icons/x-icon.svg";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { RingSpinner } from "@/components/ui/ui";
import Swal from 'sweetalert2'


const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

const schema = yup.object().shape({
  // name: yup.string().required("Name is required"),
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
      <p className="text-red-600 m-0 p-0 text-left text-xs">{errorMessage}</p>
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

function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    console.log(data)
    await axios
      .post("https://reqres.in/api/users", data)
      .then((response) => {
        console.log(response);
        console.log('Token:', response.data.token);
        Toast.fire({
          icon: "success",
          title: "Login in successfull"
        });
        router.push("/dashboard")
      })
      .catch((error) => {
        console.log(error);
        Toast.fire({
          icon: "error",
          title: "Login in Failed"
        });
      });

    // console.log(data);
  };

  return (
    <div>
      <div className="relative">
        {isSubmitting && (
          <div
            className="absolute h-full w-full flex items-center
        justify-center"
          >
            <div className="bg-white opacity-50 absolute h-full w-full"></div>
            <div className="absolute z-20">
              <RingSpinner />
            </div>
          </div>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate className="flex flex-col items-center justify-center"
        >
          <div className="flex flex-col items-center justify-center gap-4 mt-4">
            <InputForm
              type="email"
              name="email"
              title="Email"
              id="user-name"
              register={register("email")}
              errors={errors}
            />
            <InputForm
              type="password"
              name="password"
              title="Password"
              id="password"
              register={register("password")}
              errors={errors}
            />
          </div>

          <button
            type="submit"
            className="text-xl font-bold my-4 bg-primary text-white py-2 px-6 rounded-md roboto-font
          lg:text-xl lg:font-semibold lg:my-6 w-[256px]"
          >
            Login
          </button>
        </form>
      </div>
      <div className="flex items-center gap-2 w-full justify-center">
        <div className="w-[200px] h-[2px] bg-p-text-darker"></div>
        <p className="text-p-text text-xl text-center pb-3">or</p>
        <div className="w-[200px] h-[2px] bg-p-text-darker"></div>
      </div>

      <div className="flex flex-col gap-5 items-center justify-center">
        <SocialSignIn name="LogIn in with Google" logo={googleIcon} />
        <SocialSignIn name="LogIn in Facebook" logo={facebookIcon} />
        <SocialSignIn name="LogIn in Twitter" logo={xIcon} />
      </div>
      <p className="text-center my-7">
        dont have an account?{" "}
        <Link href="/signup">
        <span className="text-primary underline">Signup</span>
        </Link>
      </p>
    </div>
  );
}

export default Login;
