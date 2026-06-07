const variantClasses = {
  primary: "bg-primary text-white dark:bg-dark-accent dark:text-[#16110a]",
  accent: "bg-accent-100 text-primary-200 dark:bg-dark-surface-soft dark:text-primary-25",
  success: "bg-success-light text-success dark:bg-success/15 dark:text-green-300",
  error: "bg-error-light text-error dark:bg-error/15 dark:text-red-300",
  neutral: "bg-off-white-50 text-grey-100 dark:bg-dark-surface-soft dark:text-dark-muted",
};

const Badge = ({ variant = "neutral", children, className = "" }) => {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-0.5 rounded-xs text-h6 font-medium",
        variantClasses[variant] || variantClasses.neutral,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
};

export default Badge;
