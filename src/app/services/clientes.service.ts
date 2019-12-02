import { Injectable } from '@angular/core';
import { formatDate, DatePipe  } from '@angular/common';
// import { clientes } from './../clientes/clientes.json';
import { Cliente } from './../clientes/clientes';
import { Observable, throwError } from 'rxjs'; // solo de la version 6 en adelante
// import { of } from 'rxjs'; //sintaxsis de la importacion de rxjs en angular 6
import swal from 'sweetalert2';
import { Router } from '@angular/router';

// Importando el HttpsClient
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private urlEnpoint = 'http://localhost:8080/api/clientes';
  private HttpHeaders = new HttpHeaders({ 'Content-type' : 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(page: number): Observable<any []> {
    // return of(clientes); forma estatica sin pedir datos en la base de datos
   // return this.http.get<Cliente []>(this.urlEnpoint); una forma de recibir datos de un apirest
   return this.http.get(`${this.urlEnpoint}/page/${page}`).pipe( // Otra forma pero usando map
     tap((response: any) => {
      console.log('Tap 1');
      (response.content as Cliente[]).forEach(cliente => {
        console.log(cliente.nombre);
      });
     }),
     map((response: any ) => {
      (response.content as Cliente[]).map(cliente => {
        cliente.nombre = cliente.nombre.toUpperCase();
        // Seguda forma de cambiar el formato de fecha
        // const datePipe = new DatePipe('es');
        // cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');
        // cliente.createAt = formatDate( cliente.createAt , 'dd/MM/yyyy', 'en-US'); 1 forma
        return cliente;
      });
      console.log('mi log ', response);
      return response;
     }),
     tap(response => {
      console.log('Tap 2');
      (response.content as Cliente[]).forEach(cliente => {
        console.log(cliente.nombre);
      });
     })
   );
  }

  // Creando cliente
  createCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post(this.urlEnpoint, cliente, {headers: this.HttpHeaders}).pipe(
      map((response: any) => response.Cliente as Cliente),
      catchError(e => {

        if (e.status === 400) {
          return throwError(e);
        }
        console.log(e.error.Message);
        swal('Error' , e.error.Message, 'error');
        return throwError(e);
      })
    );
  }

  // Obteniendo Cliente por ID
  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEnpoint}/${id}`).pipe(
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.log(e.error.Message);
        swal('Error', e.error.Message, 'error');
        return  throwError(e);
      })
    );
  }

  // Actualizando Cliente
  updateCliente(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEnpoint}/${cliente.id}` , cliente , {headers: this.HttpHeaders}).pipe(
      catchError(e => {

        if (e.status === 400) {
          return throwError(e);
        }
        swal('Error', e.error.Message, 'error');
        return throwError(e);
      })
    );
  }

  // Elimimando Cliente
  deleteCliente(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEnpoint}/${id}`, {headers: this.HttpHeaders} ).pipe(
      catchError(e => {
        swal('Error al Eliminar', e.error.Message, 'error');
        return throwError(e);
      })
    );
  }
}
