#!/bin/bash -e
#Script para detener el servicio 

for port in $(seq); do sudo systemctl stop servidores@$port; done


exit 0