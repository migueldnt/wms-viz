import { DntLayer } from './dnt-layer';
import { LayerParam } from '../dnt-layer-creator';
import LayerGroup from 'ol/layer/Group';
import { Collection } from 'ol';
import BaseLayer from 'ol/layer/Base';

export class GroupDntL extends DntLayer {
    
    hijos:DntLayer[];

    constructor(layerParam:LayerParam){
        super(layerParam);
        this.layer=new LayerGroup({
            layers:[]
        })
        this.setBasicsToLayer();
        this.isGroup=true;
        
    }

    public setHijos(hijos:DntLayer[]){
        //console.log(hijos)
        this.hijos=hijos;
        //traer los layers de estos
        let layersOL:BaseLayer[]=[]
        this.hijos.forEach(element => {
            layersOL.push(element.layer);
        });
        let coll1=new Collection(layersOL);
        (this.layer as LayerGroup).setLayers(coll1);
    }
    
}
