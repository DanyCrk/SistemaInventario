package SistemaInventario.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "roles")

public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column (name = "id_rol")
    private Integer idRol;


    @Column(name = "nombre", nullable = false, unique = true, length = 50)
    private String nombre;

    @Column (name = "descripcion", length = 255)
    private String descripcion;

    public Role() {
    }

    public Role(String nombre, String descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }


    //getters and setters

    public Integer getIdRol() {
        return idRol;
    }

    public void setIdRol(Integer idRol) {
        this.idRol = idRol;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }      

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
}
