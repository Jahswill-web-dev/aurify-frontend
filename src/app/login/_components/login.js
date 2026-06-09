"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Cookies from "js-cookie";
import axios from "axios";
import { RingSpinner } from "@/components/ui/ui";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setAccessToken } from "@/app/lib/features/auth/authSlice";
import { API_BASE_URL } from "@/app/lib/aurifyApi";
import { useEffect, useState } from "react";
import { AlertCircle, Lock, Mail } from "lucide-react";
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
  email: yup.string().required("Email or username is required"),
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

const getSafeNextPath = (value) => {
  if (!value || typeof value !== "string") return "/dashboard";
  if (!value.startsWith("/") || value.startsWith("//")) return "/dashboard";
  if (value.startsWith("/login") || value.startsWith("/signup")) {
    return "/dashboard";
  }
  return value;
};

function Login() {
  const router = useRouter();
  const [nextPath, setNextPath] = useState("/dashboard");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNextPath(getSafeNextPath(params.get("next")));
  }, []);

  const onSubmit = async (data) => {
    // console.log(data);

    await axios
      .post(`${API_BASE_URL}/login`, data)
      .then(async (response) => {
        // console.log(response);

        const { access_token, refresh_token } = response.data;
        // console.log(access_token);
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
          title: "Login in successfull",
        });
        localStorage.removeItem("authReturnTo");
        router.push(nextPath);
      })
      .catch((error) => {
        const status = error.response?.status;
        console.log(status || error.message);
        if (status === 400 || status === 451) {
          Toast.fire({
            icon: "error",
            title: "Incorrect Email or Password",
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "Login in Failed try again",
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
            name="email"
            title="Email or username"
            id="email"
            register={register("email")}
            errors={errors}
            icon={Mail}
            autoComplete="username"
          />
          <InputForm
            type="password"
            name="password"
            title="Password"
            id="password"
            register={register("password")}
            errors={errors}
            icon={Lock}
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-sm bg-primary px-5 text-h5 font-semibold text-white shadow-btn-primary transition-all duration-175 ease-smooth hover:bg-primary-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-dark-accent dark:text-[#16110a] dark:shadow-none dark:hover:bg-primary-25"
          >
            Log in
          </button>
        </form>
      </div>

      <div className="mt-6 border-t border-grey-25 pt-5 text-center dark:border-dark-border">
        <p className="text-h5 text-p-text-darker inter-font dark:text-dark-muted">
          {"Don't have an account? "}
          <Link
            href="/signup"
            className="font-semibold text-primary underline-offset-4 transition-colors hover:text-primary-200 hover:underline dark:text-primary-25"
          >
            Create one
          </Link>
        </p>
      </div>

      {/* Google login is intentionally hidden while backend OAuth is paused.
      <div className="mt-5">
        <button type="button">Continue with Google</button>
      </div>
      */}

      <p className="mt-5 text-center text-h6 leading-5 text-grey-100 inter-font dark:text-dark-muted">
        Protected Studies require your Aurify account token.
      </p>
    </div>
  );
}

export default Login;
