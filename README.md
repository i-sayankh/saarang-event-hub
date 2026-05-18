# Saarang Event Hub

A full-stack web app where users can browse events, register/unregister, 
and admins can create events.

## Live Demo
- Frontend: https://saarang-event-hub.vercel.app
- Backend:  https://saarang-api.onrender.com

## Tech Stack
- **Backend:** Node.js, Express, MongoDB Atlas, JWT
- **Frontend:** React (Vite), React Router, Axios

## Architecture
Frontend (Vercel) → Backend API (Render) → Database (MongoDB Atlas)

## Local Setup

### Prerequisites
- Node.js installed
- MongoDB Atlas account (free tier works)

### Backend
```bash
cd api
npm install
```
Create a `.env` file in `/api`:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string
PORT=5000
```
```bash
node server.js
# Server runs on https://saarang-event-hub-5c2b.onrender.com
```

### Seed sample events
```bash
node seed.js
```

### Frontend
```bash
cd client
npm install
npm run dev
# App runs on http://localhost:5173
```

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/auth/signup | No | Register user |
| POST | /api/auth/login | No | Login user |
| GET | /api/events | No | List all events |
| GET | /api/events/:id | No | Single event |
| POST | /api/events/:id/register | User | Register for event |
| DELETE | /api/events/:id/register | User | Unregister |
| GET | /api/events/my/registrations | User | My registrations |
| POST | /api/events | Admin | Create event |
| PATCH | /api/auth/make-admin/:userId | Admin | Promote user to admin |

## Features
- JWT authentication (signup/login/logout)
- Role-based access control (user vs admin)
- Duplicate registration prevention at route and database level
- Capacity enforcement (full events reject registrations)
- Protected routes on both frontend and backend
- Admin panel to create events
- Server-side input validation

## Default Admin Setup
The first admin must be set manually in MongoDB Atlas.
Find your user document in the `users` collection and add:
`"role": "admin"`
After that, admins can promote other users via the API.
