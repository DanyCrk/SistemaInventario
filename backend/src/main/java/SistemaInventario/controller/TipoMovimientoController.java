package SistemaInventario.controller;

import SistemaInventario.entity.TipoMovimiento;
import SistemaInventario.service.TipoMovimientoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipomovimientos")
public class TipoMovimientoController {

    private final TipoMovimientoService tipoMovimientoService;

    public TipoMovimientoController(TipoMovimientoService tipoMovimientoService) {
        this.tipoMovimientoService = tipoMovimientoService;
    }

    @GetMapping
    public List<TipoMovimiento> listarTodos() {
        return tipoMovimientoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TipoMovimiento> buscarPorId(@PathVariable Integer id) {
        return tipoMovimientoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TipoMovimiento> crear(@RequestBody TipoMovimiento tipoMovimiento) {
        TipoMovimiento guardado = tipoMovimientoService.guardar(tipoMovimiento);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TipoMovimiento> actualizar(@PathVariable Integer id, @RequestBody TipoMovimiento tipoMovimiento) {
        if (tipoMovimientoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        tipoMovimiento.setIdTipoMovimiento(id);
        return ResponseEntity.ok(tipoMovimientoService.guardar(tipoMovimiento));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (tipoMovimientoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        tipoMovimientoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}