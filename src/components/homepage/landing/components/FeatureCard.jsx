function FeatureCard({ feature }) {
  const Icon = feature.icon;

  return (
    <article className="rounded-md border border-grey-25 bg-white p-5 shadow-card transition-all duration-175 ease-smooth hover:-translate-y-1 hover:border-primary hover:shadow-panel dark:border-dark-border dark:bg-dark-surface dark:shadow-none dark:hover:border-primary-25">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-sm bg-accent-100 text-primary dark:bg-dark-surface-soft dark:text-primary-25">
        <Icon size={22} aria-hidden="true" />
      </div>
      <h3 className="text-h4 font-bold text-grey-200 poppins-font">
        {feature.title}
      </h3>
      <p className="mt-3 text-h5 leading-7 text-p-text-darker inter-font">
        {feature.description}
      </p>
    </article>
  );
}

export default FeatureCard;
