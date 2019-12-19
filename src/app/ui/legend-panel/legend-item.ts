export class LegendItem {

    identificador=""
    layer_title:string=""
    use_singleColorOrLabel:boolean=true;
    singleColor:string=""
    singleLabel="";
    use_img:boolean=false;
    img_url:string=""
    use_renderHtmlElement:boolean=false;
    renderHtmlElement:any=null;
  
  
    constructor(layer_title:string,id="",color:string="white") {
      this.layer_title=layer_title
      this.identificador=id;
      this.singleColor=color;
    }
  
    public static getSimpleInstance():LegendItem{
      return new LegendItem("unamed","unamed")
    }
  }
  