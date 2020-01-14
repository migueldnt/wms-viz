import { Component, AfterViewInit, Directive, ViewChildren, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Map, View } from 'ol';

@Component({
  selector: 'dnt-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit {
  public olMapa?:Map=null;
  @ViewChild("divMapOl",{static:false}) mapTarget:ElementRef
  constructor(private _renderer:Renderer2) { 
    
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
  }

  public onload_OlMapa=(mapa:Map)=>{}

  setCursorMap(type:string){
    //this._renderer.se
  }


}

