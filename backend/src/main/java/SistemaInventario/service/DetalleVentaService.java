package SistemaInventario.service;

import SistemaInventario.entity.DetalleVenta;
import SistemaInventario.repository.DetalleVentaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DetalleVentaService {

    private final DetalleVentaRepository detalleVentaRepository;

    public DetalleVentaService(DetalleVentaRepository detalleVentaRepository) {
        this.detalleVentaRepository = detalleVentaRepository;
    }

    public List<DetalleVenta> listarTodos() {
        return detalleVentaRepository.findAll();
    }

    public Optional<DetalleVenta> buscarPorId(Integer id) {
        return detalleVentaRepository.findById(id);
    }

    public DetalleVenta guardar(DetalleVenta detalleVenta) {
        return detalleVentaRepository.save(detalleVenta);
    }

    public void eliminar(Integer id) {
        detalleVentaRepository.deleteById(id);
    }

    public List<DetalleVenta> listarPorVenta(Integer idVenta) {
    return detalleVentaRepository.findByVenta_IdVenta(idVenta);
}
}