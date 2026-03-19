import { AiFillLinkedin } from "react-icons/ai";

function Footer(){
    return(
        <div>
            <div className="home-container flex items-center justify-center gap-2 py-4 mt-4 border-t border-gray-100">
              <span className="font-semibold text-gray-400 text-xs uppercase tracking-widest">Powered by Baluarte</span>
              <a href="https://www.linkedin.com/in/agaviocarlos"  target="_blank" rel="noopener noreferrer">
                <AiFillLinkedin size={20} className="hover:text-empresa-primario cursor-pointer transition-colors text-gray-300" />
              </a>
            </div>
        </div>
    )
}
export default Footer;