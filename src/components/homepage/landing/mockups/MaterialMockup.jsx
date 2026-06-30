import { FileText } from "lucide-react";

const outline = ["Core concept", "Worked example", "Common mistake"];

function MaterialMockup() {
  return (
    <div className="h-full rounded-md border border-grey-25 bg-white p-4 shadow-card dark:border-dark-border dark:bg-dark-surface dark:shadow-none">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
          <FileText size={20} aria-hidden="true" />
        </div>
        <div>
          <p className="text-h6 font-semibold uppercase text-primary poppins-font">
            Generated material
          </p>
          <h3 className="text-h4 font-bold text-grey-200 poppins-font">
            Notes that stay focused
          </h3>
        </div>
      </div>
      <div className="space-y-3">
        {outline.map((item, index) => (
          <div
            key={item}
            className="rounded-sm border border-grey-25 bg-off-white-100 p-3 dark:border-dark-border dark:bg-dark-bg"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-white text-h6 font-bold text-primary dark:bg-dark-surface-soft dark:text-primary-25">
                {index + 1}
              </span>
              <p className="text-h5 font-semibold text-grey-200 inter-font">
                {item}
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-grey-25 dark:bg-dark-border" />
            <div className="mt-2 h-2 w-4/5 rounded-full bg-grey-25 dark:bg-dark-border" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MaterialMockup;
