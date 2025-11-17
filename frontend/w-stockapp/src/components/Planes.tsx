import { useState, useEffect } from "react";
import { consultarPlanes } from "../services/Planes";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

interface Plan {
  id_plan: number;
  nombre: string;
  descripcion: string;
  precioMensual: number;
  precioAnual: number;
  caracteristicas: string; 
}

function Planes() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    consultarPlanes()
      .then((data: Plan[]) => {
        setPlanes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al consultar planes:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Cargando planes...</p>;
  }

  return (
    <div className="w-full bg-white p-8 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-black text-center mb-6">Planes</h1>
      <div className="flex gap-6 justify-center flex-wrap">
        {planes.map((plan) => (
          <div
            key={plan.id_plan}
            className="w-64 h-auto bg-gray-100 hover:bg-blue-200 rounded-lg shadow p-4 flex flex-col items-center"
          >
            <h2 className="text-lg font-semibold mb-2">{plan.nombre}</h2>
            <p className="text-sm mb-2">{plan.descripcion}</p>
            <p className="mb-2">
              <strong>Precio mensual:</strong> ${plan.precioMensual}
            </p>
            <p className="mb-2">
              <strong>Precio anual:</strong> ${plan.precioAnual}
            </p>
            <p>
              <strong>Beneficios:</strong>
              <ul className="list-disc list-inside">
                {plan.caracteristicas.split(",").map((carac, index) => (
                  <li key={index}>{carac.trim()}</li>
                ))}
              </ul>
            </p>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-auto flex items-center justify-center gap-2">
                    <BsArrowUpRightCircleFill size={20} />
                    <span className="font-semibold">Contratar ahora</span>
                </button>
          </div>
        ))} 
      </div>
    </div>
  );
}

export default Planes;
