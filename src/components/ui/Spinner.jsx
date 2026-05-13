const sizeClasses = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-8 h-8 border-[3px]",
};

const colorClasses = {
  orange: "border-primary border-t-transparent",
  white: "border-white border-t-transparent",
  grey: "border-grey-25 border-t-grey-100",
};

const Spinner = ({ size = "md", color = "orange", className = "" }) => {
  return (
    <span
      className={[
        "inline-block rounded-full animate-spin",
        sizeClasses[size] || sizeClasses.md,
        colorClasses[color] || colorClasses.orange,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Loading"
      role="status"
    />
  );
};

export default Spinner;
