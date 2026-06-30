import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  Briefcase,
  Clock,
  FileText,
  GraduationCap,
  PenLine,
  Sparkles,
  Target,
  Trophy,
  Users,
} from "lucide-react";

export const audienceBadges = [
  "University students",
  "Certificate exam prep",
  "Working professionals",
  "Self-study learners",
];

export const heroMetrics = [
  {
    title: "Any level",
    text: "Beginner refreshers to advanced review",
  },
  {
    title: "Every goal",
    text: "Courses, certificates, interviews, skills",
  },
  {
    title: "Active recall",
    text: "Practice, timed exams, and analytics",
  },
];

export const audienceCards = [
  {
    icon: GraduationCap,
    title: "University students",
    description:
      "Turn lectures, course topics, and difficult modules into focused notes, practice questions, and exam-ready revision.",
  },
  {
    icon: Briefcase,
    title: "Professionals taking certificate exams",
    description:
      "Build a guided study path for career exams, technical certifications, interviews, and promotion-ready skills.",
  },
  {
    icon: Users,
    title: "Anyone who wants to study smarter",
    description:
      "Start with any topic you care about and get a clear path for learning, reviewing, testing, and tracking progress.",
  },
];

export const workflowSteps = [
  {
    icon: Sparkles,
    title: "Create",
    description:
      "Describe the subject, exam, class, or skill you want to master.",
  },
  {
    icon: BookOpenCheck,
    title: "Study",
    description:
      "Work through generated notes, examples, summaries, and key concepts.",
  },
  {
    icon: Trophy,
    title: "Prove",
    description:
      "Use practice and timed exam mode to see what is strong and what needs review.",
  },
];

export const featureCards = [
  {
    icon: BrainCircuit,
    title: "Goal-aware study plans",
    description:
      "Aurify shapes each Study around your level, deadline, and outcome, whether that is passing a course or clearing a certification.",
  },
  {
    icon: FileText,
    title: "Focused learning material",
    description:
      "Get structured explanations, outlines, summaries, and examples that make dense topics easier to work through.",
  },
  {
    icon: PenLine,
    title: "Practice questions",
    description:
      "Reinforce what you learned with targeted questions and feedback on the concepts that still need attention.",
  },
  {
    icon: Clock,
    title: "Timed exam mode",
    description:
      "Prepare under pressure for university exams, professional tests, interviews, and self-assessment sessions.",
  },
  {
    icon: BarChart3,
    title: "Progress analytics",
    description:
      "See completion, latest scores, weak areas, and the best next step inside each learning workspace.",
  },
  {
    icon: Target,
    title: "Clear next steps",
    description:
      "Know what to study next instead of guessing, rereading everything, or getting stuck in scattered resources.",
  },
];

export const studyProgress = [
  { label: "Material", value: "Done", width: "100%", active: true },
  { label: "Practice", value: "82%", width: "82%", active: true },
  { label: "Exam", value: "Next", width: "38%", active: false },
];

export const mockupTags = [
  "Professional",
  "Intermediate",
  "Exam in 14 days",
];
