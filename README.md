# Adventure Tracker

# Overview
Adventure Tracker is a full-stack web application that helps users discover and save local activities in any city.
Users can search for things like parks, trails, concerts, and events, then save the ones they are interested in and add personal notes.
The goal of the app is to make it easy to explore new places and keep track of things you want to do.

# Features
o Search for adventures by city
o View real results from APIs (parks, trails, events, concerts)
o Save adventures to a personal list
o Add notes to saved adventures
o Mark adventures as completed or planned
o Edit and delete saved adventures
o Last search is remembered when returning to the home page

# App Stack
Frontend:
o React (Vite)

Backend:
oDjango
o Django REST Framework

Database:
o PostgreSQL

Other:
o Docker / Docker Compose
o AWS EC2 (deployment)
oGeoapify API
oTicketmaster API

# Models

# Adventure
- title
- city
- address
- category
- description
- google_place_id
- image_url
- created_at

# SavedAdventure
- user (ForeignKey)
- adventure (ForeignKey)
- notes
- is_completed
- saved_at

Relationship:
- A user can do many saved adventures
- Each saved adventure is linked to one adventure

# How It Works

1. User signs up or logs in
2. User searches for a city
3. The app fetches data from APIs and shows results
4. User can save an adventure
5. Saved adventures appear on the Saved page
6. User can add notes and mark items as completed
7. The last search is stored and restored when returning to the home page

******************Local Setup Instructions********************************

1. Clone Repo

```bash
git clone https://github.com/JoseMMedranoJr/adventureapp.git
cd adventureapp
git checkout local-repo-download

2. Run Set-up Scripts
chmod +x setup_local.sh
./setup_local.sh

3. Rename the .env.example and add api keys because my app project uses this for configs.
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
* at this point you should have my api keys in you DM's in slack, replace the .env file with my keys please. 

* If for whatever reason the signup page doesnt create a user, try: <docker compose exec backend python manage.py migrate>