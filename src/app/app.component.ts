import { Component, ViewChild,AfterViewInit } from '@angular/core';
import { MapaComponent } from './ui/mapa/mapa.component';
import { Map} from 'ol';
import { SimpleRequestService } from './services/simple-request.service';
import { DntLayerCreator } from "./abstract/dnt-layer-creator"
import { LegendItem } from './ui/legend-panel/legend-item';
import { LayerRefreshService } from './services/layer-refresh.service';
import { DntLayer } from './abstract/DntLayer/dnt-layer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit  {
  title = 'wms-viz';
  @ViewChild(MapaComponent,{static:false}) mapComponent:MapaComponent
  mapa:Map=null;
  mapCreator: DntLayerCreator;
  legends:LegendItem[]=[];
  eljson1:DntLayer[] = [];

  private modeClickInfo:boolean=false;
  
  constructor(public simpleRequestService:SimpleRequestService,private _layerRefreshService:LayerRefreshService){

  }

  ngOnInit(){
    
    
  }

  ngAfterViewInit(){
    
      this.mapa=this.mapComponent.olMapa;
      //console.log(this)
      this.simpleRequestService.getJson("assets/map1.json").subscribe( (data)=>{
        //console.log(data);
        
        this.mapCreator = new DntLayerCreator(this.mapa, data)
        this.mapCreator.setupMap()
        this.eljson1 = this.mapCreator.groupLayersMain.hijos;
        this._layerRefreshService.refresh("refrescando capas en arbol..")
        this.legends=this.mapCreator.legends;
      });
  }
  
  toogleModeClickInfo(){
    this.modeClickInfo=!this.modeClickInfo
    if(this.modeClickInfo){
      this.mapComponent.setCursorMap("cursor-help")
    }else{
      this.mapComponent.setCursorMap("cursor-default")
    }
  }

  getModeClickInfo():boolean{
    return this.modeClickInfo;
  }

}
