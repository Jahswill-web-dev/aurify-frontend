import Navbar from "@/components/navbar/nav";

export const metadata = {
  title: "Aurify Blog",
  description: "Aurify blog posts are temporarily unavailable.",
};

export default function BlogPage() {
  return (
    <div>
      <Navbar />
      <main className="container">
        <section className="mx-auto my-20 max-w-2xl rounded-md border border-grey-25 bg-white px-6 py-12 text-center shadow-card">
          <p className="mb-3 text-h6 font-medium uppercase text-primary inter-font">
            Blog temporarily unavailable
          </p>
          <h1 className="text-x-head font-bold text-primary roboto-font md:text-l-head">
            The Aurify Blog
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-7 text-p-text inter-font">
            We are pausing blog content while our publishing server is offline.
            Please check back later.
          </p>
        </section>
      </main>
    </div>
  );
}
