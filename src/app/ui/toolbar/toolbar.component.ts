import { Component, OnInit,Input } from '@angular/core';
import { Map } from 'ol';
import {MatDialog} from '@angular/material/dialog'
import {LayerListComponent} from "src/app/ui/layer-list/layer-list.component"
import { DialogDownloadData, DialogDownloadComponent } from './dialog-download/dialog-download.component';
import { DntAlertaData, DntAlertaComponent } from '../dnt-alerta/dnt-alerta.component';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input() olMapa:Map
  @Input() layerListComp:LayerListComponent;
  //@Input() layerList:LayerlistComponent
  constructor(public dialog: MatDialog,public appComponent:AppComponent) { }

  ngOnInit() {
    console.log(this.layerListComp);
    
  }

  prueba1(){
    console.log(this.layerListComp.currentDntLayer);
  }

  descarga_button(){
    if(this.layerListComp.currentDntLayer!=undefined){
      if(this.layerListComp.currentDntLayer.allow_downlaoad){
        let dataSend:DialogDownloadData={dntLayer:this.layerListComp.currentDntLayer,mapa:this.olMapa}
        this.dialog.open(DialogDownloadComponent,{width:"350px",data:dataSend} )
      }else{
        let mensaje:DntAlertaData={mensaje:this.layerListComp.currentDntLayer.title+" no permite descargar información",textoBoton:"Enterado"}
        this.dialog.open(DntAlertaComponent,{data:mensaje})
      }
      
      
    }else{
      let mensaje:DntAlertaData={mensaje:"Selecciona una capa!!"}
      this.dialog.open(DntAlertaComponent,{data:mensaje})
    }
    
    
  }

  info_button(){
    this.appComponent.modeClickInfo= ! this.appComponent.modeClickInfo;
    

  }

}
