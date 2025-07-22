import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import Cookies from "js-cookie";
import axios from "axios";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export const CreateStudyModal = ({ isOpen, onClose }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const fileInputRef = useRef(null);

  const subjects = [
    "Mathematics",
    "Science",
    "History",
    "English Literature",
    "Physics",
    "Chemistry",
    "Biology",
    "Geography",
    "Art",
    "Music",
  ];

  const gradeLevels = [
    "Elementary (K-5)",
    "Middle School (6-8)",
    "High School (9-12)",
    "College/University",
    "Graduate Level",
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files[0].type === "application/pdf") {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFiles = Array.from(e.dataTransfer.files);
        setUploadedFile((prevFiles) => [...prevFiles, ...droppedFiles]);
        //   handleFile(e.dataTransfer.files[0]);
      }
    } else {
      Toast.fire({
        icon: "warning",
        title: "Please Upload a Pdf file only",
      });
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files[0].type === "application/pdf") {
      if (e.target.files && e.target.files[0]) {
        const selectedFiles = Array.from(e.target.files);
        setUploadedFile((prevFile) => [...prevFile, ...selectedFiles]);
        // handleFile(e.target.files[0]);
      }
    } else {
      Toast.fire({
        icon: "warning",
        title: "Please Upload a Pdf file only",
      });
    }
  };

//   const handleFile = (file) => {
//     if (file.type === "application/pdf") {
//       setUploadedFile(file);
//       simulateUpload();
//     } else {
//       Toast.fire({
//         icon: "warning",
//         title: "Please Upload a Pdf file only",
//       });
//     }
//   };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleGenerateQuestions = async () => {
    if (!uploadedFile && (!subject || !topic || !gradeLevel)) {
      Toast.fire({
        icon: "warning",
        title: "Please upload a PDF or fill in all the form fields.",
      });
      return;
    }
    setIsProcessing(true);
    const formData = new FormData();
    uploadedFile.forEach((file) => {
      formData.append("file", file);
    });
    try {
      const token = Cookies.get("accessToken");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AURIFY_BASE_URL}/pdf2ai`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      Toast.fire({
        icon: "success",
        title: "Upload Sucessful",
      });
      resetForm();
      // console.log("Files uploaded successfully", response.data);
      // Handle success (e.g., show success message, reset state, etc.)
    } catch (error) {
    //   setIsProcessing(false);
      console.error("Error uploading files", error)
      if (error.message === "Network Error") {
        Toast.fire({
          icon: "error",
          title: "Check Your Internet",
        });
      } else {
        Toast.fire({
          icon: "error",
          title: "Failed to Upload",
        });
      }
      resetForm()
      // Handle error (e.g., show error message)
    }

    // // Simulate processing time
    // setTimeout(() => {
    //   setIsProcessing(false);
    //   onClose();
    //   // Here you would typically navigate to the generated study or show success
    //   alert("Study created successfully!");
    // }, 3000);
  };

  const resetForm = () => {
    setUploadedFile([]);
    setIsUploading(false);
    setUploadProgress(0);
    setIsProcessing(false);
    setSubject("");
    setTopic("");
    setGradeLevel("");
    setShowSubjectDropdown(false);
    setShowGradeDropdown(false);
  };

  const handleClose = () => {
    if (isProcessing) {
      const confirmClose = window.confirm(
        "Your study is being processed. Are you sure you want to close?"
      );
      if (!confirmClose) return;
    }
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create Study</h2>
              <p className="text-gray-600 mt-1">
                You can upload a PDF or choose a subject/topic to start.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isProcessing}
            >
              <X className="w-6 h-6 text-gray-600" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Upload Section */}
            <div className="space-y-4">
              <div className="text-center"></div>

              {/* Drag and Drop Area */}
              <motion.div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : uploadedFile?.length > 0
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                whileHover={{ scale: 1.01 }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />

                {isUploading ? (
                  <div className="space-y-4">
                    <Loader2 className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
                    <div>
                      <p className="text-gray-700 font-medium">Uploading...</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <motion.div
                          className="bg-blue-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {uploadProgress}%
                      </p>
                    </div>
                  </div>
                ) : uploadedFile?.length > 0 ? (
                  <div className="space-y-3">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                    <div>
                      <p className="text-gray-700 font-medium">
                        File uploaded successfully!
                      </p>
                      <p className="text-sm text-gray-500">
                        {uploadedFile[0].name}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setUploadedFile([]);
                        setUploadProgress(0);
                      }}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Upload different file
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drag and drop a PDF here, or
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Upload
                      </motion.button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
            <span className="text-lg font-medium text-gray-900 flex justify-center">
              OR
            </span>
            {/* Form Fields */}
            <div className="space-y-4">
              {/* Subject Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Subject
                </label>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 transition-colors"
                >
                  <span className={subject ? "text-gray-900" : "text-gray-500"}>
                    {subject || "Select Subject"}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      showSubjectDropdown ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {showSubjectDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-xl shadow-lg z-10 mt-1 max-h-48 overflow-y-auto"
                    >
                      {subjects.map((subjectOption) => (
                        <motion.button
                          key={subjectOption}
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          onClick={() => {
                            setSubject(subjectOption);
                            setShowSubjectDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          {subjectOption}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Topic
                </label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter Topic"
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Grade Level Dropdown */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Grade Level
                </label>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setShowGradeDropdown(!showGradeDropdown)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 transition-colors"
                >
                  <span
                    className={gradeLevel ? "text-gray-900" : "text-gray-500"}
                  >
                    {gradeLevel || "Select Grade Level"}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      showGradeDropdown ? "rotate-180" : ""
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {showGradeDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-xl shadow-lg z-10 mt-1"
                    >
                      {gradeLevels.map((level) => (
                        <motion.button
                          key={level}
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          onClick={() => {
                            setGradeLevel(level);
                            setShowGradeDropdown(false);
                          }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                        >
                          {level}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Generate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateQuestions}
              disabled={isProcessing || isUploading}
              className={`w-full py-4 rounded-xl font-medium text-white transition-all ${
                isProcessing || isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl"
              }`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Generate Study"
              )}
            </motion.button>

            {/* Processing Status */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                    <div>
                      <p className="text-blue-800 font-medium">
                        Creating your study...
                      </p>
                      <p className="text-blue-600 text-sm">
                        {`This may take a few moments. You can close this window
                        and we'll notify you when it's ready.`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
