import { DntLayer, DescargableInfo } from './dnt-layer';
import { LayerParam } from '../dnt-layer-creator';
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import ImageWMS from 'ol/source/ImageWMS';
import { LegendItem } from "../../ui/legend-panel/legend-item";
import { Map, ImageTile } from 'ol';
import * as olPixel from 'ol/pixel'

import ImageLayer from 'ol/layer/Image';

export class WMSDntL extends DntLayer {
    settings: WMSSettingsParam;

    constructor(layerParam: LayerParam) {
        super(layerParam);
        this.settings = this.layerParamObject.settings;
        //permitir la descarga por default, e interpretarla por wfs,si no lo que se haya esecificado en la configuracion
        this.settings.allow_downloaddata = this.settings.allow_downloaddata != undefined ? this.settings.allow_downloaddata : true;
        this.settings.options_downloaddata = this.settings.options_downloaddata != undefined ? this.settings.options_downloaddata : { "from_wfs": true };
        this.allow_downlaoad = this.settings.allow_downloaddata;

        this.layer = new ImageLayer({
            source: new ImageWMS({
                url: this.settings.url,
                params: this.settings.request_body,
                serverType: "geoserver",
                attributions:this.settings.attributions || "Conacyt"
                /*tileLoadFunction:function(imageTile:ImageTile, src) {
                    console.log(imageTile.getTileCoord());
                    (<HTMLImageElement> imageTile.getImage()).src = src;
                  } 
                */
            })
        });
        if ("extent" in this.settings) {
            this.layer.setExtent(this.settings.extent);
        }
        this.setBasicsToLayer();

        

    }

    getlegend(): LegendItem {
        let leyenda: LegendItem = new LegendItem(this.title, this.name);
        leyenda.use_singleColorOrLabel = false;
        leyenda.use_img = true;
        let params: string = "?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" + this.settings.request_body.LAYERS;
        leyenda.img_url = this.settings.url + params;
        return leyenda
    }

    getFeatureInfo(pixel:olPixel,mapsize:number[],mapExtent:number[],callback:Function):string{
        //quitar los parametros no necesarios, apegarse a a documentacion
        let params:any={"SERVICE":"WMS","VERSION":"1.1.1","REQUEST":"GetFeatureInfo",
        /*"FORMAT":"image/png", "TRANSPARENT":"true",*/ "QUERY_LAYERS":this.settings.request_body.LAYERS,
        "LAYERS":this.settings.request_body.LAYERS,
        "exceptions":"application/vnd.ogc.se_inimage",
        "INFO_FORMAT":"application/json","FEATURE_COUNT":"20","X":Math.round( pixel[0] ),"Y": Math.round( pixel[1] ),
        "SRS":"EPSG:4326","STYLES":"","WIDTH":mapsize[0],"HEIGHT":mapsize[1],
        "BBOX":mapExtent.join(",")}
        let parms=Object.keys(params).map((k)=>{
            //console.log(info)
            return encodeURIComponent(k)+"="+encodeURIComponent(params[k])
        })
        return this.settings.url+"?"+parms.join("&")
    }

    getOpcionesDescarga(mapa: Map = null): DescargableInfo[] {
        let opciones: DescargableInfo[] = []
        if (this.settings.allow_downloaddata) {
            if (this.settings.options_downloaddata.from_wfs) {
                let exp=/(\/wms\??)(?!.*\1)/gi
                let urls=this.settings.url.replace(exp,"/wfs")
                let bbox=mapa.getView().calculateExtent(mapa.getSize()).join(",")+",EPSG:4326"
                //definiendo datmbien un url de la previzualizacion
                let url_prev:string=this.settings.url+"?request=GetMap&Format=image/png&bbox="+mapa.getView().calculateExtent(mapa.getSize()).join(",")+"&layers="+this.settings.request_body.LAYERS+"&width=250&height=200"
                
                let op_shp: DescargableInfo = {
                    title: "SHP desde vista actual de mapa",
                    url: urls,
                    params_query: {
                        request: "GetFeature", version: "1.1.0", typeName: this.settings.request_body.LAYERS,
                        outputformat: "shape-zip",
                        bbox:bbox
                    },
                    previzualiza:true,
                    url_prev:url_prev,
                    extension:"zip"
                }
                op_shp.formed_url=DntLayer.DescargableInfo_formedUrl(op_shp)
                opciones.push(op_shp)
                let op_gejson: DescargableInfo = {
                    title: "GeoJSON desde vista actual de mapa",
                    url: urls,
                    params_query: {
                        request: "GetFeature", version: "1.1.0", typeName: this.settings.request_body.LAYERS,
                        outputformat: "application/json",
                        bbox:bbox
                    },
                    previzualiza:true,
                    url_prev:url_prev,
                    extension:"geojson"
                }
                op_gejson.formed_url=DntLayer.DescargableInfo_formedUrl(op_gejson)
                opciones.push(op_gejson)
                let op_gml: DescargableInfo = {
                    title: "GML desde vista actual de mapa",
                    url: urls,
                    params_query: {
                        request: "GetFeature", version: "1.1.0", typeName: this.settings.request_body.LAYERS,
                        outputformat: "GML3",
                        bbox:bbox
                    },
                    previzualiza:true,
                    url_prev:url_prev,
                    extension:"gml"
                }
                op_gml.formed_url=DntLayer.DescargableInfo_formedUrl(op_gml)
                opciones.push(op_gml)

            } else {

            }
        }
        return opciones
    }

}

export interface WMSSettingsParam {
    request_body: any,
    url: string,
    extent?: number[],
    allow_downloaddata?: boolean,//default true
    options_downloaddata?: WMSOptionsDownloadData, //default interpreta wfs
    attributions?:string
}

export interface WMSOptionsDownloadData {
    from_wfs?: boolean
}