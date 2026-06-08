"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/app/lib/aurifyApi";

const getSafeReturnPath = () => {
  const storedPath = localStorage.getItem("authReturnTo");

  if (
    !storedPath ||
    !storedPath.startsWith("/") ||
    storedPath.startsWith("//") ||
    storedPath.startsWith("/login") ||
    storedPath.startsWith("/signup")
  ) {
    return "/dashboard";
  }

  return storedPath;
};

export default function GoogleCallback() {
  const authMode = useSelector((store) => store.auth.authMode);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get access_token from URL hash if present, else from search params
    let accessToken = searchParams.get("access_token");

    if (!accessToken && typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      accessToken = params.get("access_token");
    }
    if (!accessToken) return;

    const completeLogin = async () => {
      //   if (!authMode) {
      //     console.error("authMode is not set");
      //     return;
      //   }

      try {
        // Attempt sign in first
        const mode = localStorage.getItem("authMode");
        console.log(accessToken);
        // console.log(authMode)
        const endpoint =
          mode === "signup"
            ? `${API_BASE_URL}/google/signup?access_token=${accessToken}`
            : `${API_BASE_URL}/google/signin?access_token=${accessToken}`;
        const signinRes = await axios.get(endpoint);
        // Save tokens
        console.log(signinRes);
        Cookies.set("accessToken", signinRes.data.access_token, {
          expires: 7,
          path: "/",
        });
        if (signinRes.data.refresh_token) {
          Cookies.set("refreshToken", signinRes.data.refresh_token, {
            expires: 7,
            path: "/",
          });
        }
        const returnPath = getSafeReturnPath();
        localStorage.removeItem("authReturnTo");
        // const token = Cookies.get("accessToken");
        setTimeout(() => {
          router.push(returnPath);
        }, 3000);
      } catch (err) {
        if (err.response?.status === 451) {
          // User doesn't exist, so sign up
          const signupRes = await axios.get(
            `${API_BASE_URL}/google/signup?access_token=${accessToken}`
          );

          Cookies.set("accessToken", signupRes.data.access_token, {
            expires: 7,
            path: "/",
          });
          if (signupRes.data.refresh_token) {
            Cookies.set("refreshToken", signupRes.data.refresh_token, {
              expires: 7,
              path: "/",
            });
          }

          const returnPath = getSafeReturnPath();
          localStorage.removeItem("authReturnTo");
          router.push(returnPath);
        } else {
          console.error("Login/signup failed:", err);
        }
      }
    };

    completeLogin();
  }, [authMode, searchParams, router]);

  return <p className="text-center mt-10">Signing you in...</p>;
}
