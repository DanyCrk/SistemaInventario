package SistemaInventario.controller;

import SistemaInventario.service.BackupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/backup")
public class BackupController {

    private final BackupService backupService;

    public BackupController(BackupService backupService) {
        this.backupService = backupService;
    }

    @PostMapping("/manual")
    public ResponseEntity<String> respaldarAhora() {
        backupService.realizarRespaldo();
        return ResponseEntity.ok("Respaldo creado correctamente.");
    }

    @GetMapping("/listar")
    public ResponseEntity<List<String>> listarRespaldos() throws IOException {
        return ResponseEntity.ok(backupService.listarRespaldos());
    }
}