import { audienceCards } from "../data";
import MotionSection from "../components/MotionSection";

function AudienceSection() {
  return (
    <MotionSection className="border-y border-grey-25 py-10 dark:border-dark-border">
      <div className="grid gap-4 md:grid-cols-3">
        {audienceCards.map((audience) => {
          const Icon = audience.icon;

          return (
            <article
              key={audience.title}
              className="rounded-md border border-grey-25 bg-white p-5 shadow-card transition-all duration-175 ease-smooth hover:border-primary dark:border-dark-border dark:bg-dark-surface dark:shadow-none dark:hover:border-primary-25"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-sm bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
                <Icon size={22} aria-hidden="true" />
              </div>
              <h2 className="text-h4 font-bold text-grey-200 poppins-font">
                {audience.title}
              </h2>
              <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
                {audience.description}
              </p>
            </article>
          );
        })}
      </div>
    </MotionSection>
  );
}

export default AudienceSection;
