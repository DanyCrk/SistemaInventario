package SistemaInventario.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;



@Entity
@Table(name = "usuarios")

public class Usuario {
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Integer idUsuario;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column (name = "correo", nullable = false, unique = true, length = 150)
    private String correo;

    @Column (name = "password", nullable= false, length = 255)
    private String password;

    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Role rol;

    @Column (name = "activo", nullable = false)
    private Boolean activo = true;

   
    @Column (name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    public Usuario() {
    }

    public Usuario(String nombre, String correo, String password, Role rol){
        this.nombre = nombre;
        this.correo = correo;
        this.password = password;
        this.rol = rol;
        this.activo = true;
        this.fechaCreacion = LocalDateTime.now();
    }


//getters and setters

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRol() {
        return rol;
    }

    public void setRol(Role rol) {
        this.rol = rol;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

}
