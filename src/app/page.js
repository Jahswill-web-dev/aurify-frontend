// import Navbar from "@/components/navbar/nav";
import Navbar from "@/components/navbar/nav";
import WaitList from "@/components/waitlist/waitlist";
export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="container">
        <WaitList />
      </main>
    </div>
  );
}
