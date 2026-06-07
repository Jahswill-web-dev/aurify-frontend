"use client";

const Tabs = ({ tabs = [], activeTab, onChange, className = "" }) => {
  return (
    <div
      className={[
        "flex items-center border-b border-grey-25 gap-1",
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
              "px-4 py-2.5 text-h5 font-medium cursor-pointer transition-all duration-175 ease-smooth hover:text-primary",
              isActive
                ? "text-primary border-b-2 border-primary -mb-px"
                : "text-grey-100",
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
