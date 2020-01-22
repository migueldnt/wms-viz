geoserver_url="http://localhost:8080/geoserver"
geoserver_rest=geoserver_url+"/rest"
#definir los workspaces a utilizar
workspaces_use0=[("mexico","preubas"),("tiger","tiger NY")]
workspaces_use= [w[0] for w in  workspaces_use0]
workspaces_use

import requests
todos_works=requests.get(geoserver_rest+"/workspaces.json",auth=("admin","geoserver")).json()

disponibles=[ ww["name"] for ww in todos_works["workspaces"]["workspace"] ]
matches=set(disponibles) & set(workspaces_use)
works_to_usar=[]
for ww in todos_works["workspaces"]["workspace"]:
    for unm in matches:
        if ww["name"]==unm:
            reqds=requests.get(ww["href"],auth=("admin","geoserver"))
            works_to_usar.append(reqds.json())
            

for wok in works_to_usar:
    datareqds=requests.get(wok["workspace"]["dataStores"],auth=("admin","geoserver") )
    datstores=datareqds.json()
    wok["list_dataStores"]=[]
    for ds in datstores["dataStores"]["dataStore"]:
        reqds=requests.get(ds["href"],auth=("admin","geoserver"))
        datastore1=reqds.json() #obj to list
        #print(datastore1["dataStore"]["featureTypes"])
        hrefs_features_req=requests.get(datastore1["dataStore"]["featureTypes"],auth=("admin","geoserver"))
        hrefs_features=hrefs_features_req.json()
        datastore1["list_featureTypes"]=[]
        for featureqq in hrefs_features["featureTypes"]["featureType"]:
            req_feature1=requests.get(featureqq["href"],auth=("admin","geoserver"))
            featureType1=req_feature1.json()
            datastore1["list_featureTypes"].append(featureType1)
        wok["list_dataStores"].append(datastore1)

settings_wms_viz={
    "settings": {
        "zoom": 10,
        "center": [
            -99.133209,
            19.432608
        ]
    },
    "skeleton": {
        "base": [
            "base_osm"
        ],
        "main":[]
    },
    "layers":[
        {
            "type": "tile",
            "name": "base_osm",
            "title": "Open Street Map",
            "visible": True,
            "settings": {
                "ol_source_accesor": "OSM"
            },
            "plugin_view": {}
        }
    ]
}
for w1 in works_to_usar:
    print(w1["workspace"]["name"]+"<<<--")
    layers_grupo=[]
    for d1 in w1["list_dataStores"]:
        for f1 in d1["list_featureTypes"]:
            elf=f1["featureType"]
            lay={
                "type":"wms",
                "name":elf["name"],
                "title":elf["title"],
                "visible":False,
                "opacity":1,
                "settings":{
                    "request_body":{
                        "LAYERS":w1["workspace"]["name"]+":"+elf["name"],
                        "SRS":elf["srs"],
                        "TILED":False,
                    },
                    "url":geoserver_url+"/wms",
                    "extent":[ elf["latLonBoundingBox"]["minx"],elf["latLonBoundingBox"]["miny"],
                              elf["latLonBoundingBox"]["maxx"],elf["latLonBoundingBox"]["maxy"]
                             ],
                    "allow_downloaddata":True,
                    "options_downloaddata":{
                        "from_wfs":True
                    }
                }
            }
            settings_wms_viz["layers"].append(lay)
            layers_grupo.append(elf["name"])
            print(elf["name"]+"<-->"+elf["title"])
    titulo_real=workspaces_use0[workspaces_use.index( w1["workspace"]["name"] )][1]
    settings_wms_viz["skeleton"]["main"].append(dict(title=titulo_real,layers=layers_grupo))

import json
with open("../src/assets/map1.json","w") as fp:
    json.dump(settings_wms_viz,fp)