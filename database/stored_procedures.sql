CREATE OR REPLACE FUNCTION spd_registra_admin(
    StrNombre VARCHAR(50),
    StrApellidoPaterno VARCHAR(50), 
    StrApellidoMaterno VARCHAR(50),
    StrEmail VARCHAR(100), 
    StrCuenta VARCHAR(50), 
    StrPassword VARCHAR(200)
)
RETURNS TEXT AS $$
DECLARE
    id_persona_insertada INT;
BEGIN

    IF EXISTS (SELECT 1 FROM tbl_personas WHERE email = StrEmail) THEN
        RETURN 'ERROR_CORREO';
    END IF;


    INSERT INTO tbl_personas(
        nombre, apellido_paterno, apellido_materno, email,
        status, fecha_alta, fecha_ultima_modificacion
    )
    VALUES (
        StrNombre, StrApellidoPaterno, StrApellidoMaterno, StrEmail,
        TRUE, NOW(), NOW()
    )
    RETURNING id_persona INTO id_persona_insertada;


    INSERT INTO tbl_usuarios(
        id_persona, cuenta, password, id_rol,
        status, fecha_alta, fecha_ultima_modificacion
    )
    VALUES (
        id_persona_insertada, StrCuenta, StrPassword, 1,
        TRUE, NOW(), NOW()
    );

    RETURN 'OK';

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
        RETURN 'ERROR';
END;
$$ LANGUAGE plpgsql;


SELECT spd_registra_admin('Carlos', 'Agavio', 'Trujillo', 'agavio@email.com', 'agavio', '1234');


SELECT spd_registra_admin('Emanuel', 'Agavio', 'Trujillo', 'agavio@email.com', 'manu', '1234');


SELECT u.id_usuario, u.cuenta, u.status, u.id_rol, u.password,
       p.nombre, p.apellido_paterno, p.apellido_materno, p.email
FROM tbl_usuarios u
JOIN tbl_personas p ON u.id_persona = p.id_persona





