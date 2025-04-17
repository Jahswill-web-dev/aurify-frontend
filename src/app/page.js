// import Navbar from "@/components/navbar/nav";
import Footer from "@/components/footer/footer";
import HomePage from "@/components/homepage/homepage";
import LandingPage from "@/components/homepage/landingpage";
import Navbar from "@/components/navbar/nav";
import WaitList from "@/components/waitlist/waitlist";
export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="container">
        {/* <HomePage/> */}
        <LandingPage />
      </main>
      <Footer />
    </div>
  );
}
