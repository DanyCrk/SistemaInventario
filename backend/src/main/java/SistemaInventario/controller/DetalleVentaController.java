package SistemaInventario.controller;

import SistemaInventario.entity.DetalleVenta;
import SistemaInventario.service.DetalleVentaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/detalleventas")
public class DetalleVentaController {

    private final DetalleVentaService detalleVentaService;

    public DetalleVentaController(DetalleVentaService detalleVentaService) {
        this.detalleVentaService = detalleVentaService;
    }

    @GetMapping
    public List<DetalleVenta> listarTodos() {
        return detalleVentaService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<DetalleVenta> buscarPorId(@PathVariable Integer id) {
        return detalleVentaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/venta/{idVenta}")
    public List<DetalleVenta> listarPorVenta(@PathVariable Integer idVenta) {
        return detalleVentaService.listarPorVenta(idVenta);
    }

    @PostMapping
    public ResponseEntity<DetalleVenta> crear(@RequestBody DetalleVenta detalleVenta) {
        DetalleVenta guardado = detalleVentaService.guardar(detalleVenta);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (detalleVentaService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        detalleVentaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}