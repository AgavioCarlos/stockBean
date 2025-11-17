import { useEffect, useState } from "react";
/* import Sidebar from "../components/Layouts/Sidebar"; */
import Header from "../components/Layouts/Header";
import Footer from "../components/Layouts/Footer";
import { FaUserCircle } from "react-icons/fa";
import { consultarPersona } from "../services/Persona";

interface Persona {
    id: number;
    nombre: string;
    email: string;
}

function Perfil(){
    
    const [user, setUser] = useState<{ id: number; nombre: string; email: string } | null>(null);
    const [persona, setPersona] = useState<Persona[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    }, []);

    useEffect(() => {
        consultarPersona()
          .then((data: Persona[]) => {
            setPersona(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error al consultar persona:", error);
            setLoading(false);
          });
      }, []);


    return(
        <div>
            <Header/>
            <div className="p-10">
                <FaUserCircle size={60} />
                <div className="p-15">
                    <h1 className="text-2xl font-bold mb-4">Perfil</h1>
                    {user ? (
                        <div className="space-y-2">
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Nombre:</strong> {user.nombre}</p>
                        <p><strong>Cuenta:</strong> {localStorage.getItem("cuenta")}</p>
                        </div>
                    ) : (
                        <p>No hay datos de usuario en sesión.</p>
                    )}
                </div>
                <p><strong>Cuenta</strong> {persona.email} </p>
                
            </div>
            <Footer />
        </div>
    )
}
export default Perfil;