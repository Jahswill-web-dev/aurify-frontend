"use client";
import Main from "./_components/main";
import Pdfs from "./_components/pdfs";
import Loading from "./_components/loading";

function DashboardPage() {
  return <Main comp={<Pdfs />} /> ? (
    <Main comp={<Pdfs />} name="pdf" />
  ) : (
    <Loading />
  );
}

export default DashboardPage;
