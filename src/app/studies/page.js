"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, LayoutDashboard, Plus } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import EmptyStudiesState from "./_components/EmptyStudiesState";
import StudiesGrid from "./_components/StudiesGrid";
import { Button, Card } from "@/components/ui";
import AuthRequiredState from "@/components/auth/AuthRequiredState";
import { hasAccessToken, isAuthError, listStudies } from "@/app/lib/aurifyApi";

export default function StudiesPage() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);

  const fetchStudies = useCallback(async () => {
    setLoading(true);
    setError("");
    setAuthRequired(false);

    if (!hasAccessToken()) {
      setStudies([]);
      setAuthRequired(true);
      setLoading(false);
      return;
    }

    try {
      const data = await listStudies();
      setStudies(Array.isArray(data) ? data : []);
    } catch (err) {
      if (isAuthError(err)) {
        setStudies([]);
        setAuthRequired(true);
      } else {
        setError(err.message || "Could not load your Studies. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  if (authRequired) {
    return (
      <AuthRequiredState
        title="Log in to view your Studies"
        message="Your Studies are private to your account. Log in to continue where you left off."
        secondaryHref="/"
        secondaryLabel="Back to Home"
      />
    );
  }

  return (
    <main className="min-h-screen bg-off-white-100 px-4 py-8 sm:px-6 lg:px-10 dark:bg-dark-bg">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 flex justify-end gap-2">
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-sm border border-grey-25 bg-white px-3 py-2 text-h6 font-medium text-p-text-darker shadow-card transition-colors hover:border-primary hover:text-primary dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:shadow-none dark:hover:border-primary-25 dark:hover:text-primary-25"
          >
            <LayoutDashboard size={16} aria-hidden="true" />
            Dashboard
          </Link>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl-head font-bold leading-tight text-grey-200 poppins-font">
              Your Studies
            </h1>
            <p className="mt-2 max-w-[620px] text-h5 leading-7 text-p-text-darker inter-font">
              Each Study is a dedicated learning workspace with generated
              material, practice questions, exam mode, and progress analytics.
            </p>
          </div>

          <Link
            href="/studies/new"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-h5 font-semibold text-white shadow-btn-primary transition-all duration-175 hover:bg-primary-200 dark:bg-dark-accent dark:text-[#16110a] dark:shadow-none dark:hover:bg-primary-25"
          >
            <Plus size={18} aria-hidden="true" />
            Create New Study
          </Link>
        </div>

        {loading ? (
          <Card variant="default" className="p-8 text-center">
            <p className="text-h4 font-semibold text-grey-200 poppins-font">
              Loading Studies...
            </p>
          </Card>
        ) : error ? (
          <Card variant="default" className="mx-auto max-w-[640px] p-6 text-center">
            <AlertCircle className="mx-auto h-8 w-8 text-error" aria-hidden="true" />
            <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
              Studies could not load
            </h2>
            <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
              {error}
            </p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="primary" size="md" onClick={fetchStudies}>
                Retry
              </Button>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-sm border border-primary px-4 py-2 text-h5 font-medium text-primary transition-colors hover:bg-accent-25 dark:border-primary-25 dark:text-primary-25 dark:hover:bg-dark-surface-soft"
              >
                Log in
              </Link>
            </div>
          </Card>
        ) : studies.length ? (
          <StudiesGrid studies={studies} />
        ) : (
          <EmptyStudiesState />
        )}
      </div>
    </main>
  );
}
