"use client";
import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Dashboard } from "./_components/dashboard";
import { ScoresResults } from "./_components/scoresResults";
import { Sidebar } from "./_components/sideNav";
import AuthRequiredState from "@/components/auth/AuthRequiredState";
import { Button, Card } from "@/components/ui";
import {
  getCurrentUser,
  getUserFacingError,
  hasAccessToken,
  isAuthError,
  listStudies,
} from "@/app/lib/aurifyApi";

function App() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showSummaryDetail, setShowSummaryDetail] = useState(false);
  const [user, setUser] = useState(null);
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authRequired, setAuthRequired] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    setAuthRequired(false);

    if (!hasAccessToken()) {
      setUser(null);
      setStudies([]);
      setAuthRequired(true);
      setLoading(false);
      return;
    }

    try {
      const [nextUser, nextStudies] = await Promise.all([
        getCurrentUser(),
        listStudies(),
      ]);
      setUser(nextUser);
      setStudies(Array.isArray(nextStudies) ? nextStudies : []);
    } catch (err) {
      if (isAuthError(err)) {
        setUser(null);
        setStudies([]);
        setAuthRequired(true);
      } else {
        console.error("Could not load dashboard", err);
        setError(
          getUserFacingError(err, "Could not load your dashboard. Please try again.")
        );
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsCollapsed(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <Dashboard
            onViewSummary={() => setShowSummaryDetail(true)}
            onCreateStudy={() => router.push("/studies/new")}
            user={user}
            studies={studies}
            loading={loading}
            error={error}
            onRetry={loadDashboard}
          />
        );
      case "scores":
        return (
          <ScoresResults
            studies={studies}
            loading={loading}
            error={error}
            onRetry={loadDashboard}
          />
        );
      default:
        return (
          <Dashboard
            onViewSummary={() => setShowSummaryDetail(true)}
            onCreateStudy={() => router.push("/studies/new")}
            user={user}
            studies={studies}
            loading={loading}
            error={error}
            onRetry={loadDashboard}
          />
        );
    }
  };

  if (authRequired) {
    return (
      <AuthRequiredState
        title="Log in to view your dashboard"
        message="Your dashboard is built from your private Studies, scores, and account details."
        secondaryHref="/"
        secondaryLabel="Back to Home"
      />
    );
  }

  if (showSummaryDetail) {
    return renderMainContent();
  }

  return (
    <>
      <div className="min-h-screen bg-off-white-100 flex dark:bg-dark-bg">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onCreateStudy={() => router.push("/studies/new")}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <div
          className={`min-w-0 flex-1 overflow-hidden transition-all duration-300 ${
            isCollapsed ? "ml-16" : "ml-64 sm:ml-72"
          }`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full min-h-screen sm:min-h-0"
            >
              {error && !loading ? (
                <div className="p-4 sm:p-6 lg:p-8">
                  <Card variant="default" className="mx-auto max-w-[680px] p-6 text-center">
                    <AlertCircle className="mx-auto h-8 w-8 text-error" aria-hidden="true" />
                    <h1 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
                      Dashboard could not load
                    </h1>
                    <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
                      {error}
                    </p>
                    <Button variant="primary" size="md" onClick={loadDashboard} className="mt-5">
                      Retry
                    </Button>
                  </Card>
                </div>
              ) : (
                renderMainContent()
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </>
  );
}

export default App;
