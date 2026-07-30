import { Link } from "react-router-dom";
import Container from "./Container";
import Logo from "../../assets/logo.svg";

export const Footer = () => {
  return (
    <footer className="border-t border-[#EAEFF7] bg-white py-10 text-xs font-medium text-[#66789C]">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="JobBox" className="h-7 w-auto" />
            <span>© {new Date().getFullYear()} JobBox Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/" className="hover:text-[#3C65F5] transition">
              Privacy Policy
            </Link>
            <Link to="/" className="hover:text-[#3C65F5] transition">
              Terms of Service
            </Link>
            <Link to="/" className="hover:text-[#3C65F5] transition">
              Security
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
