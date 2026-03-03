#!/bin/bash
# Despliegue automático para KAI-HG en VPS Hostinger
echo "🚀 Iniciando despliegue de KAI-HG..."

# Bajar últimos cambios
echo "📥 Descargando últimos cambios de GitHub..."
git pull origin main

# Levantar contenedores con Docker Compose usando el archivo de producción
echo "🐳 Reconstruyendo y levantando contenedores Docker (Producción)..."
docker compose -f docker-compose.prod.yml up --build -d

# Limpiar imágenes antiguas para ahorrar espacio en el VPS
echo "🧹 Limpiando imágenes huérfanas..."
docker image prune -f

echo "✅ Despliegue completado."
echo "🌍 Tu aplicación debería estar disponible pronto en http://187.77.222.42"
echo "🛠️  Puedes revisar los logs con: docker compose -f docker-compose.prod.yml logs -f"
