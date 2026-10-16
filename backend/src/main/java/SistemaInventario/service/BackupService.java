package SistemaInventario.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class BackupService {

    @Value("${app.database.path}")
    private String rutaBaseDatos;

    @Value("${app.backup.path}")
    private String rutaRespaldos;

    private static final int MAX_RESPALDOS = 14; 

    // Corre todos los días a las 6:30 PM
    @Scheduled(cron = "0 30 18 * * *")
    public void respaldarDiario() {
    realizarRespaldo();
    }

    // También respalda 2 minutos después de arrancar la aplicación (por si el usuario no la deja abierta a esa hora)
    @Scheduled(initialDelay = 120000, fixedDelay = Long.MAX_VALUE)
    public void respaldoAlIniciar() {
        realizarRespaldo();
    }

    public void realizarRespaldo() {

        try {
            Path origen = Paths.get(rutaBaseDatos);
            Path carpetaDestino = Paths.get(rutaRespaldos);

            if (!Files.exists(origen)) {
                System.err.println("No se encontró la base de datos para respaldar: " + rutaBaseDatos);
                return;
            }

            Files.createDirectories(carpetaDestino);

            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
            Path destino = carpetaDestino.resolve("inventario_backup_" + timestamp + ".db");

            Files.copy(origen, destino, StandardCopyOption.REPLACE_EXISTING);

            System.out.println("Respaldo creado: " + destino);

            limpiarRespaldosAntiguos(carpetaDestino);

        } catch (IOException e) {
            System.err.println("Error al crear el respaldo: " + e.getMessage());
        }
    }

    private void limpiarRespaldosAntiguos(Path carpeta) throws IOException {

        try (Stream<Path> archivos = Files.list(carpeta)) {

            List<Path> respaldos = archivos
                    .filter(p -> p.getFileName().toString().startsWith("inventario_backup_"))
                    .sorted((a, b) -> b.getFileName().toString().compareTo(a.getFileName().toString()))
                    .collect(Collectors.toList());

            for (int i = MAX_RESPALDOS; i < respaldos.size(); i++) {
                Files.deleteIfExists(respaldos.get(i));
            }
        }
    }

    public List<String> listarRespaldos() throws IOException {

        Path carpeta = Paths.get(rutaRespaldos);

        if (!Files.exists(carpeta)) {
            return List.of();
        }

        try (Stream<Path> archivos = Files.list(carpeta)) {
            return archivos
                    .filter(p -> p.getFileName().toString().startsWith("inventario_backup_"))
                    .map(p -> p.getFileName().toString())
                    .sorted((a, b) -> b.compareTo(a))
                    .collect(Collectors.toList());
        }
    }
}