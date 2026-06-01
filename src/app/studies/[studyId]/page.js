import { notFound } from "next/navigation";
import { resolveStudy } from "@/data/mockStudies";
import StudyWorkspaceClient from "./StudyWorkspaceClient";

export default function StudyWorkspacePage({ params }) {
  const study = resolveStudy(params.studyId);

  if (!study) {
    notFound();
  }

  return <StudyWorkspaceClient study={study} />;
}
