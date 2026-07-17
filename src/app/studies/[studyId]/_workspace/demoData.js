export const isDemoStudyId = (studyId) =>
  process.env.NODE_ENV === "development" && studyId === "demo";

export const demoStudy = {
  id: "demo",
  topic: "Calculus Limits",
  subject: "Mathematics",
  topic_type: "level-dependent",
  level: "Introductory College",
  goal: "Understand limits, one-sided behavior, and common exam mistakes.",
  practice_question_count: 8,
  exam_question_count: 12,
  status: "exam_ready",
  generation_error: null,
  owner_id: "demo-user",
  created_at: "2026-06-29T09:00:00",
  updated_at: "2026-06-29T09:45:00",
  progress: {
    material_completed: true,
    practice_completed: false,
    exam_completed: false,
    latest_practice_score: 75,
    latest_exam_score: null,
    aggregate_weak_areas: ["one-sided limits", "factoring before substitution"],
  },
};

export const demoMaterial = {
  id: "demo-material",
  study_id: "demo",
  title: "Calculus Limits Learning Material",
  outline: [
    "What limits measure",
    "Evaluating limits",
    "One-sided and infinite limits",
  ],
  source_notes:
    "Demo content for previewing the Study workspace UI without waiting for backend generation.",
  content:
    "## Module 1: What Limits Measure\n\nA limit describes the value a function approaches as the input gets close to a target.\n\n## Module 2: Evaluating Limits\n\nStart with direct substitution, then simplify when substitution produces an indeterminate form.",
  modules: [
    {
      id: "demo-module-1",
      study_id: "demo",
      module_number: 1,
      title: "What Limits Measure",
      objective:
        "Build a plain-English model for what a limit says before using formal notation.",
      status: "ready",
      estimated_minutes: 21,
      generation_error: null,
      key_concepts: ["approach", "input behavior", "output behavior"],
      dependencies: [],
      coverage_notes:
        "Starts with intuition, then connects the idea to notation and graphs.",
      practice_coverage_reason:
        "Checks limit language, graph interpretation, and a common misconception.",
      progress: {
        module_id: "demo-module-1",
        completed_lessons: 0,
        total_lessons: 2,
        percent_complete: 0,
        completed: false,
      },
      lessons: [
        {
          id: "demo-lesson-1",
          lesson_number: 1,
          title: "The Big Idea",
          content:
            "A limit is about what a function is getting close to, not always what the function equals. If x moves closer and closer to 2, the limit asks what y-value the function approaches during that movement.",
          estimated_minutes: 7,
          key_takeaways: [
            "Limits describe approaching behavior.",
            "The function value at the target can be different from the limit.",
            "Graphs are often the fastest way to see the idea.",
          ],
          progress: {
            lesson_id: "demo-lesson-1",
            content_completed: false,
            practice_completed: false,
            completed: false,
            status: "not_started",
          },
        },
        {
          id: "demo-lesson-2",
          lesson_number: 2,
          title: "Reading Limit Notation",
          content:
            "`lim x -> a f(x) = L` means the output of `f(x)` approaches `L` as `x` approaches `a`. The notation looks formal, but it is just a compact sentence about movement.",
          estimated_minutes: 7,
          key_takeaways: [
            "The arrow tells you where x is moving.",
            "The value after the equals sign is the approached output.",
            "Read notation as a sentence before solving.",
          ],
          progress: {
            lesson_id: "demo-lesson-2",
            content_completed: true,
            practice_completed: false,
            completed: false,
            status: "practice_pending",
          },
        },
      ],
      practice_questions: [
        {
          id: "demo-module-question-1",
          lesson_id: "demo-lesson-1",
          question_number: 1,
          question: "What does a limit mainly describe?",
          options: [
            "The value a function approaches",
            "Only the exact value of f(a)",
            "The slope of every tangent line",
            "The largest number in the function",
          ],
          correct_answer: "The value a function approaches",
          explanation:
            "A limit is about approaching behavior as the input moves toward a target.",
          difficulty: "easy",
          weak_area: "limit definition",
          source_lesson: "The Big Idea",
        },
        {
          id: "demo-module-question-1-2",
          lesson_id: "demo-lesson-1",
          question_number: 2,
          question: "A function approaches 6 near x = 3, but f(3) = 10. What is the limit?",
          options: ["6", "10", "3", "It must be undefined"],
          correct_answer: "6",
          explanation: "The limit follows the value the function approaches, not necessarily its value at the target.",
          difficulty: "medium",
          weak_area: "function value versus limit",
          source_lesson: "The Big Idea",
        },
        {
          id: "demo-module-question-1-3",
          lesson_id: "demo-lesson-1",
          question_number: 3,
          question: "Which observation is most useful when estimating a limit from a graph?",
          options: ["Where the graph approaches from nearby points", "The graph colour", "Only the point at x = a", "The title of the axis"],
          correct_answer: "Where the graph approaches from nearby points",
          explanation: "Nearby behavior on both sides reveals the approached output.",
          difficulty: "medium",
          weak_area: "graph interpretation",
          source_lesson: "The Big Idea",
        },
        {
          id: "demo-module-question-1-4",
          lesson_id: "demo-lesson-1",
          question_number: 4,
          question: "What misconception can cause someone to misread a limit?",
          options: ["Assuming the limit must equal f(a)", "Checking nearby inputs", "Comparing both sides", "Reading the axes"],
          correct_answer: "Assuming the limit must equal f(a)",
          explanation: "A limit concerns approaching behavior and can differ from the defined function value.",
          difficulty: "medium",
          weak_area: "limit definition",
          source_lesson: "The Big Idea",
        },
        {
          id: "demo-module-question-1-5",
          lesson_id: "demo-lesson-1",
          question_number: 5,
          question: "If values from both sides approach different outputs, what follows?",
          options: ["The two-sided limit does not exist", "Use the larger output", "Use f(a)", "Average both outputs"],
          correct_answer: "The two-sided limit does not exist",
          explanation: "A two-sided limit requires the left and right approaches to agree.",
          difficulty: "medium",
          weak_area: "two-sided behavior",
          source_lesson: "The Big Idea",
        },
        {
          id: "demo-module-question-1b",
          lesson_id: "demo-lesson-2",
          question_number: 1,
          question: "What does the arrow in limit notation tell you?",
          options: [
            "Where x is moving",
            "The final exam score",
            "Only the y-intercept",
            "The largest input value",
          ],
          correct_answer: "Where x is moving",
          explanation:
            "The arrow shows the target value that x approaches.",
          difficulty: "easy",
          weak_area: "limit notation",
          source_lesson: "Reading Limit Notation",
        },
      ],
    },
    {
      id: "demo-module-2",
      study_id: "demo",
      module_number: 2,
      title: "Evaluating Limits",
      objective:
        "Choose an efficient strategy for direct substitution, simplification, and factoring cases.",
      status: "ready",
      estimated_minutes: 28,
      generation_error: null,
      key_concepts: ["direct substitution", "indeterminate form", "factoring"],
      dependencies: ["What Limits Measure"],
      coverage_notes:
        "Focuses on the first practical solving moves students use in homework and exams.",
      practice_coverage_reason:
        "Tests direct substitution first, then simplification when substitution is blocked.",
      progress: {
        module_id: "demo-module-2",
        completed_lessons: 1,
        total_lessons: 2,
        percent_complete: 50,
        completed: false,
      },
      lessons: [
        {
          id: "demo-lesson-3",
          lesson_number: 1,
          title: "Try Direct Substitution First",
          content:
            "When a function is continuous at the target value, the limit can often be found by substituting the target directly. This is the fastest first check.",
          estimated_minutes: 7,
          key_takeaways: [
            "Substitute first when the expression allows it.",
            "A clean number usually means you are done.",
            "Do not overcomplicate continuous functions.",
          ],
          progress: {
            lesson_id: "demo-lesson-3",
            content_completed: true,
            practice_completed: true,
            completed: true,
            status: "completed",
            last_question_id: "demo-module-question-2a",
            last_answer: "Substitute first when the expression allows it",
            last_is_correct: true,
            last_weak_area: "direct substitution",
          },
        },
        {
          id: "demo-lesson-4",
          lesson_number: 2,
          title: "When Substitution Gives 0 Over 0",
          content:
            "`0/0` is not an answer. It tells you the expression needs more work. Common next moves include factoring, canceling a shared factor, and then substituting again.",
          estimated_minutes: 7,
          key_takeaways: [
            "`0/0` signals an indeterminate form.",
            "Factoring can reveal a removable problem.",
            "After simplifying, substitute again.",
          ],
          progress: {
            lesson_id: "demo-lesson-4",
            content_completed: false,
            practice_completed: false,
            completed: false,
            status: "not_started",
          },
        },
      ],
      practice_questions: [
        {
          id: "demo-module-question-2a",
          lesson_id: "demo-lesson-3",
          question: "What is the fastest first check for many continuous functions?",
          options: [
            "Substitute first when the expression allows it",
            "Always factor immediately",
            "Ignore the target value",
            "Start with a timed exam",
          ],
          correct_answer: "Substitute first when the expression allows it",
          explanation:
            "Direct substitution is usually the quickest valid first move for continuous functions.",
          difficulty: "easy",
          weak_area: "direct substitution",
          source_lesson: "Try Direct Substitution First",
        },
        {
          id: "demo-module-question-2",
          lesson_id: "demo-lesson-4",
          question: "What should you do if direct substitution gives 0/0?",
          options: [
            "Simplify the expression and try again",
            "Use 0 as the final answer",
            "Use 1 as the final answer",
            "Ignore the target value",
          ],
          correct_answer: "Simplify the expression and try again",
          explanation:
            "The form 0/0 means the expression is indeterminate, so it needs algebraic simplification.",
          difficulty: "medium",
          weak_area: "factoring before substitution",
          source_lesson: "When Substitution Gives 0 Over 0",
        },
      ],
    },
    {
      id: "demo-module-3",
      study_id: "demo",
      module_number: 3,
      title: "One-Sided And Infinite Limits",
      objective:
        "Recognize when left-side, right-side, and infinite behavior must be handled separately.",
      status: "failed",
      estimated_minutes: 21,
      generation_error:
        "Demo failure: the worker timed out while generating this module task.",
      key_concepts: ["left-hand limit", "right-hand limit", "vertical asymptote"],
      dependencies: ["What Limits Measure", "Evaluating Limits"],
      coverage_notes:
        "This failed module exists so the partial-ready recovery UI can be reviewed.",
    },
  ],
  created_at: "2026-06-29T09:15:00",
  updated_at: "2026-06-29T09:40:00",
};

