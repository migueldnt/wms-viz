import BaseLayer from 'ol/layer/Base';
import { LayerParam } from '../dnt-layer-creator';
import { LegendItemComponent } from '../../ui/legend-panel/legend-item/legend-item.component';
import { LegendItem } from "../../ui/legend-panel/legend-item";
import { Map } from 'ol';

export class DntLayer {
    layer:BaseLayer
    type:string
    name:string
    title:string
    visible:boolean
    isPluginView:boolean
    isGroup:Boolean
    layerParamObject:LayerParam
    allow_downlaoad=false;
    

    /**
     * si esta activo, es diferente a si esta visible activo es cuando esta disponible su cambio desde el arbol de layers
     */
    active:boolean=true;

    private _fn_onChangeVisible:Function=(dntLayer:DntLayer,visibleStatus:boolean)=>{};

    /**
     * Construtor de DntLayer
     * @param layerParam 
     */
    constructor(layerParam:LayerParam){
        this.layerParamObject=layerParam;
        this.type=layerParam.type;
        this.name=layerParam.name;
        this.title=layerParam.title;
        this.visible=("visible" in layerParam)?layerParam.visible:true;
    }

    setBasicsToLayer(){
        this.layer.setVisible(this.visible);
        this.layer.set("name",this.name);
        this.layer.setOpacity(("opacity" in this.layerParamObject)?this.layerParamObject.opacity:1);
    }

    setVisible(visible:boolean){
        this.visible=visible
        if(this.active){
            this.layer.setVisible(visible);
            this._fn_onChangeVisible(this,visible);
        }
    }

    setActive(active:boolean){
        this.active=active
        if(this.active){
            this.layer.setVisible(this.visible)
        }else{
            this.layer.setVisible(this.active)
        }
    }

    toggleVisible(){
        let nueval=!this.visible;
        this.setVisible(nueval);
    }

    onChangeVisible(fn:Function=(dntLayer:DntLayer,visibleStatus:boolean)=>{}){
        this._fn_onChangeVisible=fn;
    }

    /**
     * reescribible method
     */
    getlegend():LegendItem{
        return new LegendItem(this.title,this.name);
    }

    /**
     * reescribible method
     */
    getOpcionesDescarga(mapa:Map=null):DescargableInfo[]{
        return [];
    }

    public static DescargableInfo_formedUrl(info:DescargableInfo):string{
        let parms=Object.keys(info.params_query).map((k)=>{
            //console.log(info)
            return encodeURIComponent(k)+"="+encodeURIComponent(info.params_query[k])
        })
        return info.url+"?"+parms.join("&")
    }
}


export interface DescargableInfo{
    url:string,
    title:string,
    description?:string,
    /**
     * parametros que se le agregan al url
     */
    params_query?:any,
    formed_url?:string
    previzualiza?:boolean,
    url_prev?:string,
    extension?:string
}