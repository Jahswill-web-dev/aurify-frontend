import LandingBadge from "./LandingBadge";

function SectionHeading({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="mx-auto max-w-[780px] text-center">
      <LandingBadge variant="primary" className="mb-4 gap-2 uppercase">
        {Icon ? <Icon size={16} aria-hidden="true" /> : null}
        {eyebrow}
      </LandingBadge>
      <h2 className="text-h2 font-bold leading-tight text-grey-200 poppins-font sm:text-xl-head">
        {title}
      </h2>
      <p className="mt-4 text-h5 leading-7 text-p-text-darker inter-font">
        {description}
      </p>
    </div>
  );
}

export default SectionHeading;