export const demoGlossary = {
  id: "demo-glossary",
  study_id: "demo",
  terms: [
    {
      term: "Limit",
      definition:
        "The value a function approaches as the input gets close to a specified point.",
      simple_explanation:
        "Where the graph seems to be heading as x gets closer to a number.",
      analogy:
        "Like walking toward a door: the limit describes the door you are approaching.",
      why_it_matters:
        "Limits are the foundation for derivatives, continuity, and many calculus ideas.",
      section: "What Limits Measure",
      difficulty: "basic",
    },
    {
      term: "Indeterminate Form",
      definition:
        "An expression form, such as 0/0, that does not determine a limit by itself.",
      simple_explanation:
        "A signal that you need to simplify before deciding the answer.",
      analogy:
        "Like a locked box: it is not empty, but you need another step to open it.",
      why_it_matters:
        "It tells students not to stop too early during limit problems.",
      section: "Evaluating Limits",
      difficulty: "medium",
    },
  ],
  source_notes: "Demo terms selected from the generated module material.",
  created_at: "2026-06-29T09:30:00",
  updated_at: "2026-06-29T09:30:00",
};

export const demoPracticeQuestionSets = [
  {
    id: "demo-practice-set-1",
    study_id: "demo",
    mode: "practice",
    title: "Practice Set 1",
    question_count: 3,
    generated_question_count: 3,
    status: "ready",
    generation_error: null,
    created_at: "2026-06-29T09:35:00",
    updated_at: "2026-06-29T09:35:00",
  },
];

