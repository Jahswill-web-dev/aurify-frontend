import Link from "next/link";
import { LayoutDashboard, Plus } from "lucide-react";
import { getStudies } from "@/data/mockStudies";
import EmptyStudiesState from "./_components/EmptyStudiesState";
import StudiesGrid from "./_components/StudiesGrid";

export default function StudiesPage() {
  const studies = getStudies();

  return (
    <main className="min-h-screen bg-off-white-100 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 flex justify-end">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-sm border border-grey-25 bg-white px-3 py-2 text-h6 font-medium text-p-text-darker shadow-card transition-colors hover:border-primary hover:text-primary"
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
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-sm bg-primary px-4 py-3 text-h5 font-semibold text-white shadow-btn-primary transition-all duration-175 hover:bg-primary-200"
          >
            <Plus size={18} aria-hidden="true" />
            Create New Study
          </Link>
        </div>

        {studies.length ? <StudiesGrid studies={studies} /> : <EmptyStudiesState />}
      </div>
    </main>
  );
}
