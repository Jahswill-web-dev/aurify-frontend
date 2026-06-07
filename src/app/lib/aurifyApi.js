"use client";

import Cookies from "js-cookie";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_AURIFY_BASE_URL || "http://localhost:8000";

const getAccessToken = () => Cookies.get("accessToken");

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

const getErrorMessage = (payload, fallback) => {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (typeof payload.detail === "string") return payload.detail;
  if (typeof payload.message === "string") return payload.message;
  if (Array.isArray(payload.detail)) {
    return payload.detail
      .map((item) => item?.msg || item?.message)
      .filter(Boolean)
      .join(", ");
  }

  return fallback;
};

const parseResponsePayload = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text || null;
};

export async function apiRequest(path, options = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const payload = await parseResponsePayload(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload, "Something went wrong. Please try again."),
      response.status,
      payload
    );
  }

  return payload;
}

export const listStudies = () => apiRequest("/studies");
export const getStudy = (studyId) => apiRequest(`/studies/${studyId}`);
export const getStudyMaterial = (studyId) =>
  apiRequest(`/studies/${studyId}/material`);
export const getPracticeQuestions = (studyId) =>
  apiRequest(`/studies/${studyId}/practice-questions`);
export const getExamQuestions = (studyId) =>
  apiRequest(`/studies/${studyId}/exam-questions`);
export const resumeStudyGeneration = (studyId) =>
  apiRequest(`/studies/${studyId}/generation/resume`, { method: "POST" });
export const createStudy = (payload) =>
  apiRequest("/studies", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const submitPracticeAttempt = (studyId, answers) =>
  apiRequest(`/studies/${studyId}/practice-attempts`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });

const parseSsePayload = (raw) => {
  const events = [];
  let eventName = "message";
  const dataLines = [];

  const flush = () => {
    if (!dataLines.length && eventName === "message") return;

    const rawData = dataLines.join("\n");
    let data = rawData;

    if (rawData) {
      try {
        data = JSON.parse(rawData);
      } catch {
        data = rawData;
      }
    } else {
      data = {};
    }

    events.push({ event: eventName, data });
    eventName = "message";
    dataLines.length = 0;
  };

  raw.split(/\r?\n/).forEach((line) => {
    if (!line.trim()) {
      flush();
      return;
    }

    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim();
    }

    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trimStart());
    }
  });

  flush();
  return events;
};

export async function parseStudyInput({ input, clarification }) {
  const response = await fetch(`${API_BASE_URL}/api/parse-input`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input,
      ...(clarification ? { clarification } : {}),
    }),
  });

  const raw = await response.text();

  if (!response.ok) {
    throw new ApiError(
      raw || "The parser could not read this prompt. Please try again.",
      response.status,
      raw
    );
  }

  const events = parseSsePayload(raw);
  const errorEvent = events.find((item) => item.event === "error");

  if (errorEvent) {
    throw new ApiError(
      getErrorMessage(errorEvent.data, "The parser could not read this prompt."),
      response.status,
      errorEvent.data
    );
  }

  const clarificationEvent = events.find((item) => item.event === "clarification");
  if (clarificationEvent) return { type: "clarification", data: clarificationEvent.data };

  const readyEvent = events.find((item) => item.event === "ready");
  if (readyEvent) return { type: "ready", data: readyEvent.data };

  throw new ApiError("The parser finished without returning Study details.", 200, events);
}
