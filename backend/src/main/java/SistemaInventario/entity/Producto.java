package SistemaInventario.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;


@Entity
@Table(name = "productos")

public class Producto {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (name = "id_producto")
    private Integer idProducto;
    
    @Column(name = "codigo", nullable = false, unique = true, length = 50)
    private String codigo;

    @Column (name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column (name = "descripcion")
    private String descripcion;

    
    @Column (name = "precio_compra", nullable = false)
    private BigDecimal precioCompra;

    
    @Column (name = "precio_venta", nullable = false)
    private BigDecimal precioVenta;

    @Column(name = "stock", nullable = false)
    private Integer stock=0;

    @Column (name = "stock_minimo", nullable = false)
    private Integer stockMinimo=0;

    @ManyToOne 
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @Column (name = "activo", nullable = false)
    private Boolean activo = true;

    @Column (name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    public Producto() {
    }

    public Producto(String codigo, String nombre, String descripcion, BigDecimal precioCompra, BigDecimal precioVenta, Integer stockMinimo, Categoria categoria) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precioCompra = precioCompra;
        this.precioVenta = precioVenta;
        this.stock = 0;
        this.stockMinimo = stockMinimo;
        this.categoria = categoria;
        this.activo = true;
        this.fechaCreacion = LocalDateTime.now();
    }

    public Integer getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Integer idProducto) {
        this.idProducto = idProducto;
    }   

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
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

    public BigDecimal getPrecioCompra() {
        return precioCompra;
    }

    public void setPrecioCompra(BigDecimal precioCompra) {
        this.precioCompra = precioCompra;
    }

    public BigDecimal getPrecioVenta() {
        return precioVenta;
    }

    public void setPrecioVenta(BigDecimal precioVenta) {
        this.precioVenta = precioVenta;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getStockMinimo() {
        return stockMinimo;
    }

    public void setStockMinimo(Integer stockMinimo) {
        this.stockMinimo = stockMinimo;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
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

