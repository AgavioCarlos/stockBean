import  { useEffect, useState } from "react";
import { consultarPersonas } from "../../services/Persona";

interface Persona {
  id_persona: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  status: boolean;
}

function Persona() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    consultarPersonas()
      .then((data: Persona[]) => {
        setPersonas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al consultar personas:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Personas</h1>
      <table className="w-full table-auto border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Email</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((p) => (
            <tr key={p.id_persona} className="text-center border-t">
              <td className="p-2">{p.id_persona}</td>
              <td className="p-2">{p.nombre} {p.apellido_paterno} {p.apellido_materno}</td>
              <td className="p-2">{p.email}</td>
              <td className="p-2">
                <span className={p.status ? "text-green-600 font-semibold" : "text-red-600"}>
                  {p.status ? "Activo" : "Inactivo"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Persona;
