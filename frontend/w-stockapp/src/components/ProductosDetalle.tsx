import React, { ChangeEvent } from "react";
import type { Productos } from "../interfaces/producto.interface";
import { IoIosSave } from "react-icons/io";

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
  nuevoDesdeDetalle: () => void;
  setVista: (v: string) => void;
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
}: Props) {
  return (
    <div className="px-6 mt-3 ml-10">
      <form
        onSubmit={manejarEnvio}
        className="w-full max-w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-5 bg-gradient-to-r from-gray-50 to-white border-b">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              {productoSeleccionado ? "Detalle" : "Nuevo producto"}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-4 py-2 text-green-600 text-sm font-medium rounded-md border-2 border-green-600 bg-white hover:bg-green-600 hover:text-white transition-colors flex items-center gap-2"
            >
              <IoIosSave size={20} />
            </button>
          </div>
        </div>
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Nombre del producto"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                rows={2}
                placeholder="Descripción corta del producto"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría (id)
                </label>
                <input
                  type="number"
                  value={categoria}
                  onChange={(e) => setCategoria(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca (id)
                </label>
                <input
                  type="number"
                  value={marca}
                  onChange={(e) => setMarca(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unidad (id)
                </label>
                <input
                  type="number"
                  value={unidad}
                  onChange={(e) => setUnidad(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de barras
                </label>
                <input
                  value={codigoBarras}
                  onChange={(e) => setCodigoBarras(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen
              </label>
              <div className="border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:border-blue-400 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={manejarCambio}
                  className="w-full text-sm text-gray-600"
                />
                {imagenUrl ? (
                  <img
                    src={imagenUrl}
                    alt="preview"
                    className="mt-3 w-40 h-40 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="mt-3 text-xs text-gray-400 italic">
                    Sin imagen
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-700 mb-2">Estado</p>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 rounded"
                />
                <span className="text-sm text-gray-700">
                  {status ? "Activo" : "Inactivo"}
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
              >
                Guardar cambios
              </button>
              <button
                type="button"
                onClick={nuevoDesdeDetalle}
                className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition"
              >
                Nuevo (limpiar)
              </button>
              <button
                type="button"
                onClick={() => setVista("lista")}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
              >
                Volver a lista
              </button>
            </div>
          </aside>
        </div>

        <div className="px-8 py-4 bg-gray-50 border-t text-sm text-gray-500">
          Rellena todos los campos requeridos y presiona{" "}
          <span className="font-medium text-gray-700">Guardar cambios</span>.
        </div>
      </form>
    </div>
  );
}