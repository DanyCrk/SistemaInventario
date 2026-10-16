package SistemaInventario.service;
import SistemaInventario.entity.TipoMovimiento;
import SistemaInventario.repository.TipoMovimientoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TipoMovimientoService {
    private final TipoMovimientoRepository tipoMovimientoRepository;

    public TipoMovimientoService(TipoMovimientoRepository tipoMovimientoRepository) {
        this.tipoMovimientoRepository = tipoMovimientoRepository;
    }

    public List<TipoMovimiento> listarTodos() {
        return tipoMovimientoRepository.findAll();
    }

    public Optional<TipoMovimiento> buscarPorId(Integer id) {
        return tipoMovimientoRepository.findById(id);
    }

    public TipoMovimiento guardar(TipoMovimiento tipoMovimiento) {
        return tipoMovimientoRepository.save(tipoMovimiento);
    }

    public void eliminar(Integer id) {
        tipoMovimientoRepository.deleteById(id);
    }
}
