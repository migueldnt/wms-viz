#!/bin/bash
cd create_config_py/
echo "PREPARANDO ENTORNO PARA LEER GEOSERVER DEFINIDO EN EL ARCHIVO:"
echo "[cargando_workspaces_tojson.py] (modificalo de acuerdo al servidor que desees leer)"
echo " "
echo "<cargando_workspaces_tojson.py> ---> modificado por ultima vez: "
date -r cargando_workspaces_tojson.py
echo " "


entorno="venv"

if [ -d "$entorno" ]; then 
    echo "activando venv"
    source venv/bin/activate
    echo "..ok"
else
    echo "no existe entorno 'venv' en python creando apartir de requirements"
    #pip3 install virtualenv
    #Suponiendo que ya esta instalado virtualenv
    virtualenv -p python3 venv
    source venv/bin/activate
    pip install -r requirements.txt
fi

python cargando_workspaces_tojson.py

