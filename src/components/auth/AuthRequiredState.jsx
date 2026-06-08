"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

function AuthRequiredState({
  title = "Log in to continue",
  message = "Your session is missing or has expired. Log in to keep working in Aurify.",
  returnTo,
  secondaryHref = "/",
  secondaryLabel = "Back to Home",
}) {
  const pathname = usePathname();
  const nextPath = returnTo || pathname || "/";
  const loginHref = `/login?next=${encodeURIComponent(nextPath)}`;

  return (
    <main className="min-h-screen bg-off-white-100 px-4 py-8 dark:bg-dark-bg sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[920px] justify-end">
        <ThemeToggle />
      </div>

      <section className="mx-auto mt-12 flex max-w-[640px] flex-col items-center rounded-md border border-grey-25 bg-white px-5 py-10 text-center shadow-panel dark:border-dark-border dark:bg-dark-surface dark:shadow-none sm:px-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-sm bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
          <LockKeyhole size={24} aria-hidden="true" />
        </div>
        <h1 className="text-h2 font-bold leading-tight text-grey-200 poppins-font dark:text-dark-text">
          {title}
        </h1>
        <p className="mt-3 max-w-[460px] text-h5 leading-7 text-p-text-darker inter-font dark:text-dark-muted">
          {message}
        </p>
        <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href={loginHref}
            className="inline-flex items-center justify-center rounded-sm bg-primary px-5 py-3 text-h5 font-semibold text-white shadow-btn-primary transition-colors hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-dark-accent dark:text-[#16110a] dark:shadow-none dark:hover:bg-primary-25 dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg"
          >
            Log In
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center rounded-sm border border-grey-25 bg-white px-5 py-3 text-h5 font-semibold text-p-text-darker transition-colors hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-dark-border dark:bg-dark-surface-soft dark:text-dark-text dark:hover:border-primary-25 dark:hover:text-primary-25 dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg"
          >
            {secondaryLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default AuthRequiredState;
