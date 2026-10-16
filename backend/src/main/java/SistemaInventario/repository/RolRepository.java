package SistemaInventario.repository;

import SistemaInventario.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByNombre(String nombre);
}