"use client";
import Dashboard from "./_components/dashboard";
import Pdfs from "./_components/pdfs";
import Loading from "./_components/loading";

function DashboardPage() {
  return <Dashboard comp={<Pdfs />} /> ? (
    <Dashboard comp={<Pdfs />} name="pdf" />
  ) : (
    <Loading />
  );
}

export default DashboardPage;
