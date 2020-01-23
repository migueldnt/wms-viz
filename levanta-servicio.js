const express=require("express");
const app=express();

app.use(express.static(__dirname+'/dist/wms-viz/' ))

app.listen("3000",()=>{
    console.log("Servidor de visor wms corriento en el puero 3000")
})