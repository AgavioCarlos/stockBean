import React, { useEffect, useState } from "react";
import { consultarPersonas } from "../../services/Persona";
import MainLayout from "../../components/Layouts/MainLayout";
import Tabs, { TabItem } from "../../components/Tabs";
import { IoMdList, IoMdAddCircle } from "react-icons/io";
import { MdDescription } from "react-icons/md";
import { useAlerts } from "../../hooks/useAlerts";
import PersonaTable from "../../components/PersonaTable";
import PersonaDetalle from "../../components/PersonaDetalle";

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
  const [vista, setVista] = useState("lista");
  const { success, error: showError } = useAlerts();

  // Filter state
  const [rowDataFiltrada, setRowDataFiltrada] = useState<Persona[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState(true);

  // Selection/Form state
  const [personaSeleccionada, setPersonaSeleccionada] = useState<Persona | null>(null);
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(true);

  useEffect(() => {
    cargarPersonas();
  }, []);

  /* 
    Updated to fetch personas based on current user's role/company
  */
  const cargarPersonas = () => {
    setLoading(true);
    consultarPersonas()
      .then((data: Persona[]) => {
        setPersonas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al consultar personas:", error);
        setLoading(false);
      });
  };

  // Filter logic
  useEffect(() => {
    let datos = personas;
    if (busqueda.trim() !== "") {
      datos = datos.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.apellido_paterno.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.email.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    datos = datos.filter(p => p.status === filtroEstado);
    setRowDataFiltrada(datos);
  }, [busqueda, filtroEstado, personas]);


  const handleBuscar = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const handleFiltrarEstado = (valor: string) => {
    setFiltroEstado(valor === "true");
  };

  const handleRowClick = (event: any) => {
    const p = event.data;
    setPersonaSeleccionada(p);
    setNombre(p.nombre ?? "");
    setApellidoPaterno(p.apellido_paterno ?? "");
    setApellidoMaterno(p.apellido_materno ?? "");
    setEmail(p.email ?? "");
    setStatus(p.status);
    setVista("detalle");
  };

  const nuevoDesdeDetalle = () => {
    setPersonaSeleccionada(null);
    setNombre("");
    setApellidoPaterno("");
    setApellidoMaterno("");
    setEmail("");
    setStatus(true);
    setVista("detalle");
  };

  const handleDelete = async (id: number, newStatus: boolean = false) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/personas/${id}`, {
        method: 'PUT', // Assuming PUT for soft-delete/status update or DELETE if hard delete. 
        // Based on prompt "de acuerdo a su endPoint", user showed Controller.
        // Controller has update at PUT /{id} and delete at DELETE /{id}.
        // Usually status toggle is an update.
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...personas.find(p => p.id_persona === id),
          status: newStatus
        })
      });

      if (res.ok) {
        setPersonas(prev => prev.map(p => p.id_persona === id ? { ...p, status: newStatus } : p));
        success(
          newStatus ? 'Reactivado' : 'Desactivado',
          `La persona ha sido ${newStatus ? 'reactivada' : 'desactivada'} correctamente.`
        );
        if (!newStatus) setVista("lista");
      } else {
        throw new Error("Error updating status");
      }

    } catch (error) {
      console.error("Error al cambiar estado:", error);
      showError('Error', 'No se pudo cambiar el estado.');
    }
  };


  // POST/PUT handling
  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nombre,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      email,
      status
    };

    try {
      let response;
      if (personaSeleccionada) {
        // Update
        response = await fetch(`${import.meta.env.VITE_API_URL || ""}/personas/${personaSeleccionada.id_persona}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create
        response = await fetch(`${import.meta.env.VITE_API_URL || ""}/personas`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!response.ok) throw new Error("Error al guardar persona");

      const data = await response.json();

      if (personaSeleccionada) {
        setPersonas(prev => prev.map(p => p.id_persona === data.id_persona ? data : p));
        success('Actualizado', 'Persona actualizada correctamente.');
      } else {
        setPersonas(prev => [...prev, data]);
        success('Creado', 'Persona creada correctamente.');
        nuevoDesdeDetalle();
      }

    } catch (error) {
      console.error(error);
      showError('Error', 'Hubo un error al guardar los datos.');
    }
  };

  const pestañas: TabItem[] = [
    {
      key: "lista",
      label: "Lista",
      icon: <IoMdList />,
      content: (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-2 mt-2">
            <div className="flex gap-4 items-center">
              <input
                type="text"
                placeholder="Buscar..."
                onChange={handleBuscar}
                className="border border-gray-300 rounded-lg px-3 py-2 w-60"
              />
              <select
                value={String(filtroEstado)}
                onChange={(e) => handleFiltrarEstado(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="true">Activos</option>
                <option value="false">Inactivos</option>
              </select>
            </div>
            <button
              className="px-4 py-2 text-blue-600 text-sm font-medium rounded-md border-2 border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
              type="button"
              onClick={nuevoDesdeDetalle}
            >
              <IoMdAddCircle size={20} />
              <span>Agregar</span>
            </button>
          </div>

          <div className="flex-grow">
            {loading ? (
              <div className="text-center text-gray-500 mt-4">Cargando...</div>
            ) : rowDataFiltrada.length > 0 ? (
              <PersonaTable
                personas={rowDataFiltrada}
                onRowClick={handleRowClick}
                onDelete={(id) => handleDelete(id, false)} // Default delete action is deactivate
              />
            ) : (
              <div className="text-center text-gray-500 mt-4">No hay datos para mostrar</div>
            )}
          </div>
        </div>
      )
    },
    {
      key: "detalle",
      label: "Detalle",
      icon: <MdDescription />,
      content: (
        <PersonaDetalle
          personaSeleccionada={personaSeleccionada}
          nombre={nombre}
          setNombre={setNombre}
          apellidoPaterno={apellidoPaterno}
          setApellidoPaterno={setApellidoPaterno}
          apellidoMaterno={apellidoMaterno}
          setApellidoMaterno={setApellidoMaterno}
          email={email}
          setEmail={setEmail}
          status={status}
          setStatus={setStatus}
          manejarEnvio={manejarEnvio}
          onDelete={handleDelete}
          nuevoDesdeDetalle={nuevoDesdeDetalle}
        />
      )
    },
  ];

  return (
    <MainLayout>
      <div className="p-6 h-full flex flex-col">
        <Tabs tabs={pestañas} activeTab={vista} onChange={setVista} />
      </div>
    </MainLayout>
  );
}

export default Persona;
