import { useState, useEffect } from "react";
import { consultarEmpresaUsuario, guardarEmpresaUsuario, actualizarEmpresaUsuario } from "../services/EmpresaUsuario";
import { consultarEmpresas } from "../services/Empresas";
import { consultarUsuarios } from "../services/Usuarios";
import { ColDef } from "ag-grid-community";
import MainLayout from "../components/Layouts/MainLayout";
import Tabs from "../components/Tabs";
import Table from "../components/Table";
import type { EmpresaUsuario, EmpresaUsuarioForm, Usuario } from "../interfaces/empresaUsuario.interface";
import type { Empresa } from "../interfaces/empresa.interface";


function EmpresaUsuario() {
    const [empresaUsuarios, setEmpresaUsuarios] = useState<EmpresaUsuario[]>([]);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [vista, setVista] = useState("lista");
    const [formData, setFormData] = useState<EmpresaUsuarioForm>({
        idEmpresaUsuario: 0,
        idUsuario: 0,
        idEmpresa: 0,
        activo: true,
        fechaAlta: ""
    });


    const handleRowClick = (params: any) => {
        const row: EmpresaUsuario = params.data;
        setFormData({
            idEmpresaUsuario: row.idEmpresaUsuario,
            idUsuario: row.usuario.id_usuario,
            idEmpresa: row.empresa.idEmpresa || 0,
            activo: row.activo,
            fechaAlta: row.fechaAlta
        });
        setVista("detalle");
    };

    const handleNuevo = () => {
        setFormData({
            idEmpresaUsuario: 0,
            idUsuario: 0,
            idEmpresa: 0,
            activo: true,
            fechaAlta: ""
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
            // Construir el payload con la estructura correcta
            const payload = {
                idEmpresaUsuario: formData.idEmpresaUsuario || undefined,
                usuario: {
                    id_usuario: formData.idUsuario
                },
                empresa: {
                    idEmpresa: formData.idEmpresa
                },
                activo: formData.activo,
                fechaAlta: formData.fechaAlta || undefined
            };

            if (formData.idEmpresaUsuario) {
                await actualizarEmpresaUsuario(formData.idEmpresaUsuario, payload);
            } else {
                await guardarEmpresaUsuario(payload);
            }

            // Recargar datos
            const data = await consultarEmpresaUsuario();
            setEmpresaUsuarios(data);
            setVista("lista");
        } catch (error) {
            console.error("Error al guardar empresa usuario:", error);
        }
    };

    useEffect(() => {
        // Cargar empresas usuarios
        consultarEmpresaUsuario()
            .then((data: EmpresaUsuario[]) => {
                setEmpresaUsuarios(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al consultar empresas usuarios:", error);
                setLoading(false);
            });

        // Cargar empresas
        consultarEmpresas()
            .then((data: Empresa[]) => {
                setEmpresas(data);
            })
            .catch((error) => {
                console.error("Error al consultar empresas:", error);
            });

        // Cargar usuarios
        consultarUsuarios()
            .then((data: Usuario[]) => {
                console.log('Usuarios cargados:', data);
                setUsuarios(data);
            })
            .catch((error) => {
                console.error("Error al consultar usuarios:", error);
            });
    }, []);

    const columnDefs: ColDef[] = [
        { field: "idEmpresaUsuario", headerName: "ID", width: 100, editable: false, filter: false },
        {
            field: "usuario.cuenta",
            headerName: "Usuario",
            width: 200,
            editable: false,
            filter: true,
            valueGetter: (params) => params.data?.usuario?.cuenta || ''
        },
        {
            field: "empresa.razonSocial",
            headerName: "Empresa",
            width: 300,
            editable: false,
            filter: true,
            valueGetter: (params) => params.data?.empresa?.razonSocial || ''
        },
        {
            field: "activo",
            headerName: "Activo",
            width: 100,
            editable: false,
            filter: true,
            valueFormatter: (params) => params.value ? "Sí" : "No"
        },
        {
            field: "fechaAlta",
            headerName: "Fecha Alta",
            width: 180,
            editable: false,
            filter: true,
            valueFormatter: (params) => {
                if (!params.value) return '';
                return new Date(params.value).toLocaleDateString('es-MX');
            }
        }
    ];

    console.log('empresaUsuarios:', empresaUsuarios);
    console.log('usuarios:', usuarios);
    console.log('empresas:', empresas);
    return (
        <div>
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
                                        rowData={empresaUsuarios}
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
                                            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Empresa *</label>
                                            <select
                                                name="idEmpresa"
                                                value={formData.idEmpresa}
                                                onChange={handleInputChange}
                                                style={{
                                                    padding: '8px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#fff'
                                                }}
                                                required
                                            >
                                                <option value="0">Seleccione una empresa</option>
                                                {empresas.map(empresa => (
                                                    <option key={empresa.idEmpresa} value={empresa.idEmpresa}>
                                                        {empresa.nombreComercial}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Usuario *</label>
                                            <select
                                                name="idUsuario"
                                                value={formData.idUsuario}
                                                onChange={handleInputChange}
                                                style={{
                                                    padding: '8px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#fff'
                                                }}
                                                required
                                            >
                                                <option value="0">Seleccione un usuario</option>
                                                {usuarios.map(usuario => (
                                                    <option key={usuario.id_usuario} value={usuario.id_usuario}>
                                                        {usuario.cuenta}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <label style={{ marginBottom: '5px', fontWeight: 'bold' }}>Activo</label>
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

        </div>
    );
}

export default EmpresaUsuario;