# Saarang Event Hub

A full-stack web app where users can browse events, register/unregister, and admins can create events.

## Tech Stack
- **Backend:** Node.js, Express, MongoDB Atlas, JWT
- **Frontend:** React (Vite), React Router, Axios

## Setup & Run

### Prerequisites
- Node.js installed
- MongoDB Atlas account

### Backend
```bash
cd api
npm install
```
Create a `.env` file in `/api`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```
```bash
node server.js
```
Server runs on http://localhost:5000

### Frontend
```bash
cd client
npm install
npm run dev
```
App runs on http://localhost:5173

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
- JWT authentication
- Role-based access (user / admin)
- Duplicate registration prevention
- Protected routes on frontend and backend
- Admin panel to create events

## Seeding sample data
After setting up your .env, run:
cd api && node seed.js