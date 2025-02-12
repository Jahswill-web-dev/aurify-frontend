import Dashboard from "../../_components/dashboard";
import Summary from "../../_components/summary";

function SubjectNotesPage({ params }) {
  const slug = params.slug;

  return (
    <div>

      <Dashboard comp={<Summary slug={slug} />} name="summary" />
    </div>
  );
}

export default SubjectNotesPage;
