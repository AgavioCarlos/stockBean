import { useState, useEffect } from "react";
import { consultarPlanes } from "../services/Planes";
import { HiCheckCircle, HiRocketLaunch, HiOutlineInformationCircle } from "react-icons/hi2";
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
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isRegistroModalOpen, setIsRegistroModalOpen] = useState(false);

  useEffect(() => {
    consultarPlanes()
      .then((data: Plan[]) => {
        // Filtrar plan gratuito "Stock Free" (ya asignado por defecto)
        const planesFiltrados = data.filter((plan) => plan.nombre !== "Stock Free");
        setPlanes(planesFiltrados);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al consultar planes:", error);
        setLoading(false);
      });
  }, []);

  const handleProbarPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsRegistroModalOpen(true);
  };

  const handlePaymentSuccess = (plan: Plan, paymentMethod: string) => {
    console.log(`✅ Pago exitoso para plan: ${plan.nombre}, método: ${paymentMethod}`);
    // Implementación futura del backend
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Cargando planes…</p>
      </div>
    );
  }

  return (
    <section className="w-full bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 rounded-3xl shadow-sm border border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight text-wrap-balance">
            Escoge el plan ideal para tu negocio
          </h2>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Impulsa tu inventario con herramientas avanzadas diseñadas para crecer contigo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-stretch">
          {planes.map((plan, index) => {
            const isPopular = plan.nombre.toLowerCase().includes("pro") || index === 1;

            return (
              <article
                key={plan.id_plan}
                className={`flex flex-col relative p-8 bg-white rounded-2xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border ${isPopular
                    ? "ring-2 ring-blue-500 border-transparent shadow-xl"
                    : "border-slate-200 shadow-lg"
                  }`}
              >
                {isPopular && (
                  <span className="absolute top-0 right-8 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Más Popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.nombre}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed min-h-[3rem]">
                    {plan.descripcion}
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900">${plan.precioMensual}</span>
                    <span className="ml-2 text-slate-500 font-medium text-lg">/ mes</span>
                  </div>
                  <div className="mt-2 text-sm text-blue-600 font-semibold flex items-center gap-1">
                    <HiOutlineInformationCircle className="flex-shrink-0" />
                    Pago anual: ${plan.precioAnual}
                  </div>
                </div>

                <div className="flex-grow mb-8 text-slate-700">
                  <p className="font-semibold mb-4 text-slate-900">Incluye:</p>
                  <ul className="space-y-3">
                    {plan.caracteristicas.split(",").map((carac, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <HiCheckCircle
                          className={`flex-shrink-0 w-5 h-5 ${isPopular ? "text-blue-500" : "text-emerald-500"}`}
                          aria-hidden="true"
                        />
                        <span>{carac.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleProbarPlan(plan)}
                  aria-label={`Comenzar prueba del plan ${plan.nombre}`}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 ${isPopular
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-lg"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                >
                  <HiRocketLaunch size={20} aria-hidden="true" />
                  Comenzar prueba
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {/* Modales */}
      <RegistroModal
        isOpen={isRegistroModalOpen}
        onClose={() => setIsRegistroModalOpen(false)}
        selectedPlan={selectedPlan}
      />

      <PaymentGateway
        plan={selectedPlan}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </section>
  );
}

export default Planes;

