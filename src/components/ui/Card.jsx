"use client";

const variantClasses = {
  default:
    "bg-white rounded-md shadow-card border border-grey-25 p-5 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:shadow-none",
  accent:
    "bg-accent-100 rounded-md shadow-panel border border-accent-200 p-5 dark:border-primary-200/40 dark:bg-dark-surface-soft dark:text-dark-text dark:shadow-none",
  flat:
    "bg-off-white-100 rounded-md border border-grey-25 p-4 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text",
};

const Card = ({ variant = "default", children, className = "", onClick, ...props }) => {
  const clickableClasses = onClick
    ? "cursor-pointer hover:shadow-panel transition-shadow duration-175 ease-smooth"
    : "";

  return (
    <div
      {...props}
      onClick={onClick}
      className={[
        variantClasses[variant] || variantClasses.default,
        clickableClasses,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick(event);
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

export default Card;
