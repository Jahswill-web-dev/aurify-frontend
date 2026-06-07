"use client";

import Link from "next/link";
import { BookOpen, Plus } from "lucide-react";

function EmptyStudiesState() {
  return (
    <div className="rounded-md border border-dashed border-grey-25 bg-white px-6 py-12 text-center shadow-card">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-accent-100 text-primary">
        <BookOpen size={24} aria-hidden="true" />
      </div>
      <h2 className="text-h3 font-semibold text-grey-200 poppins-font">
        No studies yet
      </h2>
      <p className="mx-auto mt-2 max-w-[420px] text-h5 leading-7 text-p-text inter-font">
        Create a focused learning workspace for one topic, then study material,
        practice, exams, and progress in one place.
      </p>
      <Link
        href="/studies/new"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2 text-h5 font-medium text-white shadow-btn-primary transition-all duration-175 hover:bg-primary-200"
      >
        <Plus size={16} aria-hidden="true" />
        Create New Study
      </Link>
    </div>
  );
}

export default EmptyStudiesState;
