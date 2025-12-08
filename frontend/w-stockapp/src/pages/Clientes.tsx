import { useEffect, useState } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { consultarClientes } from "../services/Clientes";

interface Cliente {
  idCliente: number;
  persona: number;
  fechaAlta: Date;
  status: boolean;
  tipoCliente: string;
}

function Clientes() {


  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    consultarClientes()
      .then((data: Cliente[]) => {
        setClientes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error al consultar clientes", error);
        setLoading(false);
      });
  }, []);

  console.log(clientes)

  return (
    <MainLayout>
      <div>
        {clientes && clientes.length > 0 ? (
          <div className="ag-theme-alpine w-220 h-96 bg-white rounded-xl shadow-md p-4">
            <AgGridReact
              theme="legacy"
              rowData={clientes}
              columnDefs={[
                { field: "idCliente", headerName: "ID", editable: false, filter: false },
                {
                  headerName: "Persona",
                  valueGetter: (params: any) => {
                    const persona = Array.isArray(params.data.persona)
                      ? params.data.persona[0]
                      : params.data.persona;
                    if (!persona) return "";
                    return `${persona.nombre ?? ""} ${persona.apellido_paterno ?? ""} ${persona.apellido_materno ?? ""}`.trim();
                  },
                  editable: false,
                  filter: false,
                },
                { field: "fechaAlta", headerName: "Fecha Alta", editable: false, filter: false },
                { field: "status", headerName: "Status", editable: false, filter: false },
                { field: "tipoCliente", headerName: "Tipo Cliente", editable: false, filter: false },

              ]}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: false,
                editable: true,
                floatingFilter: false,
              }}
            />
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-4">No hay datos para mostrar</div>
        )}

      </div>
    </MainLayout>
  )

}

export default Clientes;