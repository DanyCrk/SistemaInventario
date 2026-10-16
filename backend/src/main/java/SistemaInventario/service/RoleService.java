package SistemaInventario.service;

import SistemaInventario.entity.Role;
import SistemaInventario.repository.RolRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service

public class RoleService {
    private final RolRepository roleRepository;

    public RoleService(RolRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> listarTodos() {
        return roleRepository.findAll();
    }

    public Optional<Role> buscarPorId(Integer id) {
        return roleRepository.findById(id);
    }

    public Role guardar(Role role) {
        return roleRepository.save(role);
    }

    public void eliminar(Integer id) {
        roleRepository.deleteById(id);
    }
}