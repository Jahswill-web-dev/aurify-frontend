"use client";
import { InterLoader, RobotoLoader } from "../fonts/fontloader";
import { RingSpinner } from "@/components/ui/ui";
import check from "../../../public/icons/check.png";
import Image from "next/image";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import failedIcon from "../../../public/icons/failed.png";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

function Form() {
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  // 1. get data using react hook form -done
  // 2. validate data -done
  // 4. add loading effect -done
  // 4. pass data to mailchimp api
  // 5. display success modal

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    // sending code to api...
    await axios
      .post("/api", data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.status);
        if (response.status === 200) {
          setSuccess(true);
          setFailed(false);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error) {
          setSuccess(false);
          setFailed(true);
        }
      });

    reset();
  };

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(false);
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [success]);

  return (
    <div
      className="bg-secondary drop-shadow-lg p-4 max-w-[302px] md:max-w-[652px] min-h-[226px] mx-auto mb-8 mt-[50px] md:mt-[10px] text-center
    relative "
    >
      {/* loading effect */}
      {isSubmitting && (
        <div className="absolute top-0 bottom-0 left-0 right-0 bg-white opacity-50"></div>
      )}

      {isSubmitting && (
        <div className="absolute flex justify-center items-center top-0 bottom-0 left-0 right-0">
          <div className="absolute z-10">
            <RingSpinner />
          </div>
        </div>
      )}
      {/* loading effect */}

      {/* success message */}
      <div
        className={`${
          success ? "flex" : "hidden"
        } flex-col h-[226px] items-center justify-center`}
      >
        <Image
          src={check}
          alt="checkmark"
          width={70}
          height={70}
          className="md:w-24"
        />
        <RobotoLoader>
          <p className="text-[16px] md:text-l-description text-p-text-darker">
            {`Thanks for joining We'll notify you at launch.`} <br />
            {/* P.S-check your email */}
          </p>
        </RobotoLoader>
      </div>
      {/* Failed message */}
      <div
        className={`${
          failed ? "flex" : "hidden"
        } flex-col h-[226px] items-center justify-center`}
      >
        <Image
          src={failedIcon}
          alt="failed to send logo"
          width={70}
          height={70}
          className="md:w-24"
        />
        <RobotoLoader>
          <p className="text-[16px] md:text-l-description text-p-text-darker">
            something went wrong pls try again <br />
            and check your internet
          </p>
          <div
            className="py-2 px-4 text-secondary hover:cursor-pointer 
          inline-block bg-p-text-darker hover:bg-p-text rounded-md"
            onClick={() => setFailed(false)}
          >
            Try again
          </div>
        </RobotoLoader>
      </div>

      <div
        className={`${success || failed ? "hidden" : "flex"} flex-col gap-2`}
      >
        <RobotoLoader>
          <h3 className="text-primary text-x-sub-head md:text-l-sub-head font-semibold">
            Join the wait list
          </h3>
        </RobotoLoader>
        <InterLoader>
          <p className="text-p-text text-x-description md:text-l-description font-semibold">
            get early bird access to our launch and a 20% discount
          </p>
        </InterLoader>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="bg-white h-[38px] w-[258px] mx-auto flex md:justify-between md:gap-1 pl-[6px] ">
            <input
              type="email"
              id="email"
              placeholder="Johndoe@gmail.com"
              className="focus:outline-none"
              {...register("email")}
              disabled={isSubmitting}
            ></input>

            <button
              className="text-[14px] md:text-[20px] text-white cursor-pointer bg-primary p-1 w-24"
              type="submit"
            >
              Join
            </button>
          </div>
          {errors.email && (
            <p className="text-red-600 text-[12px]">{errors.email.message}</p>
          )}
        </form>

        <RobotoLoader>
          <p className="text-p-text text-x-description font-normal">
            Start your journey to increased productivity{" "}
          </p>
        </RobotoLoader>
      </div>
    </div>
  );
}

export default Form;
