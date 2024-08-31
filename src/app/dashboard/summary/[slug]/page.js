import Main from "../../_components/main";
import Summary from "../../_components/summary";

function SubjectNotesPage({ params }) {
  const name = params.slug;
  
  return (
    <Main centerComp={<Summary name={name} />} name="summary" />
)
}

export default SubjectNotesPage;
