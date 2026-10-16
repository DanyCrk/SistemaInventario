import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Venta } from '../../core/models/venta';
import { VentaService } from '../../core/services/venta';
import { EMPRESA } from '../../core/constant/empresa';

interface ResumenMetodo {
  nombre: string;
  cantidad: number;
  total: number;
}

@Component({
  selector: 'app-reporte-ventas',
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './reporte-ventas.html',
  styleUrl: './reporte-ventas.css'
})
export class ReporteVentas implements OnInit {

  empresa = EMPRESA;

  desde = '';
  hasta = '';
  metodoFiltro = 0;

  ventas: Venta[] = [];
  resumenMetodos: ResumenMetodo[] = [];

  totalSubtotal = 0;
  totalDescuento = 0;
  totalGeneral = 0;

  fechaImpresion = new Date();

  cargando = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {

    const params = this.route.snapshot.queryParamMap;

    this.desde = params.get('desde') || '';
    this.hasta = params.get('hasta') || '';
    this.metodoFiltro = Number(params.get('metodo')) || 0;

    this.ventaService.listarTodos().subscribe({

      next: (ventas) => {
        this.ventas = this.filtrar(ventas);
        this.calcularTotales();
        this.cargando = false;
      },

      error: (error) => {
        console.error('Error al cargar ventas para el reporte:', error);
        this.error = 'No se pudo generar el reporte.';
        this.cargando = false;
      }

    });
  }

  private filtrar(ventas: Venta[]): Venta[] {

    return ventas
      .filter(venta => {

        if (!venta.fecha) {
          return false;
        }

        const fechaVenta = venta.fecha.substring(0, 10);

        if (this.desde && fechaVenta < this.desde) {
          return false;
        }

        if (this.hasta && fechaVenta > this.hasta) {
          return false;
        }

        if (this.metodoFiltro && venta.metodoPago?.idMetodoPago !== this.metodoFiltro) {
          return false;
        }

        return true;
      })
      .sort((a, b) => (a.idVenta || 0) - (b.idVenta || 0));
  }

  private calcularTotales(): void {

    this.totalSubtotal = this.ventas.reduce((acc, v) => acc + v.subtotal, 0);
    this.totalDescuento = this.ventas.reduce((acc, v) => acc + v.descuento, 0);
    this.totalGeneral = this.ventas.reduce((acc, v) => acc + v.total, 0);

    const agrupado = new Map<string, ResumenMetodo>();

    for (const venta of this.ventas) {

      const nombre = venta.metodoPago?.nombre || 'Sin método';
      const actual = agrupado.get(nombre) || { nombre, cantidad: 0, total: 0 };

      actual.cantidad += 1;
      actual.total += venta.total;

      agrupado.set(nombre, actual);
    }

    this.resumenMetodos = Array.from(agrupado.values());
  }

  get esUnSoloDia(): boolean {
    return !!this.desde && this.desde === this.hasta;
  }

  imprimir(): void {
    window.print();
  }
}