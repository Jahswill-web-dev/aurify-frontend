"use client";
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
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/app/lib/aurifyApi";
import { AlertCircle, Lock, Mail, User } from "lucide-react";

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

function InputForm({ type, title, name, id, register, errors, icon: Icon, autoComplete }) {
  const errorMessage = errors?.[name]?.message;
  return (
    <div className="grid gap-2">
      <label
        htmlFor={id}
        className="text-h6 font-semibold uppercase text-grey-100 poppins-font dark:text-dark-muted"
      >
        {title}
      </label>
      <div className="relative">
        {Icon ? (
          <Icon
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-grey-100 dark:text-dark-muted"
          />
        ) : null}
        <input
          {...register}
          type={type}
          id={id}
          autoComplete={autoComplete}
          aria-invalid={Boolean(errorMessage)}
          className={[
            "h-12 w-full rounded-sm border bg-off-white-100 px-4 text-h5 text-grey-200 outline-none transition-all duration-175 ease-smooth placeholder:text-grey-100 focus:border-primary focus:bg-white focus:shadow-input-focus dark:bg-dark-surface-soft dark:text-dark-text dark:placeholder:text-dark-muted dark:focus:border-primary-25 dark:focus:bg-dark-surface dark:focus:shadow-none",
            Icon ? "pl-10" : "",
            errorMessage ? "border-error" : "border-grey-25 dark:border-dark-border",
          ].join(" ")}
        />
      </div>
      {errorMessage ? (
        <p className="flex items-center gap-1 text-h6 text-error inter-font">
          <AlertCircle size={13} aria-hidden="true" />
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}

function CreateAccount() {
  const dispatch = useDispatch();
  const router = useRouter();

  // useEffect(() => {
  //   const handleGoogleCallback = async () => {
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const userId = urlParams.get('userId');
      
  //     if (userId) {
  //       try {
  //         const response = await axios.post(
  //           `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/google/callback`,
  //           { userId }
  //         );
          
  //         const { access_token } = response.data;
  //         Cookies.set("accessToken", access_token, { expires: 7, path: "" });
  //         dispatch(setAccessToken(access_token));
          
  //         Toast.fire({
  //           icon: "success",
  //           title: "Signed in successfully with Google",
  //         });
  //         router.push("/dashboard");
  //       } catch (error) {
  //         console.error("Google callback error:", error);
  //         Toast.fire({
  //           icon: "error",
  //           title: "Failed to sign in with Google",
  //         });
  //       }
  //     }
  //   };

  //   handleGoogleCallback();
  // }, [dispatch, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    await axios
      .post(`${API_BASE_URL}/signup`, data)
      .then(async (response) => {
        console.log(response);

        const { access_token, refresh_token } = response.data;
        Cookies.set("accessToken", access_token, { expires: 7, path: "/" });
        if (refresh_token) {
          Cookies.set("refreshToken", refresh_token, { expires: 7, path: "/" });
        }
        dispatch(setAccessToken(access_token));
        await axios.get(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        Toast.fire({
          icon: "success",
          title: "Signed in successfully",
        });
        router.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        const status = error.response?.status;
        console.log(status || error.message);
        if (status === 450) {
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
    <div className="relative">
      <div className="relative">
        {isSubmitting && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center rounded-md bg-white/70 backdrop-blur-[1px] dark:bg-dark-surface/70"
            aria-live="polite"
          >
            <RingSpinner />
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-5"
        >
          <InputForm
            type="text"
            name="username"
            title="Username"
            id="user-name"
            register={register("username")}
            errors={errors}
            icon={User}
            autoComplete="username"
          />

          <InputForm
            type="email"
            name="email"
            title="Email"
            id="email"
            register={register("email")}
            errors={errors}
            icon={Mail}
            autoComplete="email"
          />

          <InputForm
            type="password"
            name="password"
            title="Password"
            id="password"
            register={register("password")}
            errors={errors}
            icon={Lock}
            autoComplete="new-password"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-sm bg-primary px-5 text-h5 font-semibold text-white shadow-btn-primary transition-all duration-175 ease-smooth hover:bg-primary-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-dark-accent dark:text-[#16110a] dark:shadow-none dark:hover:bg-primary-25"
          >
            Create account
          </button>
        </form>
      </div>

      <div className="mt-6 border-t border-grey-25 pt-5 text-center dark:border-dark-border">
        <p className="text-h5 text-p-text-darker inter-font dark:text-dark-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-200 hover:underline dark:text-primary-25"
          >
            Log in
          </Link>
        </p>
      </div>

      {/* Google signup is intentionally hidden while backend OAuth is paused.
      <div className="mt-5">
        <button type="button">Continue with Google</button>
      </div>
      */}

      <p className="mt-5 text-center text-h6 leading-5 text-grey-100 inter-font dark:text-dark-muted">
        Passwords must be 5 to 24 characters.
      </p>
    </div>
  );
}

export default CreateAccount;
