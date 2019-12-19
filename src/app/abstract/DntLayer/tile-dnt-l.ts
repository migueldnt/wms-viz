import { DntLayer } from './dnt-layer';
import { LayerParam } from '../dnt-layer-creator';
import TileLayer  from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileSource from 'ol/source/Tile';
import { LegendItem } from '../../ui/legend-panel/legend-item';

export class TileDntL extends DntLayer{
    
    /**
     *
     */
    constructor(layerParam:LayerParam) {
        super(layerParam);
        //se construye con la capa como tal
        let source=this.detectarSourceOArmar();
        this.layer=new TileLayer({
            source:source
        });
        this.setBasicsToLayer();
    }

    detectarSourceOArmar(){
        let source=null
        //poner aqui todos los ifs, si se pudiese generar 
         if("ol_source_accesor" in this.layerParamObject.settings){
             let sourDec=this.layerParamObject.settings.ol_source_accesor
             switch (sourDec) {
                 case "OSM":
                     source=new OSM();
                     break;
             
                 default:
                     break;
             }
         }
         
        //si despues de todo lo anterior sigue siendo null, armaremos una con la configuracion que se recibio
        if(source==null){
            console.log("NECESITAS DEFINIR QUE CONFIGURACIONES SERAN LAS ESPERADAS ....\n capa:"+this.name+" aun no funciona porque sus parametros no coinciden con los esperados")
            source=new TileSource({});
        } 
        return source;
    }

    getlegend():LegendItem{
        let leyenda:LegendItem=new LegendItem(this.title,this.name);
        leyenda.use_singleColorOrLabel=true;
        leyenda.singleLabel="🌎"
        return leyenda
    }
}
