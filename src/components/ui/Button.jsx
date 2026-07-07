"use client";

import Spinner from "./Spinner";

const variantClasses = {
  primary:
    "bg-primary text-white rounded-sm shadow-btn-primary hover:bg-primary-200 active:bg-primary-200 transition-all duration-175 ease-smooth dark:bg-dark-accent dark:text-[#16110a] dark:shadow-none dark:hover:bg-primary-25 dark:active:bg-primary-25",
  secondary:
    "bg-accent-100 text-primary-200 rounded-sm hover:bg-accent-50 transition-all duration-175 ease-smooth dark:border dark:border-dark-border dark:bg-dark-surface-soft dark:text-primary-25 dark:hover:border-primary-25 dark:hover:bg-dark-surface",
  ghost:
    "bg-transparent border border-primary text-primary rounded-sm hover:bg-accent-25 transition-all duration-175 ease-smooth dark:border-primary-25 dark:text-primary-25 dark:hover:bg-dark-surface-soft",
  destructive:
    "bg-error text-white rounded-sm hover:bg-error/90 active:bg-error/90 transition-all duration-175 ease-smooth dark:bg-error dark:text-white dark:hover:bg-error/90 dark:active:bg-error/90",
  destructiveGhost:
    "bg-transparent border border-error/40 text-error rounded-sm hover:bg-error-light hover:text-error transition-all duration-175 ease-smooth dark:border-error/50 dark:text-red-300 dark:hover:bg-error/15 dark:hover:text-red-200",
  dangerSubtle:
    "bg-transparent border border-grey-25 text-p-text rounded-sm hover:border-error/40 hover:bg-error-light hover:text-error transition-all duration-175 ease-smooth dark:border-dark-border dark:text-dark-muted dark:hover:border-error/50 dark:hover:bg-error/15 dark:hover:text-red-300",
  text:
    "bg-transparent text-primary underline-offset-2 hover:underline text-h5 transition-all duration-175 dark:text-primary-25",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-h6 font-medium",
  md: "px-4 py-2 text-h5 font-medium",
  lg: "px-6 py-3 text-h4 font-semibold",
};

const Button = ({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  children,
  className = "",
  type = "button",
  ...buttonProps
}) => {
  const isDisabled = disabled || loading;
  const spinnerColor =
    variant === "primary" || variant === "destructive" ? "white" : "orange";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      {...buttonProps}
      className={[
        "inline-flex items-center justify-center gap-2 whitespace-nowrap",
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg",
        isDisabled ? "opacity-50 cursor-not-allowed" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? <Spinner size="sm" color={spinnerColor} /> : null}
      {children}
    </button>
  );
};

export default Button;
