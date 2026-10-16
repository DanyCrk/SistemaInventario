package SistemaInventario.service;

import SistemaInventario.entity.MetodoPago;
import SistemaInventario.repository.MetodoPagoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service 

public class MetodoPagoService {
    private final MetodoPagoRepository metodoPagoRepository;

    public MetodoPagoService(MetodoPagoRepository metodoPagoRepository) {
        this.metodoPagoRepository = metodoPagoRepository;
    }
    public List<MetodoPago> listarTodos() {
        return metodoPagoRepository.findAll();
    }

    public Optional<MetodoPago> buscarPorId(Integer id) {
        return metodoPagoRepository.findById(id);
    }

    public MetodoPago guardar(MetodoPago metodoPago) {
        return metodoPagoRepository.save(metodoPago);
    }

    public void eliminar(Integer id) {
        metodoPagoRepository.deleteById(id);
    }

}
