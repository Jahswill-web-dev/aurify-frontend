"use client";

import { useEffect, useRef, useState } from "react";

const Dropdown = ({
  options = [],
  value,
  onChange,
  label,
  className = "",
  buttonClassName = "",
  menuClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className={["relative inline-flex flex-col gap-1.5", className]
        .filter(Boolean)
        .join(" ")}
    >
      {label ? (
        <span className="text-h6 font-medium text-p-text-darker poppins-font dark:text-dark-text">
          {label}
        </span>
      ) : null}
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={[
          "flex items-center gap-2 px-3 py-1.5 bg-accent-100 border border-accent-200 rounded-sm text-h5 text-primary-200 font-medium cursor-pointer hover:bg-accent-50 transition-all duration-175 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:border-dark-border dark:bg-dark-surface-soft dark:text-primary-25 dark:hover:border-primary-25 dark:hover:bg-dark-surface dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg",
          buttonClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption?.label || "Select"}</span>
        <span aria-hidden="true">v</span>
      </button>
      {isOpen ? (
        <div
          className={[
            "absolute z-50 top-full mt-1 bg-white rounded-md shadow-modal border border-grey-25 py-1 min-w-40 dark:border-dark-border dark:bg-dark-surface dark:shadow-none",
            menuClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          role="listbox"
        >
          {options.map((option) => {
            const isActive = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
                className={[
                  "block w-full text-left px-4 py-2 text-h5 text-grey-200 cursor-pointer hover:bg-accent-25 hover:text-primary transition-colors duration-175 dark:text-dark-text dark:hover:bg-dark-surface-soft dark:hover:text-primary-25",
                  isActive ? "bg-accent-100 text-primary font-medium dark:bg-dark-surface-soft dark:text-primary-25" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Dropdown;
