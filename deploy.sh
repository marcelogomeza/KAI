#!/bin/bash
# Despliegue automático para KAI-HG en VPS Ubuntu
echo "🚀 Iniciando despliegue de KAI-HG..."

# Bajar últimos cambios (Asegúrate de haber hecho push a tu repositorio primero)
echo "📥 Descargando últimos cambios de GitHub..."
git pull origin main

# Levantar contenedores con Docker Compose
echo "🐳 Reconstruyendo y levantando contenedores Docker..."
docker compose up --build -d

echo "✅ Despliegue completado."
echo "🌍 Tu aplicación debería estar disponible pronto en http://187.77.222.42"
echo "🛠️  Puedes revisar los logs con: docker compose logs -f app"
