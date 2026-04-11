# Adventure Tracker

## Overview

Adventure Tracker is a full stack web app where users can search for things to do in a city and save them.
You can look up parks, trails, concerts, and events, then save the ones you want and add your own notes.
The goal of the app is to make it easier to find things to do and keep track of them.

---

## Features

- Search for adventures by city
- View results from APIs (parks, trails, events, concerts)
- Save adventures to your list
- Add notes to saved adventures
- Mark adventures as completed or planned
- Edit and delete saved adventures
- Last search is remembered when returning to the home page

---

## Tech Stack

Frontend:
- React (Vite)

Backend:
- Django
- Django REST Framework

Database:
- PostgreSQL

Other:
- Docker / Docker Compose
- AWS EC2 (deployment)
- Geoapify API
- Ticketmaster API

---

## Models

### Adventure
- title
- city
- address
- category
- description
- google_place_id
- image_url
- created_at

### SavedAdventure
- user (ForeignKey)
- adventure (ForeignKey)
- notes
- is_completed
- saved_at

Relationship:
- A user can have many saved adventures
- Each saved adventure is linked to one adventure

---

## How It Works

1. User signs up or logs in
2. User searches for a city
3. The app fetches data from APIs and shows results
4. User can save an adventure
5. Saved adventures show up on the Saved page
6. User can add notes and mark items as completed
7. The last search is saved and shows again when returning to the home page

---

## Local Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/JoseMMedranoJr/adventureapp.git
cd adventureapp
git checkout local-repo-download
```

### 2. Run Script
```bash
chmod +x setup_local.sh
./setup_local.sh
```

### 3. Add API Keys
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

After setup, update the .env files with your API keys.
I've slacked you/DM'd, to you by now.

### 4. Sign up issues I had
If sign up doesnt work immidiately try this:
```bash
docker compose exec backend python manage.py migrate
```

### 5. LET'S RUN THIS BAD BOY!
Frontend:
http://localhost:5173 or whatever your local
Backend:
http://localhost:8000 or whatever your local