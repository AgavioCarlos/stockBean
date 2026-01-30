import { useEffect, useState } from "react";
import MainLayout from "../components/Layouts/MainLayout";
import Tabs from "../components/Tabs";
import Table from "../components/Table";
import { Empresa } from "../interfaces/empresa.interface";
import { ColDef } from "ag-grid-community";
import { consultarEmpresas, guardarEmpresa, actualizarEmpresa } from "../services/Empresas";

function Empresas() {
    const [vista, setVista] = useState("lista");
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Empresa>({
        razonSocial: "",
        nombreComercial: "",
        rfc: "",
        activo: true
    });

    useEffect(() => {
        cargarEmpresas();
    }, []);

    const cargarEmpresas = () => {
        setLoading(true);
        consultarEmpresas()
            .then((data: Empresa[]) => {
                setEmpresas(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al consultar empresas:", error);
                setLoading(false);
            });
    };

    const handleRowClick = (params: any) => {
        setFormData(params.data);
        setVista("detalle");
    };

    const handleNuevo = () => {
        setFormData({
            razonSocial: "",
            nombreComercial: "",
            rfc: "",
            activo: true
        });
        setVista("detalle");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isCheckbox = (e.target as HTMLInputElement).type === 'checkbox';

        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData.id_empresa) {
                await actualizarEmpresa(formData.id_empresa, formData);
            } else {
                await guardarEmpresa(formData);
            }
            cargarEmpresas();
            setVista("lista");
        } catch (error) {
            console.error("Error al guardar empresa:", error);
        }
    };

    const columnDefs: ColDef[] = [
        {
            field: "id_empresa",
            headerName: "ID",
            width: 80,
            editable: false,
            filter: false
        },
        {
            field: "nombreComercial",
            headerName: "Nombre Comercial",
            width: 200,
            editable: true,
            filter: true
        },
        {
            field: "razonSocial",
            headerName: "Razón Social",
            width: 250,
            editable: true,
            filter: true
        },
        {
            field: "rfc",
            headerName: "RFC",
            width: 150,
            editable: true,
            filter: true
        },
        {
            field: "activo",
            headerName: "Activo",
            width: 100,
            editable: true,
            filter: true,
            valueFormatter: (params) => params.value ? "Sí" : "No"
        }
    ];

    return (
        <MainLayout>
            <Tabs
                activeTab={vista}
                onChange={setVista}
                tabs={[
                    {
                        key: "lista",
                        label: "Lista",
                        content:
                            <div>
                                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        onClick={handleNuevo}
                                        style={{
                                            padding: '8px 16px',
                                            backgroundColor: '#4F46E5',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontWeight: '500'
                                        }}
                                    >
                                        Nuevo
                                    </button>
                                </div>
                                <Table
                                    rowData={empresas}
                                    columnDefs={columnDefs}
                                    onRowClick={handleRowClick}
                                    height="auto"
                                    rowHeight={40}
                                    headerHeight={45}
                                />
                            </div>
                    },
                    {
                        key: "detalle",
                        label: "Detalle",
                        content:
                            <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
                                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Nombre Comercial</label>
                                        <input
                                            type="text"
                                            name="nombreComercial"
                                            value={formData.nombreComercial}
                                            onChange={handleInputChange}
                                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Razón Social</label>
                                        <input
                                            type="text"
                                            name="razonSocial"
                                            value={formData.razonSocial}
                                            onChange={handleInputChange}
                                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>RFC</label>
                                        <input
                                            type="text"
                                            name="rfc"
                                            value={formData.rfc}
                                            onChange={handleInputChange}
                                            style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                            required
                                            maxLength={13}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Estatus</label>
                                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    name="activo"
                                                    checked={formData.activo}
                                                    onChange={handleInputChange}
                                                    style={{ width: '18px', height: '18px' }}
                                                />
                                                Activo
                                            </label>
                                        </div>
                                    </div>

                                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                        <button
                                            type="button"
                                            onClick={() => setVista("lista")}
                                            style={{
                                                padding: '10px 20px',
                                                backgroundColor: '#9CA3AF',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            style={{
                                                padding: '10px 20px',
                                                backgroundColor: '#4F46E5',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </form>
                            </div>
                    },
                ]}
            />
        </MainLayout>
    )
}

export default Empresas;
