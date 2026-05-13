const variantClasses = {
  primary: "bg-primary text-white",
  accent: "bg-accent-100 text-primary-200",
  success: "bg-success-light text-success",
  error: "bg-error-light text-error",
  neutral: "bg-off-white-50 text-grey-100",
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
