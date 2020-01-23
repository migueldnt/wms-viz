import { Component, AfterViewInit, Directive, ViewChildren, ViewChild, ElementRef, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { Map, View } from 'ol';
import { AppComponent } from 'src/app/app.component';
import { DntLayer } from 'src/app/abstract/DntLayer/dnt-layer';
import { WMSDntL } from 'src/app/abstract/DntLayer/wmsdnt-l';
import { OverlayRef, Overlay } from '@angular/cdk/overlay';
import { Subscription, fromEvent } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { filter } from 'rxjs/operators';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { MatDialog } from '@angular/material';
import { DntAlertaData, DntAlertaComponent } from '../dnt-alerta/dnt-alerta.component';

@Component({
  selector: 'dnt-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit {
  public olMapa?: Map = null;

  /**
   * representa el elemento div que alojara el canvas del mapa
   */
  @ViewChild("divMapOl", { static: false }) mapTarget: ElementRef;

  /**
   * representa el elemento que sera el popup en el mapa
   */
  @ViewChild("infoPopup", { static: false }) infoPopup: TemplateRef<any>;

  /**
   * overlayRef como el ejemplo de layerlist
   */
  overlayRef: OverlayRef | null;

  /**
   * Subscription como en el ejemplo de layerlist
   */
  sub: Subscription
  constructor(private _renderer: Renderer2, public mainAppComponent: AppComponent,
    public overlay: Overlay, public viewContainerRef: ViewContainerRef,public dialog: MatDialog) {

  }

  ngAfterViewInit() {
    this.olMapa = new Map({
      target: this.mapTarget.nativeElement,
      layers: [],
      view: new View({
        projection: "EPSG:4326"
      })
    });
    this.onload_OlMapa(this.olMapa)
    this.olMapa.on("singleclick", (ev: any) => {
      if (this.mainAppComponent.getModeClickInfo()) {
        if (this.mainAppComponent.layerListComponent.currentDntLayer != undefined) {
          let DNTlay: WMSDntL = <WMSDntL>this.mainAppComponent.layerListComponent.currentDntLayer
          this.currentSelectedDNtLayer=DNTlay;
          //console.log(ev.pixel)
          //let url=DNTlay.getFeatureInfo(ev.pixel,this.olMapa.getSize(),this.olMapa.getView().calculateExtent(this.olMapa.getSize()),null)
          let url = DNTlay.getFeatureInfo(ev.coordinate, this.olMapa.getView().getResolution())
          this.setCursorMap("cursor-wait");
          this.mainAppComponent.simpleRequestService.getJson(url).subscribe((data: any) => {
            let data_to_html: DataFeature[] = <any[]>(data.features).map(item => {
              let datos: DataRow[] = [];
              Object.keys(item.properties).forEach(ky => {
                datos.push({ name: ky, value: item.properties[ky] })
              })
              return { rows: datos }
            })

            console.log(data);
            console.log(data_to_html)
            this.setCursorMap("cursor-help");
            this.openPopup(ev, data_to_html);
          }, error => {
            this.setCursorMap("cursor-help");
            this.openPopup(ev, []);
          })
        } else {
          let mensaje:DntAlertaData={mensaje:"Selecciona una capa!!"}
          this.dialog.open(DntAlertaComponent,{data:mensaje})
        }


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

    this.olMapa.on("moveend", (ev) => {
      this.closePopup()
    })
  }

  public onload_OlMapa = (mapa: Map) => { }

  /**
   * el layer actual que se encuentra seleccionado en todo el componente global
   */
  public currentSelectedDNtLayer:DntLayer;

  setCursorMap(type: "cursor-default" | "cursor-help" | "cursor-wait") {
    //console.log(this.mapTarget);

    //this._renderer.removeClass(this.mapTarget,"cursor-move");
    //
    if (type == "cursor-default") {
      this._renderer.removeClass(this.mapTarget.nativeElement, "cursor-help");
      this._renderer.removeClass(this.mapTarget.nativeElement, "cursor-wait");
    }
    if (type == "cursor-help") {
      this._renderer.removeClass(this.mapTarget.nativeElement, "cursor-default");
      this._renderer.removeClass(this.mapTarget.nativeElement, "cursor-wait");
    }
    if (type == "cursor-wait") {
      this._renderer.removeClass(this.mapTarget.nativeElement, "cursor-default");
      this._renderer.removeClass(this.mapTarget.nativeElement, "cursor-help");
    }

    this._renderer.addClass(this.mapTarget.nativeElement, type);

  }





  openPopup(ev: any, attrs: DataFeature[]) {
    //console.log(attrs);

    this.closePopup()
    let x = ev.originalEvent.x;
    let y = ev.originalEvent.y
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: "end",
          originY: "bottom",
          overlayX: "start",
          overlayY: "top"
        }
      ]);
    this.overlayRef = this.overlay.create({
      positionStrategy, scrollStrategy: this.overlay.scrollStrategies.close()
    })
    this.overlayRef.attach(new TemplatePortal(this.infoPopup, this.viewContainerRef,{ $implicit: attrs }))

    //quitarlo despues deun click .. o mejor de scroll ya sea aqui o desde los ol events  
    //usando el sub para que se quite el popup
    /*
    this.sub=fromEvent<MouseEvent>(this.mapTarget.nativeElement,"click")
      .pipe(
        filter(event=>{
          const clicktarget=event.target as HTMLElement;
          return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clicktarget);
        })
      ).subscribe( ()=> this.closePopup())
        */
  }

  closePopup() {
    console.log("se deberia cerrar el overlay")
    this.sub && this.sub.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

}

export interface DataFeature {
  rows: DataRow[]
}

export interface DataRow {
  name: string,
  value: any
}

