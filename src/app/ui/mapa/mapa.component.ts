import { Component, AfterViewInit, Directive, ViewChildren, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Map, View } from 'ol';
import { AppComponent } from 'src/app/app.component';
import { DntLayer } from 'src/app/abstract/DntLayer/dnt-layer';
import { WMSDntL } from 'src/app/abstract/DntLayer/wmsdnt-l';

@Component({
  selector: 'dnt-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit {
  public olMapa?:Map=null;
  @ViewChild("divMapOl",{static:false}) mapTarget:ElementRef
  constructor(private _renderer:Renderer2, public mainAppComponent:AppComponent) { 

  }

  ngAfterViewInit() {
    this.olMapa=new Map({
      target:this.mapTarget.nativeElement,
      layers:[],
      view:new View({
        projection: "EPSG:4326"
      })
    });
    this.onload_OlMapa(this.olMapa)
    this.olMapa.on("singleclick",(ev:any)=>{
      if(this.mainAppComponent.getModeClickInfo()){
        let DNTlay:WMSDntL= <WMSDntL>this.mainAppComponent.layerListComponent.currentDntLayer
        //console.log(ev.pixel)
        let url=DNTlay.getFeatureInfo(ev.pixel,this.olMapa.getSize(),this.olMapa.getView().calculateExtent(this.olMapa.getSize()),null)
        console.log(url);
        
        /*
        En la siguiente funcion podria interpretarse que con el rgba se puede saber si esta tocando un feature sabiendo si
        el rgba es trasnparente o tiene color 
        this.olMapa.forEachLayerAtPixel(ev.pixel,(layer:any,rgba:any)=>{
          console.log(layer.get("name")+" en esta vain");
          console.log(rgba);
          
        })
        */
      }
      
    })
  }

  public onload_OlMapa=(mapa:Map)=>{}

  setCursorMap(type:"cursor-default" | "cursor-help"){
    console.log(this.mapTarget);
    
    //this._renderer.removeClass(this.mapTarget,"cursor-move");
    //
    if(type=="cursor-default"){
      this._renderer.removeClass(this.mapTarget.nativeElement,"cursor-help");
    }
    if(type=="cursor-help"){
      this._renderer.removeClass(this.mapTarget.nativeElement,"cursor-default");
    }
    this._renderer.addClass(this.mapTarget.nativeElement,type);
    
  }


}

