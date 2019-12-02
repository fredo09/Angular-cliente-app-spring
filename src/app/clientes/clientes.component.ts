import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Cliente } from './clientes';
import { ClientesService } from './../services/clientes.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;

  constructor(private clientesService: ClientesService,
    private activatedRoute: ActivatedRoute ) { }

  ngOnInit() {
    // this.clientesService.getClientes().subscribe(
    //   (clientes) => {
    //     this.clientes = clientes;
    //   }
    // );
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get('page'); // Casteando valor de string a entero
      if (!page) {
        page = 0;
      }
      this.clientesService.getClientes(page).pipe(
        tap(response => {
            console.log(response['content']);
            console.log('tap 3');
            (response['content'] as Cliente[]).forEach(cliente => {
              console.log(cliente.nombre);
            });
        })
      ).subscribe(response => {
        this.clientes = response['content'] as Cliente[];
        this.paginador = response;
      });
    });
  }

  EliminarCliente(cliente: Cliente): void {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: false,
    });
    swalWithBootstrapButtons({
      title: 'Estas Seguro?',
      text: `Eliminar el cleinte ${cliente.nombre}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, estoy de Acuerdo!',
      cancelButtonText: 'No , estoy de Acuerdo',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clientesService.deleteCliente(cliente.id).subscribe(
          response => {

            this.clientes = this.clientes.filter(cli => cli !== cliente);

            swalWithBootstrapButtons(
              'Deleted!',
              'Your file has been deleted.',
              'success'
            );
          }
        );

      }
    });
  }
}
