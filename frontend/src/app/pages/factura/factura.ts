import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { Venta } from '../../core/models/venta';
import { VentaService } from '../../core/services/venta';
import { DetalleVenta } from '../../core/models/detalle-venta';
import { DetalleVentaService } from '../../core/services/detalle-venta';
import { EMPRESA } from '../../core/constant/empresa';

@Component({
  selector: 'app-factura',
  imports: [CommonModule, DatePipe, DecimalPipe],
  templateUrl: './factura.html',
  styleUrl: './factura.css'
})
export class Factura implements OnInit {

  empresa = EMPRESA;

  venta: Venta | null = null;
  detalles: DetalleVenta[] = [];

  cargando = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService,
    private detalleVentaService: DetalleVentaService
  ) {}

  ngOnInit(): void {

    const idVenta = Number(this.route.snapshot.paramMap.get('id'));

    if (!idVenta) {
      this.error = 'Venta no válida.';
      this.cargando = false;
      return;
    }

    this.ventaService.buscarPorId(idVenta).subscribe({

      next: (venta) => {
        this.venta = venta;

        this.detalleVentaService.listarPorVenta(idVenta).subscribe({
          next: (detalles) => {
            this.detalles = detalles;
            this.cargando = false;
          },
          error: (error) => {
            console.error('Error al cargar detalle:', error);
            this.error = 'No se pudo cargar el detalle de la venta.';
            this.cargando = false;
          }
        });
      },

      error: (error) => {
        console.error('Error al cargar venta:', error);
        this.error = 'No se pudo cargar la venta.';
        this.cargando = false;
      }

    });
  }

  imprimir(): void {
    window.print();
  }
}
