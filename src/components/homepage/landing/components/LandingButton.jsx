import Link from "next/link";
import { ArrowRight } from "lucide-react";

const variants = {
  primary:
    "bg-primary text-white shadow-btn-primary hover:bg-primary-200 dark:bg-dark-accent dark:text-[#16110a] dark:shadow-none dark:hover:bg-primary-25",
  secondary:
    "border border-primary text-primary hover:bg-accent-25 dark:border-primary-25 dark:text-primary-25 dark:hover:bg-dark-surface-soft",
};

function LandingButton({ href, children, variant = "primary" }) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-h5 font-semibold transition-all duration-175 ease-smooth focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-primary-25 dark:focus:ring-offset-dark-bg",
        variants[variant],
      ].join(" ")}
    >
      {children}
      {variant === "primary" ? <ArrowRight size={18} aria-hidden="true" /> : null}
    </Link>
  );
}

export default LandingButton;
