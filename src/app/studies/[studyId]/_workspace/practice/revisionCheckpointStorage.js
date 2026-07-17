const storageKey = (studyId) => `aurify:revision-checkpoint-skips:${studyId}`;

const readAll = (studyId) => {
  if (typeof window === "undefined" || !studyId) return {};

  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey(studyId)) || "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const readRevisionCheckpointSkips = (studyId) => readAll(studyId);

export const saveRevisionCheckpointSkip = (studyId, checkpointId) => {
  if (typeof window === "undefined" || !studyId || !checkpointId) return;

  try {
    window.localStorage.setItem(
      storageKey(studyId),
      JSON.stringify({ ...readAll(studyId), [checkpointId]: true })
    );
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
};
