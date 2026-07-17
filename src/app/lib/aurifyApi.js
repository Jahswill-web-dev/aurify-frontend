"use client";

import Cookies from "js-cookie";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_AURIFY_BASE_URL || "http://localhost:8000";

export const getAccessToken = () => Cookies.get("accessToken");

export const hasAccessToken = () => Boolean(getAccessToken());

export const clearAuthCookies = () => {
  Cookies.remove("accessToken", { path: "/" });
  Cookies.remove("refreshToken", { path: "/" });
};

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export class AuthRequiredError extends ApiError {
  constructor(message = "Please log in to continue.") {
    super(message, 401, null);
    this.name = "AuthRequiredError";
  }
}

export const isAuthError = (error) =>
  error?.status === 401 || error?.status === 403;

const userFacingStatusMessages = {
  400: "We could not complete that request. Please check your input and try again.",
  408: "The request took too long. Please try again.",
  409: "That request could not be completed right now. Please refresh and try again.",
  413: "That request is too large. Please reduce it and try again.",
  422: "We could not process that request. Please check your input and try again.",
  429: "Too many requests were sent at once. Please wait a moment and try again.",
  500: "Something went wrong on our side. Please try again in a moment.",
  502: "The generation service is temporarily unavailable. Please try again in a moment.",
  503: "The generation service is temporarily unavailable. Please try again in a moment.",
  504: "The request took too long. Please try again in a moment.",
};

export const getUserFacingError = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  if (isAuthError(error)) return "Please log in to continue.";

  const status = Number(error?.status);
  if (status && userFacingStatusMessages[status]) {
    return userFacingStatusMessages[status];
  }

  if (error instanceof TypeError) {
    return "We could not reach Aurify right now. Please check your connection and try again.";
  }

  return fallback;
};

export const getGenerationFailureMessage = () =>
  "Generation stopped before Aurify could finish this Study. You can resume generation or try again in a moment.";

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
  const text = await response.text();

  if (!text) return null;

  if (contentType.includes("application/json")) {
    return JSON.parse(text);
  }

  return text;
};

export async function apiRequest(path, options = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers);
  const requireAuth = options.requireAuth ?? true;

  if (requireAuth && !token) {
    throw new AuthRequiredError();
  }

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const fetchOptions = { ...options };
  delete fetchOptions.requireAuth;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });
  const payload = await parseResponsePayload(response);

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearAuthCookies();
    }

    throw new ApiError(
      getErrorMessage(payload, "Something went wrong. Please try again."),
      response.status,
      payload
    );
  }

  return payload;
}

export const listStudies = () => apiRequest("/studies");
export const getCurrentUser = () => apiRequest("/me");
export const getStudy = (studyId) => apiRequest(`/studies/${studyId}`);
export const deleteStudy = async (studyId) => {
  const payload = await apiRequest(`/studies/${studyId}`, { method: "DELETE" });

  if (
    payload &&
    typeof payload === "object" &&
    Object.prototype.hasOwnProperty.call(payload, "deleted") &&
    payload.deleted !== true
  ) {
    throw new ApiError("The Study was not deleted. Please try again.", 500, payload);
  }

  return payload;
};
export const getStudyResearchContext = (studyId) =>
  apiRequest(`/studies/${studyId}/research-context`);
export const getStudyOutline = (studyId) =>
  apiRequest(`/studies/${studyId}/outline`);
export const getStudyMaterial = (studyId) =>
  apiRequest(`/studies/${studyId}/material`);
export const getStudyProgress = (studyId) =>
  apiRequest(`/studies/${studyId}/progress`);
export const completeLesson = (studyId, lessonId) =>
  apiRequest(`/studies/${studyId}/lessons/${lessonId}/complete`, {
    method: "POST",
  });
export const submitLessonPracticeAttempt = (studyId, lessonId, payload) =>
  apiRequest(`/studies/${studyId}/lessons/${lessonId}/practice-attempt`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const getLessonRevisionPractice = (studyId, lessonId) =>
  apiRequest(`/studies/${studyId}/lessons/${lessonId}/revision-practice`);
export const generateLessonRevisionPractice = (studyId, lessonId) =>
  apiRequest(
    `/studies/${studyId}/lessons/${lessonId}/revision-practice/generate`,
    { method: "POST" }
  );
export const submitLessonRevisionPracticeAttempt = (
  studyId,
  lessonId,
  payload
) =>
  apiRequest(
    `/studies/${studyId}/lessons/${lessonId}/revision-practice-attempt`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
export const getStudyGlossary = (studyId) =>
  apiRequest(`/studies/${studyId}/glossary`);
export const getPracticeQuestions = (studyId) =>
  apiRequest(`/studies/${studyId}/practice-questions`);
export const getExamQuestions = (studyId) =>
  apiRequest(`/studies/${studyId}/exam-questions`);
export const resumeStudyGeneration = (studyId) =>
  apiRequest(`/studies/${studyId}/generation/resume`, { method: "POST" });
export const regenerateStudyGlossary = (studyId) =>
  resumeStudyGeneration(studyId);
export const generateStudyOutline = (studyId) =>
  apiRequest(`/studies/${studyId}/outline/generate`, { method: "POST" });
export const generateStudyMaterial = (studyId) =>
  apiRequest(`/studies/${studyId}/material/generate`, { method: "POST" });
export const createStudy = (payload) =>
  apiRequest("/studies", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const listPracticeQuestionSets = (studyId) =>
  apiRequest(`/studies/${studyId}/practice-question-sets`);
export const generatePracticeQuestionSet = (studyId, payload = {}) =>
  apiRequest(`/studies/${studyId}/practice-question-sets/generate`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const getPracticeQuestionSetQuestions = (studyId, questionSetId) =>
  apiRequest(
    `/studies/${studyId}/practice-question-sets/${questionSetId}/questions`
  );
export const listExamQuestionSets = (studyId) =>
  apiRequest(`/studies/${studyId}/exam-question-sets`);
export const generateExamQuestionSet = (studyId, payload = {}) =>
  apiRequest(`/studies/${studyId}/exam-question-sets/generate`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const getExamQuestionSetQuestions = (studyId, questionSetId) =>
  apiRequest(`/studies/${studyId}/exam-question-sets/${questionSetId}/questions`);
export const submitPracticeAttempt = (studyId, answers) =>
  apiRequest(`/studies/${studyId}/practice-attempts`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
export const submitExamAttempt = (studyId, answers) =>
  apiRequest(`/studies/${studyId}/exam-attempts`, {
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
