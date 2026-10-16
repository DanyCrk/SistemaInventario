package SistemaInventario.controller;

import SistemaInventario.entity.Role;
import SistemaInventario.service.RoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/roles")
@CrossOrigin(origins = "http://localhost:4200")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @GetMapping
    public ResponseEntity<List<Role>> listarTodos() {
        return ResponseEntity.ok(roleService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> buscarPorId(@PathVariable Integer id) {

        return roleService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Role> guardar(@RequestBody Role role) {
        return ResponseEntity.ok(roleService.guardar(role));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {

        if (roleService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        roleService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}