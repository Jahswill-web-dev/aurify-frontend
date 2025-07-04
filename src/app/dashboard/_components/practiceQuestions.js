import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, BookOpen, Users, ArrowLeft } from "lucide-react";
import { useFetchWithToken } from "@/app/hooks/useCustomHook";
import Link from "next/link";

const practiceQuestions = [
  {
    id: 1,
    title: "Ancient Civilizations Quiz",
    subject: "History",
    questions: 15,
    timeEstimate: "20 min",
    participants: 1234,
    description:
      "Test your knowledge of ancient civilizations including Egypt, Greece, and Rome.",
  },
  {
    id: 2,
    title: "Calculus Fundamentals",
    subject: "Mathematics",
    questions: 20,
    timeEstimate: "30 min",
    participants: 856,
    description:
      "Practice derivatives, integrals, and limits in this comprehensive calculus quiz.",
  },
  {
    id: 3,
    title: "Cell Biology Basics",
    subject: "Biology",
    questions: 12,
    timeEstimate: "15 min",
    participants: 2341,
    description:
      "Explore cell structure, organelles, and basic cellular processes.",
  },
  {
    id: 4,
    title: "Shakespeare Literature",
    subject: "English",
    questions: 18,
    timeEstimate: "25 min",
    participants: 567,
    description:
      "Analyze themes, characters, and literary devices in Shakespeare's major works.",
  },
  {
    id: 5,
    title: "Chemical Reactions",
    subject: "Chemistry",
    questions: 22,
    timeEstimate: "35 min",
    participants: 1789,
    description:
      "Master chemical equations, reaction types, and stoichiometry.",
  },
  {
    id: 6,
    title: "World War II Timeline",
    subject: "History",
    questions: 16,
    timeEstimate: "22 min",
    participants: 945,
    description:
      "Test your knowledge of key events, dates, and figures from WWII.",
  },
  {
    id: 7,
    title: "Geometry Proofs",
    subject: "Mathematics",
    questions: 14,
    timeEstimate: "40 min",
    participants: 623,
    description:
      "Practice geometric proofs, theorems, and problem-solving techniques.",
  },
  {
    id: 8,
    title: "Photosynthesis Process",
    subject: "Biology",
    questions: 13,
    timeEstimate: "18 min",
    participants: 1456,
    description: "Understand the light and dark reactions of photosynthesis.",
  },
];

export const PracticeQuestions = ({ onSwitchView }) => {
  const [practiceQuestions, setPracticeQuestions] = useState();

  const { data, error, loading, refetch } = useFetchWithToken(
    `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/audiobooks`
  );
  useEffect(() => {
    if (data && !error && !loading) {
      console.log(data.data);
      setPracticeQuestions(data.data);
    }
  }, [data, loading, error]);

  return (
    <div className="h-full overflow-auto bg-gray-50">
      <div className="p-8 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Practice Questions
            </h1>
            <p className="text-gray-600">
              Test your knowledge with interactive questions
            </p>
          </div>
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSwitchView}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Advanced View</span>
          </motion.button> */}
        </motion.div>

        {/* Questions List */}
        <div className="space-y-4">
          {practiceQuestions?.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                {/* Left Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {question.title}
                    </h3>
                    {/* <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                        {question.subject} 
                    </span>  */}
                  </div>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {/* {question.description} */}
                  </p>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{question.length} questions</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      {/* <span>{question.timeEstimate}</span> */}
                    </div>
                    {/* <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{question.participants.toLocaleString()} participants</span>
                    </div> */}
                  </div>
                </div>

                {/* Right Button */}
                <div className="ml-6">
                  <Link href={`/dashboard/questions/${question.slug}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl"
                    >
                      Start Quiz
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
