import { NextResponse } from "next/server";

const systemPrompt = `You are an expert curriculum designer and tutor.
Given a learning topic, subject, level, and goal, return ONLY a valid JSON object with this structure:

{
  "title": "the topic name",
  "subject": "the subject",
  "level": "the level",
  "goal": "the goal",
  "estimatedMinutes": total estimated minutes as a number,
  "modules": [
    {
      "id": 1,
      "title": "module title",
      "type": "introduction | concept | example | practice | exam",
      "estimatedMinutes": minutes as a number,
      "description": "one sentence describing what this module covers"
    }
  ]
}

Rules:
- Generate between 7 and 12 modules depending on topic complexity
- Always start with an introduction module
- Always end with a practice module and an exam module
- Match depth and complexity to the level provided
- Match content focus to the goal provided
- Return ONLY the JSON object, no explanation, no markdown`;

const getFallbackPath = ({
  topic = "Untitled topic",
  subject = "General",
  level = "Beginner",
  goal = "General learning",
} = {}) => ({
  title: topic || "Untitled topic",
  subject: subject || "General",
  level: level || "Beginner",
  goal: goal || "General learning",
  estimatedMinutes: 5,
  modules: [
    {
      id: 1,
      title: "Introduction",
      type: "introduction",
      estimatedMinutes: 5,
      description: "Start with the core ideas and learning goals for this topic.",
    },
  ],
});

const parseModelText = (content = []) =>
  content
    .filter((block) => block?.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

const normalizePath = (path, fallbackInput) => {
  const fallback = getFallbackPath(fallbackInput);
  const modules = Array.isArray(path?.modules)
    ? path.modules.map((module, index) => ({
        id: Number(module?.id) || index + 1,
        title: module?.title || `Module ${index + 1}`,
        type: module?.type || "concept",
        estimatedMinutes: Number(module?.estimatedMinutes) || 5,
        description:
          module?.description ||
          "Review the key ideas and build confidence with this part of the topic.",
      }))
    : fallback.modules;
  const estimatedMinutes = modules.reduce(
    (sum, module) => sum + module.estimatedMinutes,
    0
  );

  return {
    ...fallback,
    ...path,
    title: path?.title || fallback.title,
    subject: path?.subject || fallback.subject,
    level: path?.level || fallback.level,
    goal: path?.goal || fallback.goal,
    estimatedMinutes,
    modules,
  };
};

export async function POST(request) {
  let setup = {};

  try {
    const body = await request.json();
    setup = {
      topic: String(body?.topic || "").trim(),
      subject: String(body?.subject || "").trim(),
      level: String(body?.level || "").trim(),
      goal: String(body?.goal || "").trim(),
    };

    if (!setup.topic) {
      return NextResponse.json(getFallbackPath(setup), { status: 400 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-20241022",
        max_tokens: 1200,
        temperature: 0.2,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: JSON.stringify(setup),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic request failed with ${response.status}`);
    }

    const data = await response.json();
    const modelText = parseModelText(data.content);
    const parsed = JSON.parse(modelText);

    return NextResponse.json(normalizePath(parsed, setup));
  } catch (error) {
    console.error("Generate path error:", error.message);
    return NextResponse.json(getFallbackPath(setup));
  }
}
