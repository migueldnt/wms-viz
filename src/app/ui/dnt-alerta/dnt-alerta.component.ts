import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'dnt-alerta',
  templateUrl: './dnt-alerta.component.html',
  styleUrls: ['./dnt-alerta.component.scss']
})
export class DntAlertaComponent implements OnInit {

  showBoton:boolean=false;
  showTitulo:boolean=false;
  constructor(public dialogRef:MatDialogRef<DntAlertaComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DntAlertaData ) {
      if (data.textoBoton!=undefined && data.textoBoton != "" ){
        this.showBoton=true
      }
      if (data.titulo!=undefined && data.titulo != "" ){
        this.showTitulo=true
      }
    }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface DntAlertaData{
  mensaje:string,
  class?:string,
  titulo?:string,
  textoBoton?:string
}