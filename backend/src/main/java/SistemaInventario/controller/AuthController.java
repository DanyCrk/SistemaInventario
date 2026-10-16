package SistemaInventario.controller;

import SistemaInventario.dto.LoginRequest;
import SistemaInventario.entity.Usuario;
import SistemaInventario.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import SistemaInventario.entity.Role;
import SistemaInventario.repository.RolRepository;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final RolRepository rolRepository;

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService, RolRepository rolRepository) {
    this.usuarioService = usuarioService;
    this.rolRepository = rolRepository;
}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Optional<Usuario> usuarioOpt = usuarioService.buscarPorCorreo(request.getCorreo());

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Correo o contraseña incorrectos");
        }

        Usuario usuario = usuarioOpt.get();

        if (!Boolean.TRUE.equals(usuario.getActivo())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario inactivo");
        }

        if (!usuarioService.verificarPassword(request.getPassword(), usuario.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Correo o contraseña incorrectos");
        }

        usuario.setPassword(null); // nunca devolver el hash
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/necesita-setup")
    public ResponseEntity<Boolean> necesitaSetup() {
    boolean hayAdmin = usuarioService.existeAdministrador();
    return ResponseEntity.ok(!hayAdmin);
    }

    @PostMapping("/setup-admin")
    public ResponseEntity<?> crearAdminInicial(@RequestBody LoginRequest request) {

    if (usuarioService.existeAdministrador()) {
        return ResponseEntity.badRequest().body("Ya existe un administrador configurado.");
    }

    Usuario admin = new Usuario();
    admin.setNombre("Administrador");
    admin.setCorreo(request.getCorreo());
    admin.setPassword(request.getPassword());
    admin.setActivo(true);
    admin.setFechaCreacion(java.time.LocalDateTime.now());

    Role rolAdmin = rolRepository.findByNombre("Administrador")
            .orElseThrow(() -> new RuntimeException("Rol Administrador no existe en la base de datos"));
    admin.setRol(rolAdmin);

    Usuario creado = usuarioService.guardar(admin);
    creado.setPassword(null);

    return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }
}