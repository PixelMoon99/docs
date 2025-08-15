#!/bin/sh
echo "Pixelmoon One-Click Setup Script"
if [ ! -f .env ]; then
  cp .env.example .env
  echo ".env created from .env.example. Edit it with real credentials before running."
fi
echo "Building docker images..."
docker-compose build
echo "Starting services..."
docker-compose up -d
echo "Done. Visit http://localhost (or your server IP)"
