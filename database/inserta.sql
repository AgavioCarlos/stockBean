INSERT INTO cat_roles (
    nombre,
    descripcion,
    fecha_alta,
    fecha_ultima_modificacion
)
VALUES (
    'Administrador',
    'Rol con privilegios completos del sistema',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
