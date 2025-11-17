import React, { ChangeEvent, useEffect, useState } from "react";
import { consultarCategorias } from "../services/Categoria";
import { consultarUnidades } from "../services/Unidad";
import { consultarMarcas } from "../services/Marcas";
import { Categoria, Unidad, Marca } from "../interfaces/producto.interface";


type Props = {
  mostrar: boolean;
  onClose: () => void;
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
};

export default function ProductosForm({
  mostrar,
  onClose,
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
}: Props) {
  if (!mostrar) return null;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [unidades, setUnidades] = useState<Unidad[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  
  const [cargandoCategorias, setCargandoCategorias] = useState(false);
  const [cargandoUnidades, setCargandoUnidades] = useState(false);
  const [cargandoMarcas, setCargandoMarcas] = useState(false);


  useEffect(() => {
    let mounted = true;
    setCargandoCategorias(true);
    consultarCategorias()
      .then((data: Categoria[]) => {
        if (!mounted) return;
        setCategorias(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error al cargar categorias:", err);
        setCategorias([]);
      })
      .finally(() => {
        if (mounted) setCargandoCategorias(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setCargandoUnidades(true);
    consultarUnidades()
      .then((data: Unidad[]) => {
        if (!mounted) return;
        setUnidades(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error al cargar unidades:", err);
        setUnidades([]);
      })    
      .finally(()=> {
        if (mounted) setCargandoUnidades(false);
      });
    return () => {
      mounted = false;
    };
    }, []);

    useEffect(() => {
    let mounted = true;
    setCargandoMarcas(true);
    consultarMarcas()
      .then((data: Marca[]) => {
        if (!mounted) return;
        setMarcas(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error al cargar marcas:", err);
        setMarcas([]);
      })    
      .finally(()=> {
        if (mounted) setCargandoMarcas(false);
      });
    return () => {
      mounted = false;
    };
    }, []);

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-xl">
        <form onSubmit={manejarEnvio}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Nombre"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <input
              type="text"
              placeholder="Descripción"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <select
              id="categoria"
              name="categoria"
              value={categoria}
              onChange={(e) => setCategoria(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value={0}>Selecciona una Categoria</option>
              {cargandoCategorias ? (
                <option value={0} disabled>
                  Cargando...
                </option>
              ) : categorias.length > 0 ? (
                categorias.map((c) => (
                  <option key={c.idCategoria} value={c.idCategoria}>
                    {c.nombre}
                  </option>
                ))
              ) : (
                <option value={0} disabled>
                  No hay categorías
                </option>
              )}
              {/* mapear categorías reales aquí */}
            </select>
          </div>

          {/* Unidad: checks (selección única) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-auto p-2 border rounded-md">
              {cargandoUnidades ? (
                <div className="text-sm text-gray-500">Cargando unidades...</div>
              ) : unidades.length > 0 ? (
                unidades.map((u) => (
                  <label key={u.idUnidad} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4"
                      checked={unidad === u.idUnidad}
                      onChange={() =>
                        setUnidad(unidad === u.idUnidad ? 0 : u.idUnidad)
                      }
                    />
                    <span>{u.nombre}</span>
                  </label>
                ))
              ) : (
                <div className="text-sm text-gray-500">No hay unidades</div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Marca la unidad deseada.</p>
          </div>


          <div className="mb-4">
            <select
              name="marca"
              id="marca"
              value={marca}
              onChange={(e) => setMarca(Number(e.target.value))}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value={0}>Selecciona una Marca</option>
              {cargandoMarcas ? (
                <option value={0} disabled>
                    Cargando...
                </option>
              ) : marcas.length > 0 ? (
                marcas.map((m) => (
                    <option key={m.idMarca} value={m.idMarca}>
                        {m.nombre}
                    </option>
                )) 
              ) : (
                <option value={0} disabled>
                    No hay marcas
                </option>
              )}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Codigo de barras
            </label>
            <input
              type="text"
              placeholder="Codigo de barras"
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={codigoBarras}
              onChange={(e) => setCodigoBarras(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">
              Selecciona una imagen:
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={manejarCambio}
              className="block text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer"
            />

            {imagenUrl && (
              <img
                src={imagenUrl}
                alt="Vista previa"
                className="mt-3 w-48 h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
            )}
          </div>

          <div className="flex items-center mb-4">
            <label className="inline-flex items-center cursor-pointer">
              <span className="mr-3 text-sm text-gray-700">Activo</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={status}
                  onChange={(e) => setStatus(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-colors duration-200"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 rounded-md transition-colors flex items-center gap-2"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}