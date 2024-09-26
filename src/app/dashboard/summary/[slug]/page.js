import Main from "../../_components/main";
import Summary from "../../_components/summary";

function SubjectNotesPage({ params }) {
  const slug = params.slug;
  
  return (
    <Main comp={<Summary slug={slug} />} name="summary" />
)
}

export default SubjectNotesPage;
