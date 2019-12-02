import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from './clientes';
import swal from 'sweetalert2';

import { ClientesService } from '../services/clientes.service';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  public Cliente: Cliente = new Cliente();
  public Errores: string [];
  public titulo = 'Crear Cliente';
  constructor(private clienteService: ClientesService, private router: Router, private activateRouter:  ActivatedRoute) { }

  ngOnInit() {
    this.obtenerCliente();
  }

  public obtenerCliente(): void {
    this.activateRouter.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe(
          cliente => {
            this.Cliente = cliente;
          }
        );
      }
    });
  }

  public create(): void {
    this.clienteService.createCliente(this.Cliente).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      Cliente => {
       console.log('Mis datos ', Cliente.nombre);
        this.router.navigate(['/clientes']);
        swal('Nuevo cliente',
            `Cliente ${Cliente.nombre} Creado Existosamente!`,
            'success'
          );
      },
      err => {
        this.Errores = err.error.Errores as string [];
        console.log(err.status);
        console.log(err);
        console.log(err.error.Errores);
      }
    );
  }

  // Una forma de recuperar los datos del back
  public actualizarCliente(): void {
    this.clienteService.updateCliente(this.Cliente).subscribe(
      response => {
        this.router.navigate(['/clientes']);
        swal('Cliente Actualizado', `El cliente ${response.Cliente.nombre} ha sido Actualizado Correctamente`),
        // tslint:disable-next-line:no-unused-expression
        'success';
      },
      err => {
        this.Errores = err.error.errores as string [];
        console.log(err.status);
        console.log(err.error.errores);
      }
    );
  }

}
