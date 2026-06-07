import Navbar from "@/components/navbar/nav";
import PageNotFound from "../_components/notfound";

export async function generateMetadata() {
  return {
    title: "Aurify Blog",
    description: "Aurify blog posts are temporarily unavailable.",
  };
}

export async function generateStaticParams() {
  return [];
}

export default function Page() {
  return (
    <div>
      <Navbar />
      <PageNotFound />
    </div>
  );
}