export const demoExamQuestionSets = [
  {
    id: "demo-exam-set-1",
    study_id: "demo",
    mode: "exam",
    title: "Exam Set 1",
    question_count: 3,
    generated_question_count: 3,
    status: "ready",
    generation_error: null,
    created_at: "2026-06-29T09:40:00",
    updated_at: "2026-06-29T09:40:00",
  },
];

export const demoPracticeQuestions = [
  {
    id: "demo-practice-1",
    study_id: "demo",
    question_set_id: "demo-practice-set-1",
    question: "What does lim x -> 2 f(x) describe?",
    options: [
      "What f(x) approaches as x gets close to 2",
      "Only the value of f(2)",
      "The maximum value of f(x)",
      "The derivative of f(x)",
    ],
    correct_answer: "What f(x) approaches as x gets close to 2",
    explanation:
      "The limit describes approaching behavior near x = 2.",
    difficulty: "easy",
    weak_area: "limit definition",
    source_section: "What Limits Measure",
  },
  {
    id: "demo-practice-2",
    study_id: "demo",
    question_set_id: "demo-practice-set-1",
    question: "If substitution creates 0/0, what is the best next step?",
    options: [
      "Simplify or factor the expression",
      "Stop and answer 0",
      "Stop and answer undefined",
      "Change the target value",
    ],
    correct_answer: "Simplify or factor the expression",
    explanation:
      "The expression needs more algebra before the limit can be evaluated.",
    difficulty: "medium",
    weak_area: "factoring before substitution",
    source_section: "Evaluating Limits",
  },
  {
    id: "demo-practice-3",
    study_id: "demo",
    question_set_id: "demo-practice-set-1",
    question: "When do one-sided limits matter most?",
    options: [
      "When left and right behavior may differ",
      "When a function is a straight line",
      "Only when x is negative",
      "Only after taking an exam",
    ],
    correct_answer: "When left and right behavior may differ",
    explanation:
      "One-sided limits separate the behavior from the left and from the right.",
    difficulty: "medium",
    weak_area: "one-sided limits",
    source_section: "One-Sided And Infinite Limits",
  },
];

