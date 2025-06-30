"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, BookOpen } from "lucide-react";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";
import Link from "next/link";

const summariess = [
  {
    id: 1,
    title: "Calculus Fundamentals",
    subject: "Mathematics",
    date: "2023-08-15",
    pages: 12,
    status: "completed",
  },
  {
    id: 2,
    title: "Cell Biology Overview",
    subject: "Biology",
    date: "2023-08-10",
    pages: 8,
    status: "in-progress",
  },
  {
    id: 3,
    title: "WWII Timeline",
    subject: "History",
    date: "2023-08-05",
    pages: 15,
    status: "completed",
  },
];

export const MySummaries = () => {
  const [summaries, setSummaries] = useState([]);

  const { data, error, loading } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/audiobooks`
  );
  useEffect(() => {
    if (data && !error && !loading) {
      console.log(data.data);
      // setSummaries(data.data);
    }
  }, [data, loading, error]);
  return (
    <div className="h-full overflow-auto">
      <div className="p-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Summaries
          </h1>
          <p className="text-gray-600">
            Review and manage your study summaries
          </p>
        </motion.div>

        <div className="grid gap-4">
          {summaries.map((summary, index) => (
            <Link key={index} href={`/dashboard/summary/${summary.slug}`}>
            <motion.div
              key={summary.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{summary.title}</h3>
                    <p className="text-gray-600">{summary.subject}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{summary.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{summary.pages} pages</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      summary.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {summary.status}
                  </span>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
