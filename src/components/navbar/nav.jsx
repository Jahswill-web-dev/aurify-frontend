import logo from "../../../public/icons/aurify-logo.svg";
import Image from "next/image";
function Navbar() {
    return ( 
        <nav className="container">
            {/* Logo */}
            <div>
                <Image className="mx-auto mt-2" src={logo} alt="aurify logo" width={100} height={logo} />
            </div>
        </nav>
     );
}

export default Navbar;