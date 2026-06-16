import { BookOpen, RefreshCw, RotateCcw } from "lucide-react";
import { Badge, Button, Card, LoadingExperience } from "@/components/ui";
import { glossaryReadyStatuses, glossaryRegenerableStatuses } from "./constants";

export function GlossaryTab({
  study,
  glossary,
  loading,
  error,
  onRetry,
  onResume,
  resumeLoading,
  onRegenerate,
  regenerateLoading,
}) {
  const isReady = glossaryReadyStatuses.has(study?.status);
  const terms = Array.isArray(glossary?.terms) ? glossary.terms : [];
  const isFailed = study?.status === "failed";
  const canGenerateGlossary = glossaryRegenerableStatuses.has(study?.status);
  const glossaryActionLabel =
    study?.status === "material_ready" ? "Generate Glossary" : "Regenerate Glossary";

  if (!isReady) {
    return (
      <Card variant="default" className="mx-auto max-w-[720px] p-6 text-center">
        <BookOpen className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
        <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
          Glossary is not ready yet
        </h2>
        <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
          Key terms will appear here after the backend finishes generating the glossary.
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="md" onClick={onRetry}>
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </Button>
          {canGenerateGlossary ? (
            <Button
              variant="ghost"
              size="md"
              loading={regenerateLoading}
              onClick={onRegenerate}
            >
              <RotateCcw size={16} aria-hidden="true" />
              {glossaryActionLabel}
            </Button>
          ) : null}
          {isFailed ? (
            <Button
              variant="ghost"
              size="md"
              loading={resumeLoading}
              onClick={onResume}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Resume Generation
            </Button>
          ) : null}
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <LoadingExperience
        variant="panel"
        title="Loading glossary"
        message="Organizing key terms and definitions for this Study."
      />
    );
  }

  if (error || !terms.length) {
    return (
      <Card variant="default" className="mx-auto max-w-[720px] p-6 text-center">
        <BookOpen className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
        <h2 className="mt-3 text-h3 font-semibold text-grey-200 poppins-font">
          Glossary terms are not available
        </h2>
        <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
          {error || "The backend marked the glossary ready, but no terms were returned."}
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <Button variant="primary" size="md" onClick={onRetry}>
            <RefreshCw size={16} aria-hidden="true" />
            Refresh
          </Button>
          {canGenerateGlossary ? (
            <Button
              variant="ghost"
              size="md"
              loading={regenerateLoading}
              onClick={onRegenerate}
            >
              <RotateCcw size={16} aria-hidden="true" />
              {glossaryActionLabel}
            </Button>
          ) : null}
          {isFailed ? (
            <Button
              variant="ghost"
              size="md"
              loading={resumeLoading}
              onClick={onResume}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Resume Generation
            </Button>
          ) : null}
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-5">
      <Card variant="default" className="p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-h6 font-semibold uppercase text-primary poppins-font">
              Terms to know
            </p>
            <h2 className="mt-1 text-h2 font-bold text-grey-200 poppins-font">
              {terms.length} glossary terms
            </h2>
            {glossary?.source_notes ? (
              <p className="mt-2 text-h5 leading-7 text-p-text-darker inter-font">
                {glossary.source_notes}
              </p>
            ) : null}
          </div>
          <Badge variant="primary">Glossary ready</Badge>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {terms.map((item, index) => (
          <Card
            key={`${item.term || "term"}-${index}`}
            variant="default"
            className="p-5"
          >
            <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
              <h3 className="text-h3 font-semibold leading-tight text-grey-200 poppins-font">
                {item.term || "Untitled term"}
              </h3>
              {item.difficulty ? <Badge variant="accent">{item.difficulty}</Badge> : null}
            </div>
            <p className="text-h5 leading-7 text-p-text-darker inter-font">
              {item.definition || "No definition was provided."}
            </p>
            {item.simple_explanation ? (
              <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
                <span className="font-semibold text-grey-200">Plain English:</span>{" "}
                {item.simple_explanation}
              </p>
            ) : null}
            {item.analogy ? (
              <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
                <span className="font-semibold text-grey-200">Analogy:</span>{" "}
                {item.analogy}
              </p>
            ) : null}
            {item.why_it_matters ? (
              <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
                <span className="font-semibold text-grey-200">Why it matters:</span>{" "}
                {item.why_it_matters}
              </p>
            ) : null}
            {item.section ? (
              <div className="mt-4">
                <Badge variant="neutral">{item.section}</Badge>
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </div>
  );
}
