"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, CalendarDays } from "lucide-react";
import { Badge, Card } from "@/components/ui";

const statusConfig = {
  draft: { label: "Draft", variant: "neutral" },
  generating: { label: "Generating", variant: "accent" },
  ready: { label: "Ready", variant: "primary" },
  in_progress: { label: "In progress", variant: "accent" },
  completed: { label: "Completed", variant: "success" },
};

const formatDate = (date) => {
  if (!date) return "Not studied yet";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

function StudyCard({ study }) {
  const status = statusConfig[study.status] || statusConfig.ready;

  return (
    <Card
      variant="default"
      className="flex h-full flex-col p-0 transition-all duration-175 hover:border-primary hover:shadow-panel"
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-accent-100 text-primary">
              <BookOpen size={20} aria-hidden="true" />
            </div>
            <h2 className="truncate text-h4 font-semibold text-grey-200 poppins-font">
              {study.title}
            </h2>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="space-y-2 text-h6 text-p-text-darker inter-font">
          <p className="line-clamp-1">
            <span className="font-semibold text-grey-200">Subject:</span>{" "}
            {study.subject || "General"}
          </p>
          <p className="line-clamp-1">
            <span className="font-semibold text-grey-200">Topic:</span>{" "}
            {study.topic}
          </p>
          <p className="line-clamp-1">
            <span className="font-semibold text-grey-200">Level:</span>{" "}
            {study.level || "Beginner"}
          </p>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-h6 inter-font">
            <span className="text-p-text">Progress</span>
            <span className="font-semibold text-grey-200">{study.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-off-white-50">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${study.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-h6 text-p-text inter-font">
          <CalendarDays size={14} aria-hidden="true" />
          <span>Last studied {formatDate(study.lastStudiedAt)}</span>
        </div>
      </div>

      <div className="border-t border-grey-25 px-5 py-4">
        <Link
          href={`/studies/${study.id}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2 text-h5 font-medium text-white shadow-btn-primary transition-all duration-175 ease-smooth hover:bg-primary-200"
        >
          Continue
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </Card>
  );
}

export default StudyCard;
