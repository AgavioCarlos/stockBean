import { AiFillLinkedin } from "react-icons/ai";

function Footer(){
    return(
        <div>
            <div className="home-container flex items-center justify-center gap-2 mt-4">
              <span className="font-semibold">Made by Agavio</span>
              <a href="https://www.linkedin.com/in/agaviocarlos"  target="_blank" rel="noopener noreferrer">
                <AiFillLinkedin size={25} className="hover:text-blue-500 cursor-pointer" />
              </a>
            </div>
        </div>
    )
}
export default Footer;