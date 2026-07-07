"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const focusableSelector =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousActiveElement = document.activeElement;
    const focusableElements =
      panelRef.current?.querySelectorAll(focusableSelector) || [];

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      panelRef.current?.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
        return;
      }

      if (event.key !== "Tab" || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center transition-opacity duration-250"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
        className={[
          "relative bg-white rounded-lg shadow-modal p-6 w-full max-w-md mx-4 transition-transform duration-250 ease-bounce-in dark:border dark:border-dark-border dark:bg-dark-surface dark:text-dark-text dark:shadow-none",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-md border border-transparent text-grey-100 transition-colors duration-175 hover:border-grey-25 hover:bg-off-white-100 hover:text-grey-200 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:text-dark-muted dark:hover:border-dark-border dark:hover:bg-dark-surface-soft dark:hover:text-dark-text"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
        {title ? (
          <h2 className="text-h3 font-semibold text-grey-200 poppins-font mb-4 pr-8 dark:text-dark-text">
            {title}
          </h2>
        ) : null}
        {children}
      </div>
    </div>
  );
};

export default Modal;
