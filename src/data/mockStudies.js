const now = new Date("2026-06-01T12:00:00.000Z");

const formatDate = (date) => date.toISOString();

const slugify = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "untitled-study";

const question = ({
  id,
  question: text,
  options,
  correctAnswer,
  explanation,
  relatedSectionId,
  difficulty = "medium",
}) => ({
  id,
  question: text,
  options,
  correctAnswer,
  explanation,
  relatedSectionId,
  difficulty,
});

export const goalOptions = [
  "Understand the topic",
  "Prepare for an exam",
  "Practice questions",
  "Deep mastery",
];

export const levelOptions = [
  "Beginner",
  "High School",
  "University",
  "Professional",
  "Advanced",
];

export const mockStudies = [
  {
    id: "photosynthesis",
    title: "Photosynthesis",
    subject: "Biology",
    topic: "Photosynthesis",
    level: "High School",
    goal: "Prepare for an exam",
    status: "in_progress",
    progress: 64,
    createdAt: formatDate(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 18)),
    lastStudiedAt: formatDate(new Date(now.getTime() - 1000 * 60 * 60 * 8)),
    material: {
      overview:
        "Photosynthesis is the process plants use to convert light energy into chemical energy stored as glucose. This study connects the cell structures, chemical equation, light reactions, Calvin cycle, and limiting factors into one exam-ready model.",
      sections: [
        {
          id: "photo-overview",
          title: "What Photosynthesis Does",
          content:
            "Photosynthesis lets plants, algae, and some bacteria use sunlight to make glucose from carbon dioxide and water. Oxygen is released as a by-product. The process matters because it stores energy for plant growth and supports most food chains.",
          keyPoints: [
            "Light energy is converted into chemical energy.",
            "Carbon dioxide and water are reactants.",
            "Glucose and oxygen are products.",
          ],
          example:
            "A sunflower uses light captured by its leaves to make glucose that supports new stems, roots, and seeds.",
          completed: true,
        },
        {
          id: "photo-chloroplast",
          title: "Chloroplasts and Chlorophyll",
          content:
            "Photosynthesis happens inside chloroplasts. Chlorophyll, a green pigment in the thylakoid membranes, absorbs light most strongly in red and blue wavelengths and reflects green light.",
          keyPoints: [
            "Chloroplasts contain thylakoids and stroma.",
            "Chlorophyll captures light energy.",
            "Green light is reflected more than it is absorbed.",
          ],
          example:
            "Leaves look green because chlorophyll reflects green wavelengths back to your eyes.",
          completed: true,
        },
        {
          id: "photo-equation",
          title: "The Chemical Equation",
          content:
            "The overall equation is 6CO2 + 6H2O + light energy -> C6H12O6 + 6O2. This equation summarizes many linked reactions, not one simple step.",
          keyPoints: [
            "Six carbon dioxide molecules supply carbon for glucose.",
            "Water contributes electrons and hydrogen.",
            "Oxygen released mostly comes from water.",
          ],
          example:
            "If a question asks where the oxygen gas comes from, the strongest answer is water, not carbon dioxide.",
          completed: true,
        },
        {
          id: "photo-light-reactions",
          title: "Light-Dependent Reactions",
          content:
            "The light-dependent reactions occur in the thylakoid membranes. Light energy splits water, releases oxygen, and helps produce ATP and NADPH for the next stage.",
          keyPoints: [
            "Water is split during photolysis.",
            "ATP and NADPH carry energy to the Calvin cycle.",
            "Oxygen is released as a waste product.",
          ],
          example:
            "Think of ATP and NADPH as charged batteries that will power glucose building.",
          completed: false,
        },
        {
          id: "photo-calvin-cycle",
          title: "The Calvin Cycle",
          content:
            "The Calvin cycle occurs in the stroma. It uses carbon dioxide plus energy from ATP and NADPH to build sugar molecules through carbon fixation and reduction steps.",
          keyPoints: [
            "The Calvin cycle does not directly require light.",
            "Carbon dioxide is fixed into organic molecules.",
            "ATP and NADPH from light reactions are consumed.",
          ],
          example:
            "Even though it is sometimes called light-independent, the Calvin cycle usually stops in darkness because ATP and NADPH run out.",
          completed: false,
        },
        {
          id: "photo-limiting-factors",
          title: "Limiting Factors",
          content:
            "Photosynthesis rate can be limited by light intensity, carbon dioxide concentration, temperature, and chlorophyll availability. Increasing one factor only helps until another factor becomes limiting.",
          keyPoints: [
            "Low light can slow the rate.",
            "Low carbon dioxide reduces glucose production.",
            "Extreme temperatures can reduce enzyme activity.",
          ],
          example:
            "In a greenhouse, growers may add light and carbon dioxide, but only within temperatures that enzymes can tolerate.",
          completed: false,
        },
      ],
    },
    practiceQuestions: [
      question({
        id: "p1",
        question: "What is the main purpose of photosynthesis?",
        options: [
          "To release stored heat from leaves",
          "To convert light energy into chemical energy",
          "To absorb oxygen for respiration",
          "To break glucose into carbon dioxide",
        ],
        correctAnswer: "To convert light energy into chemical energy",
        explanation:
          "Photosynthesis captures light energy and stores it in glucose, a chemical energy source.",
        relatedSectionId: "photo-overview",
        difficulty: "easy",
      }),
      question({
        id: "p2",
        question: "Which organelle is the main site of photosynthesis in plant cells?",
        options: ["Mitochondrion", "Nucleus", "Chloroplast", "Ribosome"],
        correctAnswer: "Chloroplast",
        explanation:
          "Chloroplasts contain chlorophyll and the internal structures needed for photosynthesis.",
        relatedSectionId: "photo-chloroplast",
        difficulty: "easy",
      }),
      question({
        id: "p3",
        question: "In the photosynthesis equation, what are the reactants?",
        options: [
          "Glucose and oxygen",
          "Carbon dioxide and water",
          "Oxygen and water",
          "Glucose and carbon dioxide",
        ],
        correctAnswer: "Carbon dioxide and water",
        explanation:
          "Carbon dioxide and water are used, with light energy, to produce glucose and oxygen.",
        relatedSectionId: "photo-equation",
      }),
      question({
        id: "p4",
        question: "Where do the light-dependent reactions occur?",
        options: [
          "Stroma",
          "Cell wall",
          "Thylakoid membranes",
          "Cytoplasm",
        ],
        correctAnswer: "Thylakoid membranes",
        explanation:
          "The light-dependent reactions take place in the thylakoid membranes where chlorophyll captures light.",
        relatedSectionId: "photo-light-reactions",
      }),
      question({
        id: "p5",
        question: "What gas is released when water is split during the light reactions?",
        options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen chloride"],
        correctAnswer: "Oxygen",
        explanation:
          "Water splitting releases oxygen gas as a by-product of the light-dependent reactions.",
        relatedSectionId: "photo-light-reactions",
      }),
      question({
        id: "p6",
        question: "What does the Calvin cycle use to build sugar?",
        options: [
          "Oxygen and chlorophyll only",
          "Carbon dioxide, ATP, and NADPH",
          "Glucose and water",
          "Nitrogen and sunlight directly",
        ],
        correctAnswer: "Carbon dioxide, ATP, and NADPH",
        explanation:
          "The Calvin cycle fixes carbon dioxide and uses ATP and NADPH from the light reactions.",
        relatedSectionId: "photo-calvin-cycle",
      }),
      question({
        id: "p7",
        question: "Why can increasing light stop improving photosynthesis rate?",
        options: [
          "Another factor becomes limiting",
          "Plants stop needing glucose",
          "Chlorophyll turns blue",
          "The equation changes",
        ],
        correctAnswer: "Another factor becomes limiting",
        explanation:
          "Once light is no longer limiting, carbon dioxide, temperature, or another factor may control the rate.",
        relatedSectionId: "photo-limiting-factors",
        difficulty: "medium",
      }),
      question({
        id: "p8",
        question: "Which condition could reduce photosynthesis by affecting enzymes?",
        options: [
          "Moderate light",
          "Extreme temperature",
          "Enough carbon dioxide",
          "Healthy chlorophyll",
        ],
        correctAnswer: "Extreme temperature",
        explanation:
          "Very high or low temperatures can reduce enzyme activity involved in photosynthesis.",
        relatedSectionId: "photo-limiting-factors",
      }),
      question({
        id: "p9",
        question: "Which statement is most accurate about the Calvin cycle?",
        options: [
          "It directly splits water",
          "It happens in the stroma",
          "It releases all oxygen",
          "It only occurs in animal cells",
        ],
        correctAnswer: "It happens in the stroma",
        explanation:
          "The Calvin cycle takes place in the stroma of the chloroplast.",
        relatedSectionId: "photo-calvin-cycle",
      }),
    ],
    examQuestions: [
      question({
        id: "e1",
        question: "A student says oxygen released by photosynthesis comes from carbon dioxide. What is the best correction?",
        options: [
          "Oxygen gas mostly comes from water split in light reactions.",
          "Oxygen gas comes from glucose breakdown in the Calvin cycle.",
          "Oxygen gas is absorbed from the air and released unchanged.",
          "Oxygen gas is produced in the nucleus.",
        ],
        correctAnswer:
          "Oxygen gas mostly comes from water split in light reactions.",
        explanation:
          "Photolysis splits water during the light-dependent reactions, releasing oxygen.",
        relatedSectionId: "photo-light-reactions",
        difficulty: "hard",
      }),
      question({
        id: "e2",
        question: "Which pair of products from the light reactions powers the Calvin cycle?",
        options: ["ATP and NADPH", "Oxygen and glucose", "Carbon dioxide and water", "DNA and RNA"],
        correctAnswer: "ATP and NADPH",
        explanation:
          "ATP and NADPH transfer energy and reducing power to the Calvin cycle.",
        relatedSectionId: "photo-light-reactions",
      }),
      question({
        id: "e3",
        question: "A greenhouse has high light but low carbon dioxide. What will most likely happen?",
        options: [
          "Photosynthesis may stay limited by carbon dioxide.",
          "Photosynthesis will become unlimited.",
          "The plant will stop using chloroplasts.",
          "The Calvin cycle will make oxygen directly.",
        ],
        correctAnswer: "Photosynthesis may stay limited by carbon dioxide.",
        explanation:
          "Photosynthesis rate depends on the most limiting factor, not only light.",
        relatedSectionId: "photo-limiting-factors",
      }),
      question({
        id: "e4",
        question: "Which statement best links chlorophyll to photosynthesis?",
        options: [
          "Chlorophyll absorbs light energy used to drive photosynthesis.",
          "Chlorophyll stores all glucose in the roots.",
          "Chlorophyll is the gas released by leaves.",
          "Chlorophyll converts oxygen into carbon dioxide.",
        ],
        correctAnswer:
          "Chlorophyll absorbs light energy used to drive photosynthesis.",
        explanation:
          "Chlorophyll is the pigment that captures light energy in chloroplasts.",
        relatedSectionId: "photo-chloroplast",
      }),
      question({
        id: "e5",
        question: "Why is photosynthesis important beyond individual plants?",
        options: [
          "It supports food chains and releases oxygen.",
          "It removes all water from ecosystems.",
          "It prevents plants from growing.",
          "It replaces cellular respiration in animals.",
        ],
        correctAnswer: "It supports food chains and releases oxygen.",
        explanation:
          "Photosynthesis creates chemical energy that supports ecosystems and contributes atmospheric oxygen.",
        relatedSectionId: "photo-overview",
      }),
    ],
    analytics: {
      overallProgress: 64,
      materialCompleted: 3,
      totalMaterialSections: 6,
      practiceAccuracy: 78,
      examScore: 82,
      weakAreas: ["Calvin cycle", "Limiting factors"],
      strongAreas: ["Equation", "Chloroplast structure", "Light reactions"],
    },
  },
  {
    id: "bubble-sort",
    title: "Bubble Sort",
    subject: "Computer Science",
    topic: "Bubble Sort",
    level: "Beginner",
    goal: "Understand the topic",
    status: "ready",
    progress: 20,
    createdAt: formatDate(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7)),
    lastStudiedAt: formatDate(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2)),
    material: {
      overview:
        "Bubble sort is a simple comparison sorting algorithm that repeatedly swaps adjacent items that are in the wrong order.",
      sections: [
        {
          id: "bubble-idea",
          title: "Core Idea",
          content:
            "Bubble sort compares neighboring values and swaps them when they are out of order. Larger values gradually move toward the end of the list.",
          keyPoints: ["Compare adjacent items", "Swap when needed", "Repeat passes"],
          example: "In [3, 1, 2], compare 3 and 1, then swap to get [1, 3, 2].",
          completed: true,
        },
        {
          id: "bubble-complexity",
          title: "Efficiency",
          content:
            "Bubble sort is easy to understand but inefficient for large lists. Its average and worst-case time complexity is O(n^2).",
          keyPoints: ["Simple but slow", "Best for teaching", "O(n^2) average case"],
          completed: false,
        },
      ],
    },
    practiceQuestions: [
      question({
        id: "bp1",
        question: "What does bubble sort compare?",
        options: ["Random items", "Adjacent items", "Only first and last items", "No items"],
        correctAnswer: "Adjacent items",
        explanation: "Bubble sort repeatedly compares neighboring values.",
        relatedSectionId: "bubble-idea",
      }),
      question({
        id: "bp2",
        question: "What is bubble sort's common worst-case time complexity?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
        correctAnswer: "O(n^2)",
        explanation: "Nested passes over the list lead to quadratic time.",
        relatedSectionId: "bubble-complexity",
      }),
    ],
    examQuestions: [
      question({
        id: "be1",
        question: "Why is bubble sort usually not chosen for large production datasets?",
        options: ["It is O(n^2)", "It cannot sort numbers", "It needs a database", "It only works on strings"],
        correctAnswer: "It is O(n^2)",
        explanation: "Quadratic growth makes it slow as input size increases.",
        relatedSectionId: "bubble-complexity",
      }),
    ],
    analytics: {
      overallProgress: 20,
      materialCompleted: 1,
      totalMaterialSections: 2,
      practiceAccuracy: 50,
      weakAreas: ["Complexity"],
      strongAreas: ["Adjacent comparisons"],
    },
  },
  {
    id: "world-war-ii",
    title: "World War II",
    subject: "History",
    topic: "World War II",
    level: "High School",
    goal: "Deep mastery",
    status: "ready",
    progress: 0,
    createdAt: formatDate(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3)),
    material: {
      overview:
        "This study introduces the causes, major fronts, turning points, and consequences of World War II.",
      sections: [
        {
          id: "wwii-causes",
          title: "Causes and Context",
          content:
            "World War II grew from unresolved tensions after World War I, economic crisis, aggressive expansion, and failures of appeasement.",
          keyPoints: ["Treaty of Versailles", "Great Depression", "Expansionism"],
          completed: false,
        },
        {
          id: "wwii-turning-points",
          title: "Turning Points",
          content:
            "Key turning points include the Battle of Stalingrad, Midway, and D-Day, which shifted momentum toward the Allies.",
          keyPoints: ["Stalingrad", "Midway", "D-Day"],
          completed: false,
        },
      ],
    },
    practiceQuestions: [
      question({
        id: "wp1",
        question: "Which event is commonly considered a turning point in the Pacific?",
        options: ["Battle of Midway", "D-Day", "Treaty of Versailles", "Berlin Airlift"],
        correctAnswer: "Battle of Midway",
        explanation: "Midway shifted naval momentum in the Pacific toward the United States.",
        relatedSectionId: "wwii-turning-points",
      }),
    ],
    examQuestions: [
      question({
        id: "we1",
        question: "Which answer best explains why appeasement failed?",
        options: [
          "It encouraged further aggression instead of stopping it.",
          "It created the United Nations immediately.",
          "It ended all European alliances.",
          "It prevented Germany from rearming.",
        ],
        correctAnswer: "It encouraged further aggression instead of stopping it.",
        explanation: "Appeasement did not stop expansionist ambitions before the war.",
        relatedSectionId: "wwii-causes",
      }),
    ],
    analytics: {
      overallProgress: 0,
      materialCompleted: 0,
      totalMaterialSections: 2,
      practiceAccuracy: 0,
      weakAreas: ["Causes", "Turning points"],
      strongAreas: [],
    },
  },
];

