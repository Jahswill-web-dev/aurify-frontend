"use client";

const Tabs = ({ tabs = [], activeTab, onChange, className = "" }) => {
  return (
    <div
      className={[
        "flex items-center border-b border-grey-25 gap-1 dark:border-dark-border",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(tab.id)}
            className={[
              "px-4 py-2.5 text-h5 font-medium cursor-pointer transition-all duration-175 ease-smooth hover:text-primary dark:hover:text-primary-25",
              isActive
                ? "text-primary border-b-2 border-primary -mb-px dark:border-primary-25 dark:text-primary-25"
                : "text-grey-100 dark:text-dark-muted",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
