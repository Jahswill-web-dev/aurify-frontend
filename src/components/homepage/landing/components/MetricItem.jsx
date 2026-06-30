function MetricItem({ title, text }) {
  return (
    <div className="border-l-2 border-primary pl-3">
      <p className="text-h5 font-bold text-grey-200 poppins-font">{title}</p>
      <p className="mt-1 text-h6 leading-5 text-p-text inter-font">{text}</p>
    </div>
  );
}

export default MetricItem;
