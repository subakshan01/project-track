# TechTrack Deployment Guide

## Architecture Overview
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    Vercel     │    │    Render    │    │ MongoDB Atlas│
│ React Student │───>│  Express.js  │───>│   Database   │
│ Angular Staff │───>│   REST API   │    │   (Cloud)    │
└──────────────┘    └──────────────┘    └──────────────┘
```

## Step 1: MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Under "Database Access" → Create a database user
4. Under "Network Access" → Add `0.0.0.0/0` (for development)
5. Under "Databases" → Click "Connect" → Get connection string
6. Format: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/techtrack`

## Step 2: Backend → Render

1. Push code to GitHub
2. Go to [Render](https://render.com) → New Web Service
3. Connect your GitHub repo
4. **Settings:**
   - Name: `techtrack-api`
   - Root Directory: `backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node server.js`
5. **Environment Variables:**
   ```
   PORT=5000
   MONGODB_URI=<your atlas connection string>
   JWT_SECRET=<random 64 char string>
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_REACT_URL=https://techtrack-student.vercel.app
   FRONTEND_ANGULAR_URL=https://techtrack-staff.vercel.app
   ```
6. Deploy

## Step 3: React Student Frontend → Vercel

1. Go to [Vercel](https://vercel.com) → Import Project
2. Select repo, set root to `frontend/react-student`
3. Framework: Vite
4. **Environment Variables:**
   ```
   VITE_API_URL=https://techtrack-api.onrender.com/api
   ```
5. **Add `vercel.json` in `frontend/react-student/`:**
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://techtrack-api.onrender.com/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
6. Deploy

## Step 4: Angular Staff Frontend → Vercel

1. Go to Vercel → Import Project
2. Select repo, set root to `frontend/angular-staff`
3. Build Command: `npx ng build --configuration production`
4. Output Directory: `dist/techtrack-staff/browser`
5. **Add `vercel.json` in `frontend/angular-staff/`:**
   ```json
   {
     "rewrites": [
       { "source": "/api/(.*)", "destination": "https://techtrack-api.onrender.com/api/$1" },
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
6. Deploy

## Step 5: Seed Production Database
```bash
cd backend
MONGODB_URI="your_atlas_uri" node seed/seed.js
```

## Post-Deployment Checklist
- [ ] Backend health check: `GET /api/health`
- [ ] React app loads login page
- [ ] Angular app loads login page
- [ ] Can login with sample credentials
- [ ] CORS allows both frontend domains
- [ ] File uploads work (check Render disk)
