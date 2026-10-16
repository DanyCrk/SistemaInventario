package SistemaInventario.repository;

import SistemaInventario.entity.TipoMovimiento;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TipoMovimientoRepository extends JpaRepository<TipoMovimiento, Integer> {
}