export const demoExamQuestions = [
  {
    id: "demo-exam-1",
    study_id: "demo",
    question_set_id: "demo-exam-set-1",
    question: "A graph approaches y = 4 as x approaches 1, but f(1) = 9. What is the limit?",
    options: ["4", "9", "1", "Does not exist"],
    correct_answer: "4",
    explanation:
      "The limit is the approached value, not necessarily the actual function value.",
    difficulty: "medium",
    weak_area: "limit definition",
    source_section: "What Limits Measure",
  },
  {
    id: "demo-exam-2",
    study_id: "demo",
    question_set_id: "demo-exam-set-1",
    question: "What does 0/0 usually mean during a limit problem?",
    options: [
      "The expression is indeterminate",
      "The answer is definitely 0",
      "The answer is definitely 1",
      "The problem has no variables",
    ],
    correct_answer: "The expression is indeterminate",
    explanation:
      "0/0 means more work is needed before deciding the limit.",
    difficulty: "medium",
    weak_area: "factoring before substitution",
    source_section: "Evaluating Limits",
  },
  {
    id: "demo-exam-3",
    study_id: "demo",
    question_set_id: "demo-exam-set-1",
    question: "A two-sided limit exists only when which condition is true?",
    options: [
      "The left-hand and right-hand limits match",
      "The function is always increasing",
      "The denominator is zero",
      "The graph has no points",
    ],
    correct_answer: "The left-hand and right-hand limits match",
    explanation:
      "Both sides must approach the same value for the two-sided limit to exist.",
    difficulty: "hard",
    weak_area: "one-sided limits",
    source_section: "One-Sided And Infinite Limits",
  },
];

export const demoRevisionSetsByLesson = {
  "demo-lesson-1": {
    id: "demo-revision-set-1",
    study_id: "demo",
    module_id: "demo-module-1",
    lesson_id: "demo-lesson-1",
    status: "ready",
    source_attempt_count: 5,
    source_incorrect_question_count: 1,
    generated_question_count: 2,
    generation_error: null,
    questions: [
      {
        id: "demo-revision-question-1",
        lesson_id: "demo-lesson-1",
        original_question_id: "demo-module-question-1-2",
        weak_area: "function value versus limit",
        question: "A graph approaches 4 near x = 1 while f(1) = 9. Which value describes the limit?",
        options: ["4", "9", "1", "The average of 4 and 9"],
        correct_answer: "4",
        explanation: "The approached value is 4 even though the function is defined as 9 at the target.",
        difficulty: "medium",
        question_number: 1,
      },
      {
        id: "demo-revision-question-2",
        lesson_id: "demo-lesson-1",
        original_question_id: "demo-module-question-1-2",
        weak_area: "function value versus limit",
        question: "Which evidence should take priority when reading a limit from a graph?",
        options: ["Nearby approaching behavior", "The filled point only", "The axis colour", "The graph title"],
        correct_answer: "Nearby approaching behavior",
        explanation: "Limits are determined by nearby behavior rather than only the filled point.",
        difficulty: "medium",
        question_number: 2,
      },
    ],
    revision_progress: {
      answered_count: 0,
      correct_count: 0,
      total_questions: 2,
      remaining_count: 2,
      score: 0,
      completed: false,
    },
  },
};

export const demoRevisionStateFixtures = {
  queued: { status: "queued", questions: [] },
  generating: { status: "generating", questions: [] },
  failed: { status: "failed", generation_error: "Demo revision generation failure", questions: [] },
  empty: { status: "not_started", questions: [] },
  legacySingleQuestion: {
    practice_question: demoMaterial.modules[0].practice_questions[0],
  },
};

export const createDemoQuestionSet = (mode, index, count) => ({
  id: `demo-${mode}-set-${Date.now()}`,
  study_id: "demo",
  mode,
  title: `${mode === "practice" ? "Practice" : "Exam"} Set ${index}`,
  question_count: count,
  generated_question_count: count,
  status: "ready",
  generation_error: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});
