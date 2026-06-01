import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getStudies } from "@/data/mockStudies";
import StudiesGrid from "@/app/studies/_components/StudiesGrid";

export const RecentStudies = () => {
  const studies = getStudies().slice(0, 3);

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
          className="inline-flex items-center gap-2 text-h5 font-semibold text-primary transition-colors hover:text-primary-200"
        >
          View all studies
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <StudiesGrid studies={studies} />
    </section>
  );
};
