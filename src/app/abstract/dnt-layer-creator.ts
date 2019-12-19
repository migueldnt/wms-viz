import Map from 'ol/Map'
import BaseLayer from 'ol/layer/Base';
import { TileDntL } from './DntLayer/tile-dnt-l';
import { DntLayer } from './DntLayer/dnt-layer';
import { GroupDntL } from './DntLayer/group-dnt-l';
import { WMSDntL } from './DntLayer/wmsdnt-l';
import { LegendItem } from '../ui/legend-panel/legend-item';
import { ThrowStmt } from '@angular/compiler';

export class DntLayerCreator {
    map: Map;
    jsonLoaded: any;

    /**
     * La lista de objetos que son parametros en el json
     *
     * @type {LayerParam[]}
     * @memberof DntLayerCreator
     */
    layersParams: LayerParam[];

    /**
     * lOS layers (Dntlayer) que sirven de mapa base en el mapa
     *
     * @type {DntLayer[]}
     * @memberof DntLayerCreator
     */
    layers_base: DntLayer[] = [];

    /**
     * lOS layers (DntLayer) que se desglozaran en forma de arbol para apagar y prender
     *
     * @type {DntLayer[]}
     * @memberof DntLayerCreator
     */
    layers_main: DntLayer[] = [];

    groupLayersBase: GroupDntL;

    groupLayersMain: GroupDntL;

    legends:LegendItem[]=[]

    constructor(map: Map, jsonLoaded: any) {
        this.map = map;
        this.jsonLoaded = jsonLoaded;
        this.layersParams = <LayerParam[]>this.jsonLoaded.layers;
    }

    setupMap() {
        //de las configuraciones necesarias aplicarselas al mapa
        //primero las de el centro y zoom y todo eso, ver si es necesario hacer interfaces
        let zoom: number = this.jsonLoaded.settings.zoom;
        let center: number[] = this.jsonLoaded.settings.center;
        this.map.getView().setCenter(center);
        this.map.getView().setZoom(zoom);
        //despues lo de los layers, construirlos
        let layersTodos: DntLayer[] = [];
        this.layersParams.forEach(layerParam => {
            // console.log(layerParam);
            let unDntLayer: DntLayer = DntLayerCreator.construirDntLayer(layerParam);
            //cuando cambie el layer se activara/desactivara la leyenda
            unDntLayer.onChangeVisible((dntlayer:DntLayer,status:boolean)=>{
                if(status){
                    //agregar la leyenda 
                    let ll=dntlayer.getlegend()
                    this.legends.push(ll)
                }else{
                    //buscar y remover la leyenda
                    let ele=this.legends.find(leg=> leg.identificador==dntlayer.name)
                    let idx=this.legends.indexOf(ele);
                    if (idx>=0){
                        this.legends.splice(idx,1)
                    }
                    
                }
            })
            //console.log(unDntLayer.layer)  //aqui el layer es undefineds
            layersTodos.push(unDntLayer);
        });
        //obtener las leyendas de todos, pero solo mostrar de los que estan visibles...
        layersTodos.forEach(layer=>{
            if(layer.visible){
                let leyenda:LegendItem=layer.getlegend();
                this.legends.push(leyenda);
            }
        })
        //debemos ordenarlos en los grupos de capas base y por fin agregarlos al mapa
        this.ordenarlayersEnArbol(layersTodos);
        //ya ordenados hay que agregarlos al mapa para que se vean chidos
        this.addLayersToMap();

    }

    private addLayersToMap() {
        //creare dos grupos de layers para tener todo en 2 grandes ordenes base y main
        this.groupLayersBase = new GroupDntL({ name: "_DNT_BASE_", title: "", type: "group", settings: {}, visible: true, opacity: 1 })
        this.groupLayersBase.setHijos(this.layers_base);
        //agregarlos y hacer que solo sea visible uno
        this.map.addLayer(this.groupLayersBase.layer);
        //console.log(this.map.getLayers())

        this.groupLayersMain = new GroupDntL({ name: "_DNT_MAIN_", title: "", type: "group", settings: {}, visible: true, opacity: 1 })
        this.groupLayersMain.setHijos(this.layers_main);
        this.map.addLayer(this.groupLayersMain.layer);
    }

