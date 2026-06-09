import Link from "next/link";
import { AlertCircle, ArrowRight, Plus } from "lucide-react";
import StudiesGrid from "@/app/studies/_components/StudiesGrid";
import { Button, Card, LoadingExperience } from "@/components/ui";

export const RecentStudies = ({ studies = [], loading, error, onRetry }) => {
  const recentStudies = [...studies]
    .sort(
      (first, second) =>
        new Date(second.updated_at || second.created_at || 0) -
        new Date(first.updated_at || first.created_at || 0)
    )
    .slice(0, 3);

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-h2 font-bold text-grey-200 poppins-font">
            Recent Studies
          </h2>
          <p className="mt-1 max-w-[560px] text-h5 text-p-text-darker inter-font">
            Continue a focused learning workspace or create a new one from a
            topic.
          </p>
        </div>

        <Link
          href="/studies"
          className="inline-flex items-center gap-2 text-h5 font-semibold text-primary transition-colors hover:text-primary-200 dark:text-primary-25 dark:hover:text-dark-accent"
        >
          View all studies
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {loading ? (
        <LoadingExperience
          variant="compact"
          title="Loading recent Studies"
          message="Finding your latest workspaces."
        />
      ) : error ? (
        <Card variant="default" className="p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-error" aria-hidden="true" />
          <h3 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
            Recent Studies could not load
          </h3>
          <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
            {error}
          </p>
          <Button variant="primary" size="md" onClick={onRetry} className="mt-5">
            Retry
          </Button>
        </Card>
      ) : recentStudies.length ? (
        <StudiesGrid studies={recentStudies} />
      ) : (
        <Card variant="default" className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
            <Plus size={22} aria-hidden="true" />
          </div>
          <h3 className="text-h3 font-semibold text-grey-200 poppins-font">
            No Studies yet
          </h3>
          <p className="mx-auto mt-2 max-w-[460px] text-h5 leading-7 text-p-text-darker inter-font">
            Create a Study to generate material, practice questions, exam mode,
            and progress analytics.
          </p>
          <Link
            href="/studies/new"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2 text-h5 font-medium text-white shadow-btn-primary transition-colors hover:bg-primary-200 dark:bg-dark-accent dark:text-[#16110a] dark:shadow-none dark:hover:bg-primary-25"
          >
            <Plus size={16} aria-hidden="true" />
            Create Study
          </Link>
        </Card>
      )}
    </section>
  );
};
