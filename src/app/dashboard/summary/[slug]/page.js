// "use client";
// import Summary from "../../_components/summary";
// import DashboardNav from "../../_components/dashboardNav";
// import SideNav from "../../_components/sideNav";
// import { useEffect, useState } from "react";

// function SubjectNotesPage({ params }) {
//   const slug = params.slug;
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div>
//       {/* <DashboardNav /> */}
//       <Summary slug={slug} />
//       {isMobile && <SideNav />}
//     </div>
//   );
// }

// export default SubjectNotesPage;
"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Download,
  Share2,
  BookOpen,
  Clock,
  Calendar,
  ArrowLeft,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";

export default function SummaryDetail({ onBack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  // Mock audio URL - in a real app, this would come from your backend
  const audioUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("loadeddata", setAudioData);
    audio.addEventListener("timeupdate", setAudioTime);

    return () => {
      audio.removeEventListener("loadeddata", setAudioData);
      audio.removeEventListener("timeupdate", setAudioTime);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const clickX = e.nativeEvent.offsetX;
    const width = e.currentTarget.offsetWidth;
    const newTime = (clickX / width) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    audio.currentTime = Math.min(audio.currentTime + 15, duration);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    audio.currentTime = Math.max(audio.currentTime - 15, 0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div className="flex items-center space-x-3">
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">StudySmart</h1>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Dashboard
            </Link>
            <Link href="/dashboard" className="text-blue-600 font-medium">
              Summaries
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Practice
            </Link>
            {/* <Link
              href="#"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Resources
            </Link> */}
          </nav>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share2 className="w-5 h-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </motion.button>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            AI Summary of 'The History of Ancient Civilizations'
          </h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Uploaded on October 26, 2024</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">15 min read</span>
            </div>
          </div>
        </motion.div>

        {/* Audio Player Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Summary of 'The History of Ancient Civilizations'
              </h3>
              <p className="text-gray-600">AI Summary</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </motion.button>
          </div>

          {/* Audio Controls */}
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div
                className="w-full h-2 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden"
                onClick={handleSeek}
              >
                <motion.div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.1 }}
                />
                <motion.div
                  className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full shadow-lg"
                  style={{ left: `calc(${progressPercentage}% - 8px)` }}
                  whileHover={{ scale: 1.2 }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center space-x-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={skipBackward}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SkipBack className="w-6 h-6 text-gray-700" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlayPause}
                className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={skipForward}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors"
              >
                <SkipForward className="w-6 h-6 text-gray-700" />
              </motion.button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center justify-center space-x-3">
              <Volume2 className="w-5 h-5 text-gray-600" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  if (audioRef.current) {
                    audioRef.current.volume = newVolume;
                  }
                }}
                className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>

          {/* Hidden Audio Element */}
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            preload="metadata"
          />
        </motion.div>

        {/* Summary Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8"
        >
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              This comprehensive summary of 'The History of Ancient
              Civilizations' covers the rise and fall of major civilizations
              from Mesopotamia to the Roman Empire. It details key developments
              in governance, societal structures, technological advancements,
              and cultural achievements. The summary highlights the
              interconnectedness of these civilizations and their lasting impact
              on modern society, providing a concise yet thorough overview of
              ancient history.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Key Civilizations Covered
            </h2>
            <ul className="space-y-2 mb-6">
              <li className="text-gray-700">
                • Mesopotamian Civilizations (Sumerians, Babylonians, Assyrians)
              </li>
              <li className="text-gray-700">
                • Ancient Egypt and the Pharaohs
              </li>
              <li className="text-gray-700">• Indus Valley Civilization</li>
              <li className="text-gray-700">
                • Ancient China and the Dynasties
              </li>
              <li className="text-gray-700">
                • Greek City-States and Classical Period
              </li>
              <li className="text-gray-700">• Roman Republic and Empire</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Major Themes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Political Systems
                </h3>
                <p className="text-blue-800 text-sm">
                  Evolution from tribal societies to complex empires
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">
                  Technology & Innovation
                </h3>
                <p className="text-green-800 text-sm">
                  Writing systems, agriculture, and engineering marvels
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">
                  Cultural Exchange
                </h3>
                <p className="text-purple-800 text-sm">
                  Trade routes and cultural diffusion
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">
                  Religious Systems
                </h3>
                <p className="text-orange-800 text-sm">
                  From polytheism to monotheistic traditions
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium transition-colors shadow-lg"
          >
            Generate Practice Questions
          </motion.button>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors"
            >
              Back to Dashboard
            </motion.button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
