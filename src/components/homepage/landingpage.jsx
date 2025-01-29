import Image from "next/image"
import productImage from "../../../public/images/product-image.png";

function LandingPage() {
  return (
    <div className="poppins-font">
      {/* Hero Section */}
      <div>
        <h1>
          Study Smarter, Not Harder – Everything You Need to Become an A+
          Student!
        </h1>
        <h4>Learn Faster, Retain More—The AI-Powered Tool to Help You Become an A+ Student.</h4>
      <div>
      Get Started
      </div>
      <Image src={productImage} width={924} height={667} alt="product Image"/>
      </div>
    </div>
  );
}

export default LandingPage;
