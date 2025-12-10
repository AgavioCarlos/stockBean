import React, { ChangeEvent, useEffect, useState } from "react";
import type { Productos } from "../interfaces/producto.interface";
import { IoIosSave } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import Swal from "sweetalert2";


type Props = {
  productoSeleccionado: Productos | null;
  nombre: string;
  setNombre: (v: string) => void;
  descripcion: string;
  setDescripcion: (v: string) => void;
  categoria: number;
  setCategoria: (v: number) => void;
  unidad: number;
  setUnidad: (v: number) => void;
  marca: number;
  setMarca: (v: number) => void;
  codigoBarras: string;
  setCodigoBarras: (v: string) => void;
  imagenUrl: string;
  manejarCambio: (e: ChangeEvent<HTMLInputElement>) => void;
  status: boolean;
  setStatus: (v: boolean) => void;
  manejarEnvio: (e: React.FormEvent) => void;
  onDelete?: (id: number, newStatus?: boolean) => void;
  nuevoDesdeDetalle: () => void;

  setVista: (v: string) => void;
  categoriasList: any[];
  marcasList: any[];
  unidadesList: any[];
};

export default function ProductosDetalle({
  productoSeleccionado,
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  categoria,
  setCategoria,
  unidad,
  setUnidad,
  marca,
  setMarca,
  codigoBarras,
  setCodigoBarras,
  imagenUrl,
  manejarCambio,
  status,
  setStatus,
  manejarEnvio,
  nuevoDesdeDetalle,
  setVista,
  onDelete,
  categoriasList,
  marcasList,
  unidadesList,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);

  // Internal fetching removed - receiving props now
  useEffect(() => {
    if (productoSeleccionado) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [productoSeleccionado]);

  return (
    <div className="w-full h-full flex flex-col">
      <form onSubmit={manejarEnvio} className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-6 py-3 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {productoSeleccionado ? "Detalle del Producto" : "Nuevo Producto"}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {!isEditing && productoSeleccionado && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 text-blue-600 text-sm font-medium rounded-md border border-blue-600 bg-white hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                <span>Editar</span>
              </button>
            )}

            {isEditing && (
              <>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-green-600 text-sm font-medium rounded-md border border-green-600 bg-white hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2"
                >
                  <IoIosSave size={18} />
                  <span>Guardar</span>
                </button>

                {productoSeleccionado && status && (
                  <button
                    type="button"
                    title="Desactivar"
                    onClick={async () => {
                      if (!productoSeleccionado) return;
                      const res = await Swal.fire({
                        title: '¿Desactivar producto?',
                        text: `¿Deseas desactivar "${productoSeleccionado.nombre}"? Esto marcará el producto como inactivo.`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, desactivar',
                      });
                      if (res.isConfirmed && typeof onDelete === 'function') {
                        onDelete(productoSeleccionado.id_producto as number, false);
                      }
                    }}
                    className="px-4 py-1.5 text-yellow-600 text-sm font-medium rounded-md border border-yellow-600 bg-white hover:bg-yellow-600 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <MdBlock size={18} />
                    <span>Desactivar</span>
                  </button>
                )}

                {productoSeleccionado && !status && (
                  <button
                    type="button"
                    title="Activar"
                    onClick={async () => {
                      if (!productoSeleccionado) return;
                      const res = await Swal.fire({
                        title: '¿Activar producto?',
                        text: `¿Deseas activar "${productoSeleccionado.nombre}"? Esto marcará el producto como activo.`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Sí, activar',
                      });
                      if (res.isConfirmed && typeof onDelete === 'function') {
                        onDelete(productoSeleccionado.id_producto as number, true);
                      }
                    }}
                    className="px-4 py-1.5 text-green-600 text-sm font-medium rounded-md border border-green-600 bg-white hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm5 8.59L10.7 16.9a1 1 0 0 1-1.4 0l-3.3-3.3a1 1 0 0 1 1.4-1.4l2.6 2.6L15.6 9.2A1 1 0 0 1 17 9.59z" /></svg>
                    <span>Activar</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Main Content Form */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="flex gap-8 h-full">

            {/* Left Column: Images */}
            <div className="w-1/3 flex flex-col gap-4">
              <div className="flex flex-col gap-2 h-full">
                {/* Main Large Image */}
                <div className={`flex-[2] border-2 border-dashed rounded-xl bg-gray-50 transition-all group relative flex flex-col items-center justify-center overflow-hidden h-64 ${isEditing ? 'border-gray-300 hover:bg-white hover:border-blue-400 cursor-pointer' : 'border-gray-200'}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={manejarCambio}
                    disabled={!isEditing}
                    className={`absolute inset-0 w-full h-full opacity-0 z-10 ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                  />
                  {imagenUrl ? (
                    <img
                      src={imagenUrl}
                      alt="preview"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className="mx-auto w-12 h-12 text-gray-400 mb-2">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      {isEditing ? (
                        <>
                          <p className="text-sm text-gray-500 font-medium group-hover:text-blue-500 transition-colors">
                            Subir Imagen Principal
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">Sin imagen</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Secondary Images (Grid of 2) */}
                <div className="flex-1 grid grid-cols-2 gap-2 h-32">
                  {/* Placeholder 1 */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center">
                    <span className="text-xs text-gray-300">Img 2</span>
                  </div>
                  {/* Placeholder 2 */}
                  <div className="border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center">
                    <span className="text-xs text-gray-300">Img 3</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Inputs */}
            <div className="w-2/3 flex flex-col gap-5">
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nombre</label>
                  <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                    placeholder="Ej. Coca Cola 600ml"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Código de Barras</label>
                  <input
                    value={codigoBarras}
                    onChange={(e) => setCodigoBarras(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-4 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm font-mono text-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                    placeholder="0000000000"
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full flex-1 border rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm resize-none ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200' : 'border-gray-300'}`}
                  placeholder="Detalles adicionales del producto..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Categoría</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(Number(e.target.value))}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200 appearance-none' : 'border-gray-300'}`}
                  >
                    <option value={0}>Seleccionar...</option>
                    {categoriasList.map((c: any) => {
                      const id = c?.id ?? c?.idCategoria ?? c?.categoriaId ?? c?.value ?? 0;
                      const label = c?.nombre ?? c?.nombreCategoria ?? c?.descripcion ?? c?.name ?? String(id);
                      return <option key={id} value={id}>{label}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Marca</label>
                  <select
                    value={marca}
                    onChange={(e) => setMarca(Number(e.target.value))}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200 appearance-none' : 'border-gray-300'}`}
                  >
                    <option value={0}>Seleccionar...</option>
                    {marcasList.map((m: any) => {
                      const id = m?.id ?? m?.idMarca ?? m?.marcaId ?? m?.value ?? 0;
                      const label = m?.nombre ?? m?.descripcion ?? m?.name ?? String(id);
                      return <option key={id} value={id}>{label}</option>;
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Unidad</label>
                  <select
                    value={unidad}
                    onChange={(e) => setUnidad(Number(e.target.value))}
                    disabled={!isEditing}
                    className={`w-full border rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm text-sm ${!isEditing ? 'bg-gray-100 text-gray-600 border-gray-200 appearance-none' : 'border-gray-300'}`}
                  >
                    <option value={0}>Seleccionar...</option>
                    {unidadesList.map((u: any) => {
                      const id = u?.id ?? u?.idUnidad ?? u?.unidadId ?? u?.value ?? 0;
                      const label = u?.nombre ?? u?.descripcion ?? u?.name ?? String(id);
                      return <option key={id} value={id}>{label}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className="mt-2 text-center text-xs text-gray-400">
                {isEditing
                  ? "Edita los campos y guarda los cambios."
                  : "Modo visualización. Click en Editar para modificar."
                }
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}