export const getStudies = () => mockStudies;

export const getStudyById = (studyId) =>
  mockStudies.find((study) => study.id === studyId) || null;

export const getStudyPlan = ({
  topic,
  subject = "General",
  level = "Beginner",
  goal = "Understand the topic",
}) => {
  const cleanTopic = String(topic || "").trim() || "Untitled Study";
  const plannedSections = [
    `Foundations of ${cleanTopic}`,
    "Core ideas and vocabulary",
    "Worked examples",
    "Common mistakes",
    "Review and application",
  ];

  return {
    title: cleanTopic,
    subject: subject || "General",
    level: level || "Beginner",
    goal: goal || "Understand the topic",
    estimatedMinutes: 35,
    plannedSections,
    practiceQuestionCount: 8,
    examQuestionCount: 5,
  };
};

export const createMockStudyFromPlan = (plan) => {
  const id = `generated-${slugify(plan?.title)}`;
  const sections = (plan?.plannedSections || []).map((title, index) => ({
    id: `${id}-section-${index + 1}`,
    title,
    content: `${title} gives you a focused explanation for ${plan.title}. This section is generated locally for the frontend prototype and is structured so backend content can replace it later.`,
    keyPoints: [
      `Define the main idea behind ${title.toLowerCase()}.`,
      "Connect the idea to one concrete example.",
      "Check understanding before moving forward.",
    ],
    example: `For ${plan.title}, explain ${title.toLowerCase()} in your own words, then apply it to a short scenario.`,
    completed: false,
  }));

  const practiceQuestions = Array.from({ length: plan?.practiceQuestionCount || 8 }).map(
    (_, index) =>
      question({
        id: `${id}-practice-${index + 1}`,
        question: `Which study move best supports ${plan.title} question ${index + 1}?`,
        options: [
          "Connect the idea to an example",
          "Ignore the explanation",
          "Skip all practice",
          "Memorize only the title",
        ],
        correctAnswer: "Connect the idea to an example",
        explanation:
          "Examples make abstract ideas easier to remember and apply.",
        relatedSectionId: sections[index % sections.length]?.id,
        difficulty: index > 5 ? "hard" : index > 2 ? "medium" : "easy",
      })
  );

  const examQuestions = Array.from({ length: plan?.examQuestionCount || 5 }).map(
    (_, index) =>
      question({
        id: `${id}-exam-${index + 1}`,
        question: `What is the strongest exam strategy for ${plan.title} scenario ${index + 1}?`,
        options: [
          "Identify the concept being tested before choosing",
          "Choose randomly",
          "Avoid reading every option",
          "Leave it blank immediately",
        ],
        correctAnswer: "Identify the concept being tested before choosing",
        explanation:
          "Good exam answers start by recognizing the concept and then applying it carefully.",
        relatedSectionId: sections[index % sections.length]?.id,
      })
  );

  return {
    id,
    title: plan.title,
    subject: plan.subject,
    topic: plan.title,
    level: plan.level,
    goal: plan.goal,
    status: "ready",
    progress: 0,
    createdAt: formatDate(now),
    material: {
      overview: `${plan.title} is organized into a focused Study workspace with material, practice, exam mode, and analytics.`,
      sections,
    },
    practiceQuestions,
    examQuestions,
    analytics: {
      overallProgress: 0,
      materialCompleted: 0,
      totalMaterialSections: sections.length,
      practiceAccuracy: 0,
      weakAreas: sections.slice(0, 2).map((section) => section.title),
      strongAreas: [],
    },
  };
};

export const resolveStudy = (studyId) => {
  const existing = getStudyById(studyId);
  if (existing) return existing;

  if (String(studyId || "").startsWith("generated-")) {
    const title = String(studyId)
      .replace(/^generated-/, "")
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    return createMockStudyFromPlan(
      getStudyPlan({
        topic: title || "Generated Study",
        subject: "General",
        level: "Beginner",
        goal: "Understand the topic",
      })
    );
  }

  return null;
};

export const getGeneratedStudyId = (topic) => `generated-${slugify(topic)}`;
