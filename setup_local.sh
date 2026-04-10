#!/bin/bash

echo "Starting local setup..."

if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "Created backend/.env"
else
  echo "backend/.env already exists"
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
  echo "Created frontend/.env"
else
  echo "frontend/.env already exists"
fi

echo "Building and starting Docker containers..."
docker compose up --build -d

echo "Waiting for database to start..."
sleep 8

echo "Running migrations..."
docker compose exec backend python manage.py migrate

echo ""
echo "Setup complete."
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8000"
echo ""
echo "If needed, create a superuser with:"
echo "docker compose exec backend python manage.py createsuperuser"
