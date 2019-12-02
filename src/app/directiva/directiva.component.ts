import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent implements OnInit {

  constructor() { }

  listacurso : String [] = [
    'TypeString',
    'Javascript',
    'Java EE',
    'Python',
  ]

  //Boton para mostrar el funcionamiento del *ngIF
  habilitar: boolean = true; 

  setHabilitar():void{
    this.habilitar = (this.habilitar == true ) ? false : true;
  }

  //Inicia el componente
  ngOnInit() {
  }

}
