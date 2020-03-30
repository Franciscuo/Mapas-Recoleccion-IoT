#!/bin/bash -e
# Script para iniciar el servicio automáticamente

for port in $(seq 3000); do sudo systemctl start servidores@$port; done

