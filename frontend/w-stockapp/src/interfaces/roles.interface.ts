export interface Rol {
  /** Backend field name: id_rol */
  id_rol: number;
  /** Nombre corto del rol (p. ej. "ADMIN") */
  nombre?: string | null;
  /** Descripción legible del rol */
  descripcion?: string | null;
  /** Fechas en ISO string (pueden venir como null) */
  fecha_alta?: string | null;
  fecha_baja?: string | null;
  fecha_ultima_modificacion?: string | null;
}

export type RoleView = {
  id: number;
  nombre?: string | null;
  descripcion?: string | null;
};

export function toRoleView(r: Rol): RoleView {
  return {
    id: r.id_rol,
    nombre: r.nombre ?? null,
    descripcion: r.descripcion ?? null,
  };

  
}
