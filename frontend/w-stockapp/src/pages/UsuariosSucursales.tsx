import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layouts/MainLayout';
import Breadcrumb from '../components/Breadcrumb';
import Tabs from '../components/Tabs';
import SearchInput from '../components/SearchInput';
import StatusFilter from '../components/StatusFilter';
import { PdfButton, ExcelButton } from '../components/Buttons';
import { FaPlus, FaHome } from "react-icons/fa";
import Swal from 'sweetalert2';
import UsuarioSucursalTable from '../components/UsuarioSucursalTable';
import UsuarioSucursalDetalle from '../components/UsuarioSucursalDetalle';
import { UsuarioSucursal, listarUsuarioSucursales, asignarUsuarioSucursal, actualizarUsuarioSucursal, eliminarUsuarioSucursal } from '../services/UsuarioSucursalService';

const UsuariosSucursales: React.FC = () => {
    const navigate = useNavigate();
    const [asignaciones, setAsignaciones] = useState<UsuarioSucursal[]>([]);
    const [filteredData, setFilteredData] = useState<UsuarioSucursal[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
    const [selectedItem, setSelectedItem] = useState<UsuarioSucursal | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await listarUsuarioSucursales();
            setAsignaciones(data);
            setFilteredData(data);
        } catch (error) {
            console.error("Error loading assignments:", error);
            Swal.fire('Error', 'No se pudieron cargar las asignaciones', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let result = asignaciones;

        // Search by User Name, Account or Branch Name
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(item =>
                item.usuario.cuenta.toLowerCase().includes(lowerTerm) ||
                item.usuario.persona.nombre.toLowerCase().includes(lowerTerm) ||
                item.usuario.persona.apellidoPaterno.toLowerCase().includes(lowerTerm) ||
                item.sucursal.nombre.toLowerCase().includes(lowerTerm)
            );
        }

        // Status Filter
        result = result.filter(item => item.status === statusFilter);

        setFilteredData(result);
    }, [searchTerm, statusFilter, asignaciones]);


    const handleAddNew = () => {
        setSelectedItem(null);
        setViewMode('detail');
    };

    const handleEdit = (event: any) => {
        setSelectedItem(event.data);
        setViewMode('detail');
    };

    const handleDelete = async (id: number) => {
        try {
            await eliminarUsuarioSucursal(id);
            Swal.fire({
                title: 'Eliminado!',
                text: 'La asignación ha sido eliminada (desactivada).',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            loadData();
        } catch (error) {
            console.error("Delete error:", error);
            Swal.fire('Error', 'No se pudo eliminar la asignación', 'error');
        }
    };

    const handleSave = async (data: Partial<UsuarioSucursal>) => {
        try {
            if (data.idUsuarioSucursal) {
                await actualizarUsuarioSucursal(data as UsuarioSucursal);
                Swal.fire({
                    title: 'Actualizado!',
                    text: 'La asignación se actualizó correctamente.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                await asignarUsuarioSucursal(data);
                Swal.fire({
                    title: 'Guardado!',
                    text: 'Nueva asignación creada correctamente.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
            setViewMode('list');
            loadData();
        } catch (error) {
            console.error("Save error:", error);
            Swal.fire('Error', 'Error al guardar. Verifica que no exista duplicidad.', 'error');
        }
    };

    const handleCancel = () => {
        setViewMode('list');
        setSelectedItem(null);
    };

    const breadcrumbItems = [
        { label: "", icon: <FaHome />, onClick: () => navigate("/dashboard") },
        { label: "Administrador", onClick: () => navigate("/administrador") },
        { label: "Usuarios - Sucursales" }
    ];

    return (
        <MainLayout>
            <div className="p-4 md:p-6 min-h-screen bg-gray-50/50">
                <Breadcrumb items={breadcrumbItems} onBack={() => navigate(-1)} />

                <div className="mt-6">
                    <Tabs
                        tabs={[
                            {
                                key: 'list',
                                label: 'Lista',
                                content: (
                                    <div className="space-y-4">
                                        {/* Toolbar */}
                                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <div className="w-full md:w-96">
                                                <SearchInput
                                                    placeholder="Buscar por usuario, cuenta o sucursal..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                />
                                            </div>

                                            <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                                                <StatusFilter
                                                    status={statusFilter}
                                                    onChange={setStatusFilter}
                                                />
                                                <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block"></div>
                                                <PdfButton onClick={() => { }} disabled={true} />
                                                <ExcelButton onClick={() => { }} disabled={true} />
                                                <button
                                                    onClick={handleAddNew}
                                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
                                                >
                                                    <FaPlus size={14} />
                                                    <span>Nueva Asignación</span>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Table */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: '600px' }}>
                                            {loading ? (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                                </div>
                                            ) : (
                                                <UsuarioSucursalTable
                                                    data={filteredData}
                                                    onRowClick={handleEdit}
                                                    onDelete={handleDelete}
                                                />
                                            )}
                                        </div>
                                    </div>
                                )
                            },
                            {
                                key: 'detail',
                                label: 'Detalle',
                                content: (
                                    <UsuarioSucursalDetalle
                                        detalle={selectedItem}
                                        onSave={handleSave}
                                        onCancel={handleCancel}
                                    />
                                )
                            }
                        ]}
                        activeTab={viewMode}
                        onChange={(tabId) => setViewMode(tabId as 'list' | 'detail')}
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default UsuariosSucursales;
