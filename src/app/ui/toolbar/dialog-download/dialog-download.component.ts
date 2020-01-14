import { Component, OnInit,Inject } from '@angular/core';
import { DntLayer, DescargableInfo } from 'src/app/abstract/DntLayer/dnt-layer';
import { MatDialogRef , MAT_DIALOG_DATA} from '@angular/material';
import { Map } from 'ol';

@Component({
  selector: 'app-dialog-download',
  templateUrl: './dialog-download.component.html',
  styleUrls: ['./dialog-download.component.scss']
})
export class DialogDownloadComponent implements OnInit {


  public layer:DntLayer;
  descargas_disponibles:DescargableInfo[];
  descarga_seleccionada:DescargableInfo;

  constructor(public dialogRef:MatDialogRef<DialogDownloadComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DialogDownloadData ) {
      this.layer=data.dntLayer;
      this.descargas_disponibles=this.layer.getOpcionesDescarga(data.mapa)
      this.descarga_seleccionada=this.descargas_disponibles[0]
    }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


export interface DialogDownloadData{
  dntLayer:DntLayer,
  mapa:Map
}