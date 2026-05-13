import { NextResponse } from "next/server";

const fallbackOptions = [
  "Beginner",
  "High School",
  "University",
  "Advanced",
  "Not sure? Start beginner",
];

const getFallbackParse = (input) => ({
  topic: input || "Untitled topic",
  subject: "General",
  level: null,
  goal: null,
  specificity: "broad",
  needsClarification: true,
  clarificationQuestion: "What level should I teach this at?",
  clarificationOptions: fallbackOptions,
  confidence: "low",
});

const systemPrompt = `You are an AI that extracts learning intent from user input.
Given a user's learning request, return ONLY a valid JSON object with these fields:

{
  "topic": "the specific topic",
  "subject": "the academic subject",
  "level": "the education level or null if unknown",
  "goal": "the learning goal or null if not stated",
  "specificity": "specific | broad",
  "needsClarification": true | false,
  "clarificationQuestion": "one short question to ask if needsClarification is true, otherwise null",
  "clarificationOptions": ["option1", "option2", ...] or null,
  "confidence": "high | medium | low"
}

Rules:
- If level is clearly stated, set needsClarification to false
- If topic is broad and level is unknown, set needsClarification to true
- clarificationQuestion should be one short sentence maximum
- clarificationOptions should be 4 to 5 short label strings maximum
- Always include a "Not sure? Start beginner" as the last clarification option
- Return ONLY the JSON object, no explanation, no markdown`;

const parseModelText = (content = []) =>
  content
    .filter((block) => block?.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

export async function POST(request) {
  const { input = "" } = await request.json();
  const cleanedInput = String(input).trim();

  if (!cleanedInput) {
    return NextResponse.json(getFallbackParse(cleanedInput), { status: 400 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-20241022",
        max_tokens: 600,
        temperature: 0,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: cleanedInput,
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

    return NextResponse.json({
      ...getFallbackParse(cleanedInput),
      ...parsed,
    });
  } catch (error) {
    console.error("Parse topic error:", error.message);
    return NextResponse.json(getFallbackParse(cleanedInput));
  }
}
