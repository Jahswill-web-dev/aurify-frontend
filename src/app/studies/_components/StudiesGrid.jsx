"use client";

import StudyCard from "./StudyCard";

function StudiesGrid({ studies = [] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {studies.map((study) => (
        <StudyCard key={study.id} study={study} />
      ))}
    </div>
  );
}

export default StudiesGrid;
