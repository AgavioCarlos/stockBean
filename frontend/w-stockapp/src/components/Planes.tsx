import { useState, useEffect } from "react";
import { consultarPlanes } from "../services/Planes";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import PaymentGateway from "./PaymentGateway"; // Pasarela de pago (para futuro)
import RegistroModal from "./RegistroModal"; // Modal de registro

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

  // Estados para modales
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // Para futuro: cuando expiren pruebas
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false); // Para nuevos usuarios

  useEffect(() => {
    consultarPlanes()
      .then((data: Plan[]) => {
        // Filtrar plan gratuito "Stock Free" (ya asignado por defecto)
        const planesFiltrados = data.filter((plan) => plan.nombre !== "Stock Free");
        console.log("Planes filtrados:", planesFiltrados);
        setPlanes(planesFiltrados);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al consultar planes:", error);
        setLoading(false);
      });
  }, []);

  /**
   * Manejar clic en "Probar Ahora"
   * Abre el modal de registro para nuevos usuarios
   */
  const handleProbarPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsRegistroModalOpen(true);
  };

  /**
   * FUTURO: Manejar contratación de plan
   * Se usará cuando el usuario quiera upgradearde plan o renovar
   */
  const handleContratarPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsPaymentModalOpen(true);
  };

  /**
   * Callback cuando el pago es exitoso (FUTURO)
   * Aquí se activará la suscripción en el backend
   */
  const handlePaymentSuccess = (plan: Plan, paymentMethod: string) => {
    console.log(`✅ Pago exitoso para plan: ${plan.nombre}, método: ${paymentMethod}`);

    // TODO: Llamar al backend para activar la suscripción
    // activarSuscripcion(plan.id_plan, paymentMethod)
    //   .then(() => console.log('Suscripción activada'))
    //   .catch(err => console.error('Error al activar suscripción:', err));
  };

  if (loading) {
    return <p className="text-center mt-10">Cargando planes...</p>;
  }

  return (
    <>
      <div className="w-full bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-black text-center mb-6">Planes</h1>
        <div className="flex gap-6 justify-center flex-wrap">
          {planes.map((plan) => (
            <div
              key={plan.id_plan}
              className="w-64 h-auto bg-gray-100 hover:bg-blue-200 rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-lg"
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

              {/* Botón para abrir modal de registro */}
              <button
                onClick={() => handleProbarPlan(plan)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-auto flex items-center justify-center gap-2 transition-colors"
              >
                <BsArrowUpRightCircleFill size={20} />
                <span className="font-semibold">Probar Ahora</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Registro (para nuevos usuarios) */}
      <RegistroModal
        isOpen={isRegistroModalOpen}
        onClose={() => setIsRegistroModalOpen(false)}
        selectedPlan={selectedPlan}
      />

      {/* Modal de Pasarela de Pago (para futuro: renovaciones/upgrades) */}
      <PaymentGateway
        plan={selectedPlan}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}

export default Planes;
