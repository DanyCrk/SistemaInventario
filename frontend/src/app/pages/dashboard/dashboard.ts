import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ProductoService } from '../../core/services/producto';
import { VentaService } from '../../core/services/venta';
import { ClienteService } from '../../core/services/cliente';
import { Producto } from '../../core/models/producto';
import {Categorias} from "../categoria/categoria";
import { CategoriaService } from '../../core/services/categoria';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  totalProductos = 0;
  stockBajo = 0;
  totalVentas = 0;
  totalClientes = 0;
  totalCategorias = 0;

  cargando = true;

  productosStockBajo: Producto[] = [];
  mostrarModalStockBajo = false;

  constructor(
    private productoService: ProductoService,
    private ventaService: VentaService,
    private clienteService: ClienteService,
    private categoriaService: CategoriaService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {

    this.cargando = true;

    this.productoService.listarTodos().subscribe({
      next: (productos) => {
        this.totalProductos = productos.length;
        this.productosStockBajo = productos.filter(p => p.stock <= p.stockMinimo);
        this.stockBajo = this.productosStockBajo.length;
      },
      error: (error) => console.error('Error al cargar productos:', error)
    });

    this.ventaService.listarTodos().subscribe({
      next: (ventas) => {
        this.totalVentas = ventas.length;
      },
      error: (error) => console.error('Error al cargar ventas:', error)
    });
    this.categoriaService.listarTodos().subscribe({
      next: (categorias) => {
        this.totalCategorias = categorias.length;
      },
      error: (error) => console.error('Error al cargar categorías:', error)
    });

    this.clienteService.listarTodos().subscribe({
      next: (clientes) => {
        this.totalClientes = clientes.length;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        this.cargando = false;
      }
    });
  }

  irAProductos(): void {
    this.router.navigate(['/productos']);
  }

  irAClientes(): void {
    this.router.navigate(['/clientes']);
  }

  irVentas(): void {
    this.router.navigate(['/ventas']);
  }
  irACategorias(): void {
    this.router.navigate(['/categorias']);
  }

  abrirStockBajo(): void {
    this.mostrarModalStockBajo = true;
  }

  cerrarStockBajo(): void {
    this.mostrarModalStockBajo = false;
  }
  respaldarAhora(): void {
  this.http.post('http://localhost:8080/backup/manual', {}, { responseType: 'text' }).subscribe({
    next: () => alert('Respaldo creado correctamente.'),
    error: () => alert('No se pudo crear el respaldo.')
  });
}
}