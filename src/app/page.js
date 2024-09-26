// import Navbar from "@/components/navbar/nav";
import HomePage from "@/components/homepage/homepage";
import Navbar from "@/components/navbar/nav";
import WaitList from "@/components/waitlist/waitlist";
export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="container">
        {/* <WaitList /> */}
        <HomePage/>
      </main>
    </div>
  );
}
