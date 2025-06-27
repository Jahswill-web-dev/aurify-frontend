"use client";
import Image from "next/image";
import googleIcon from "../../../../public/icons/google-icon.svg";
import chevron from "../../../../public/icons/chevron-right.svg";
import facebookIcon from "../../../../public/icons/facebook-icon.svg";
import xIcon from "../../../../public/icons/x-icon.svg";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { RingSpinner } from "@/components/ui/ui";
import Swal from "sweetalert2";
import Link from "next/link";
import { setAccessToken } from "@/app/lib/features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";
import Cookies from "js-cookie";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const schema = yup.object().shape({
  username: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Password must be at least 5 characters long")
    .max(24, "Password cannot be more than 24 characters long"),
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
        className="focus:border-primary rounded-sm border-p-text-darker w-64 md:w-[400px] h-[35px] text-x-sub-head border-2
              p-2"
      ></input>
      <p className="text-red-600 m-0 p-0 text-left text-xs">{errorMessage}</p>
    </div>
  );
}

function SocialSignIn({ name, logo, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="cursor-pointer text-p-text-darker flex justify-around items-center bg-off-white-100 border border-2 w-[300px] py-2 rounded-md hover:bg-gray-100 transition-colors">
      <Image src={logo} width={30} height={30} alt="google icon" />
      <div>{name}</div>
      <Image src={chevron} alt="chevron right" width={30} height={30} />
    </div>
  );
}

function CreateAccount() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, error, loading } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/me`
  );

  useEffect(() => {
    if (data) {
      // console.log(data);
    }
    if (data?.status === 200) {
      router.push("/dashboard");
    }
  }, [router, data]);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      
      if (userId) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/google/callback`,
            { userId }
          );
          
          const { access_token } = response.data;
          Cookies.set("accessToken", access_token, { expires: 7, path: "" });
          dispatch(setAccessToken(access_token));
          
          Toast.fire({
            icon: "success",
            title: "Signed in successfully with Google",
          });
          router.push("/dashboard");
        } catch (error) {
          console.error("Google callback error:", error);
          Toast.fire({
            icon: "error",
            title: "Failed to sign in with Google",
          });
        }
      }
    };

    handleGoogleCallback();
  }, [dispatch, router]);

  const handleGoogleSignup = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/google/signup`
      );
      console.log(response);
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Google signup error:", error);
      Toast.fire({
        icon: "error",
        title: "Failed to initiate Google signup",
      });
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/signup`, data)
      .then((response) => {
        console.log(response);

        const { access_token } = response.data;
        Cookies.set("accessToken", access_token, {expires: 7, path:""});
        dispatch(setAccessToken(access_token));

        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });
        router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response.status);
        if (error.response.status === 450) {
          Toast.fire({
            icon: "error",
            title: "User with Email already exists!",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "Failed to create account try again",
          });
        }
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
            <div className="bg-white opacity-50 absolute h-full w-72 md:w-[408px]"></div>
            <div className="absolute z-20">
              <RingSpinner />
            </div>
          </div>
        )}

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
              register={register("username")}
              errors={errors}
            />

            <InputForm
              type="email"
              name="email"
              title="Email"
              id="email"
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
            className="my-4 bg-primary text-white py-2 px-6 rounded-md font-semibold roboto-font
          lg:text-xl lg:font-semibold lg:my-6 w-[256px] hover:bg-[#f19d37] 
          active:scale-95"
          >
            Create account
          </button>
        </form>
      </div>
      <p className="text-center">
        Already have an account?{" "}
        <Link href="/login">
          <span className="text-primary underline">Log In</span>
        </Link>
      </p>
      {/*  */}
      <div className="flex items-center gap-2 w-full justify-center">
        <div className="w-[200px] h-[2px] bg-p-text-darker"></div>
        <p className="text-p-text text-xl text-center pb-3">or</p>
        <div className="w-[200px] h-[2px] bg-p-text-darker"></div>
      </div>

      <div className="flex flex-col gap-5 items-center justify-center">
        <SocialSignIn 
          name="Sign in with Google" 
          logo={googleIcon} 
          onClick={handleGoogleSignup}
        />
        {/* <SocialSignIn name="Sign in Facebook" logo={facebookIcon} /> */}
        {/* <SocialSignIn name="Sign in Twitter" logo={xIcon} /> */}
      </div>
    </div>
  );
}

export default CreateAccount;
