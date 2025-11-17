package com.stockbean.stockapp.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.stockbean.stockapp.dto.LoginRequest;
import com.stockbean.stockapp.dto.RegistroRequest;
import com.stockbean.stockapp.model.tablas.Usuario;
import com.stockbean.stockapp.security.JwtUtil;
import com.stockbean.stockapp.service.RegistroService;
import com.stockbean.stockapp.service.UsuarioService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private RegistroService registroService;

    // @Autowired 
    // private LoginService loginService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired 
    private UsuarioService usuarioService;

    @PostMapping("/registro")
    public ResponseEntity<Map<String, String>>registrar(@RequestBody RegistroRequest request) {
    registroService.registrar(request);
    Map<String, String> respuesta = new HashMap<>();
    respuesta.put("mensaje", "Registro exitoso");
        return ResponseEntity.ok(respuesta);
    }

    // @PostMapping("/login")
    // public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request){
    //     System.out.println("Cuenta/email recibida: " + request.getCuenta());
    //     LoginResponse respuesta = loginService.login(request);
    //     return ResponseEntity.ok(respuesta);
    // }

     @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody LoginRequest request) throws Exception {
        try {
            // Autentica al usuario utilizando el AuthenticationManager de Spring Security.
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getCuenta(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Usuario o contraseña incorrectos");
            return  ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(respuesta);

        } catch (Exception e) {
            Map<String, String> respuesta = new HashMap<>();
            respuesta.put("mensaje", "Error de autenticación");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getCuenta());
        final String jwt = jwtUtil.generateToken(userDetails);

        Usuario user = usuarioService.findByCuenta(request.getCuenta());

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("success", true);
        respuesta.put("id_usuario", user.getId_usuario());
        respuesta.put("cuenta", user.getCuenta());
        respuesta.put("mensaje", "Autenticación exitosa");
        respuesta.put("token", jwt);
        return ResponseEntity.ok(respuesta);
    }
}