    private ordenarlayersEnArbol(todosLayers: DntLayer[]) {
        //console.log(todosLayers);   
        let arbol: any = this.jsonLoaded.skeleton;
        if ("base" in arbol) {
            //llenar todos los que perteneceran al grupo base
            let capas: any[] = arbol.base;
            capas.forEach(capa_name => {
                //buscar capa en todos los layers y agregarla a su grupo
                let capa_toadd = todosLayers.find((element) => element.name == capa_name);
                //console.log(capa_toadd,capa_name)
                this.layers_base.push(capa_toadd)
            });
        }

        let names_def = "group_";
        let increm = 0;
        if ("main" in arbol) {
            //lenar todos los que pertenecen al main
            //hasta 3 niveles podra tener el arbol de capas
            let capas: any[] = arbol.main;
            capas.forEach(capa => {
                //si capa es string --- es un layer
                //si capa es object --- es un grupo 
                if (typeof capa == "string") {
                    let capa_toadd = todosLayers.find((element) => element.name == capa)
                    this.layers_main.push(capa_toadd)

                }
                if (typeof capa == "object") {
                    //es un grupo y hay que verificar niveles ... pensarlo bien
                    increm++;
                    let name1 = names_def + increm;
                    let title1 = name1;
                    if ("title" in capa) {
                        title1 = capa.title;
                    }
                    let layers1: any[] = capa.layers;
                    let layersDnt1: DntLayer[] = []
                    layers1.forEach(lay1 => {
                        //repetir el procedimiento porque este es el segundo nivel
                        if (typeof lay1 == "string") {
                            let capa_toadd1 = todosLayers.find((element) => element.name == lay1);
                            layersDnt1.push(capa_toadd1);
                        }
                        if (typeof lay1 == "object") {
                            increm++;
                            let name2 = names_def + increm;
                            let title2 = name2;
                            if ("title" in lay1) {
                                title2 = lay1.title;
                            }
                            let layers2: any[] = lay1.layers;
                            let layersDnt2: DntLayer[] = [];
                            layers2.forEach(lay2 => {
                                //repetir el procedimiento para el tercer nivel
                                if (typeof lay2 == "string") {
                                    let capa_toadd2 = todosLayers.find((element) => element.name == lay2);
                                    layersDnt2.push(capa_toadd2);
                                }
                                if (typeof lay2 == "object") {
                                    increm++
                                    let name3 = names_def + increm;
                                    let title3 = name3;
                                    if ("title" in lay2) {
                                        title3 = lay2.title;
                                    }
                                    let layers3: any[] = lay2.layers;
                                    let layersDnt3: DntLayer[] = [];
                                    layers3.forEach(lay3 => {
                                        //en este nivel solo se aceptan capas no grupos ...
                                        if (typeof lay3 == "string") {
                                            let capa_toadd3 = todosLayers.find((element) => element.name == lay3);
                                            layersDnt2.push(capa_toadd3);
                                        }
                                    });
                                    let GROUP3 = new GroupDntL({ name: name3, title: title3, type: "group", settings: {}, visible: true, opacity: 1 });
                                    GROUP3.setHijos(layersDnt3);
                                }
                            });
                            let GROUP2 = new GroupDntL({ name: name2, title: title2, type: "group", settings: {}, visible: true, opacity: 1 });
                            GROUP2.setHijos(layersDnt2);
                        }
                    });
                    let GROUP1 = new GroupDntL({ name: name1, title: title1, type: "group", settings: {}, visible: true, opacity: 1 });
                    GROUP1.setHijos(layersDnt1);
                    this.layers_main.push(GROUP1)
                }
            });

        }

    }

    public static construirDntLayer(layerParam: LayerParam): DntLayer {
        let tipo = layerParam.type;
        switch (tipo) {
            case "tile":
                return new TileDntL(layerParam);
                break;
            case "wms":
                return new WMSDntL(layerParam);
            default:
                //return new DntLayer(layerParam);
                console.log("AGREGA ESTE TIPO DE LAYER PARA SOPORTARLO "+tipo)
                break;
        }
    }


}



export interface LayerParam {
    type: string,
    name: string,
    title: string,
    description?: string
    visible?: boolean,
    opacity?: number,
    settings: any,
    plugin_view?: any
}