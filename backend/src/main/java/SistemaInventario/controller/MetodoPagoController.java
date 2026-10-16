package SistemaInventario.controller;

import SistemaInventario.entity.MetodoPago;
import SistemaInventario.service.MetodoPagoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/metodospago")
public class MetodoPagoController {

    private final MetodoPagoService metodoPagoService;

    public MetodoPagoController(MetodoPagoService metodoPagoService) {
        this.metodoPagoService = metodoPagoService;
    }

    @GetMapping
    public List<MetodoPago> listarTodos() {
        return metodoPagoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MetodoPago> buscarPorId(@PathVariable Integer id) {
        return metodoPagoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MetodoPago> crear(@RequestBody MetodoPago metodoPago) {
        MetodoPago guardado = metodoPagoService.guardar(metodoPago);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MetodoPago> actualizar(@PathVariable Integer id, @RequestBody MetodoPago metodoPago) {
        if (metodoPagoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        metodoPago.setIdMetodoPago(id); // ajusta el nombre si tu setter es diferente
        return ResponseEntity.ok(metodoPagoService.guardar(metodoPago));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (metodoPagoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        metodoPagoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}