package SistemaInventario.service;

import SistemaInventario.entity.MovimientoInventario;
import SistemaInventario.entity.Producto;
import SistemaInventario.entity.TipoMovimiento;
import SistemaInventario.repository.MovimientoInventarioRepository;
import SistemaInventario.repository.ProductoRepository;
import SistemaInventario.repository.TipoMovimientoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovimientoInventarioService {

    private final MovimientoInventarioRepository movimientoInventarioRepository;
    private final ProductoRepository productoRepository;
    private final TipoMovimientoRepository tipoMovimientoRepository;

    public MovimientoInventarioService(
            MovimientoInventarioRepository movimientoInventarioRepository,
            ProductoRepository productoRepository,
            TipoMovimientoRepository tipoMovimientoRepository) {

        this.movimientoInventarioRepository = movimientoInventarioRepository;
        this.productoRepository = productoRepository;
        this.tipoMovimientoRepository = tipoMovimientoRepository;
    }

    public List<MovimientoInventario> listarTodos() {
        return movimientoInventarioRepository.findAll();
    }

    public Optional<MovimientoInventario> buscarPorId(Integer id) {
        return movimientoInventarioRepository.findById(id);
    }

    public MovimientoInventario registrarMovimiento(
            MovimientoInventario movimiento,
            Integer idProducto,
            Integer idTipoMovimiento) {

        Producto producto = productoRepository.findById(idProducto)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        TipoMovimiento tipoMovimiento = tipoMovimientoRepository.findById(idTipoMovimiento)
                .orElseThrow(() -> new RuntimeException("Tipo de movimiento no encontrado"));

        int cantidad = movimiento.getCantidad();

        switch (tipoMovimiento.getNombre()) {

            case "ENTRADA":
            case "AJUSTE_POSITIVO":
                producto.setStock(producto.getStock() + cantidad);
                break;

            case "SALIDA":
            case "AJUSTE_NEGATIVO":

                if (producto.getStock() < cantidad) {
                    throw new RuntimeException("Stock insuficiente");
                }

                producto.setStock(producto.getStock() - cantidad);
                break;

            default:
                throw new RuntimeException("Tipo de movimiento no válido");
        }

        movimiento.setProducto(producto);
        movimiento.setTipoMovimiento(tipoMovimiento);

        productoRepository.save(producto);

        return movimientoInventarioRepository.save(movimiento);
    }

    public void eliminar(Integer id) {
        movimientoInventarioRepository.deleteById(id);
    }
}