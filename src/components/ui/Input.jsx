"use client";

import { forwardRef } from "react";

const Input = forwardRef(function Input({
  variant = "default",
  placeholder = "",
  value,
  onChange,
  label,
  error,
  disabled = false,
  className = "",
  rows = 3,
}, ref) {
  const inputClasses = [
    "w-full bg-off-white-100 border rounded-sm px-4 py-2.5 text-h5 text-grey-200 placeholder:text-grey-100 outline-none transition-all duration-175 ease-smooth focus:border-primary focus:shadow-input-focus dark:bg-dark-surface dark:text-dark-text dark:placeholder:text-dark-muted dark:focus:border-primary-25 dark:focus:shadow-none",
    error ? "border-error" : "border-grey-25",
    disabled ? "opacity-50 cursor-not-allowed bg-off-white-50" : "",
    variant === "textarea" ? "resize-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className="flex flex-col gap-1.5">
      {label ? (
        <span className="text-h6 font-medium text-p-text-darker poppins-font dark:text-dark-text">
          {label}
        </span>
      ) : null}
      {variant === "textarea" ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
          ref={ref}
          className={inputClasses}
        />
      ) : (
        <input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          ref={ref}
          className={inputClasses}
        />
      )}
      {error ? <span className="text-h6 text-error">{error}</span> : null}
    </label>
  );
});

export default Input;
