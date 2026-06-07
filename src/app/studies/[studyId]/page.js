import StudyWorkspaceClient from "./StudyWorkspaceClient";

export default function StudyWorkspacePage({ params }) {
  return <StudyWorkspaceClient studyId={params.studyId} />;
}
