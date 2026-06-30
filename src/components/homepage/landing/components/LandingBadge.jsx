function LandingBadge({ children, variant = "default", className = "" }) {
  const styles =
    variant === "primary"
      ? "border-primary bg-accent-100 text-primary-200 dark:border-primary-25 dark:bg-dark-surface-soft dark:text-primary-25"
      : "border-grey-25 bg-white text-p-text-darker dark:border-dark-border dark:bg-dark-surface dark:text-dark-text";

  return (
    <span
      className={[
        "inline-flex items-center rounded-sm border px-3 py-1 text-h6 font-semibold inter-font",
        styles,
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default LandingBadge;
