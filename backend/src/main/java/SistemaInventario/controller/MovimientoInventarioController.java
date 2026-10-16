package SistemaInventario.controller;

import SistemaInventario.entity.MovimientoInventario;
import SistemaInventario.service.MovimientoInventarioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/movimientos")
@CrossOrigin(origins = "http://localhost:4200")
public class MovimientoInventarioController {

    private final MovimientoInventarioService movimientoInventarioService;

    public MovimientoInventarioController(
            MovimientoInventarioService movimientoInventarioService) {
        this.movimientoInventarioService = movimientoInventarioService;
    }

    @GetMapping
    public ResponseEntity<List<MovimientoInventario>> listarTodos() {
        return ResponseEntity.ok(movimientoInventarioService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimientoInventario> buscarPorId(
            @PathVariable Integer id) {

        return movimientoInventarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

   @PostMapping
public ResponseEntity<?> registrarMovimiento(
        @RequestBody MovimientoInventario movimiento,
        @RequestParam Integer idProducto,
        @RequestParam Integer idTipoMovimiento) {

    try {
        MovimientoInventario guardado = movimientoInventarioService.registrarMovimiento(
                movimiento, idProducto, idTipoMovimiento);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
            }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {

        if (movimientoInventarioService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        movimientoInventarioService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}