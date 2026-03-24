# TechTrack – Project & Staffing Management System

A full-stack MERN + MEAN web application for college project management and staffing coordination.

## 🏗️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Backend | Node.js, Express.js, MongoDB (Mongoose) |
| Student Frontend | React 18 + Vite |
| Staff Frontend | Angular 17 (Standalone) |
| Auth | JWT + Role-Based Access Control |
| File Storage | Multer (local uploads) |
| Database | MongoDB Atlas |

## 📁 Project Structure

```
techtrack/
├── backend/               # Express.js REST API
│   ├── config/           # Database configuration
│   ├── middleware/        # Auth & upload middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route handlers
│   ├── seed/             # Sample data seeder
│   ├── uploads/          # File uploads directory
│   └── server.js         # Entry point
├── frontend/
│   ├── react-student/    # React 18 student portal
│   │   └── src/
│   │       ├── components/
│   │       ├── context/
│   │       ├── pages/
│   │       └── services/
│   └── angular-staff/    # Angular 17 staff portal
│       └── src/
│           └── app/
│               ├── pages/
│               └── services/
├── db/                   # Schema documentation
├── documentation/        # Project documentation
└── ui-ux-design/         # Wireframes & design docs
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI
npm install
npm run seed    # Load sample data
npm run dev     # Start on port 5000
```

### 2. React Student Frontend
```bash
cd frontend/react-student
npm install
npm run dev     # Start on port 5173
```

### 3. Angular Staff Frontend
```bash
cd frontend/angular-staff
npm install
npm run dev     # Start on port 4200
```

## 🔑 Sample Login Credentials

### Staff Accounts (password: `staff123`)
| Name | Email |
|------|-------|
| Dr. Priya Sharma | priya.sharma@techtrack.edu |
| Prof. Rahul Verma | rahul.verma@techtrack.edu |
| Dr. Anita Desai | anita.desai@techtrack.edu |

### Student Accounts (password: `student123`)
| Name | Email | Department |
|------|-------|-----------|
| Arjun Patel | arjun.patel@student.edu | CS |
| Meera Krishnan | meera.k@student.edu | CS |
| Vikram Singh | vikram.s@student.edu | IT |
| Sneha Reddy | sneha.r@student.edu | ECE |
| Karan Mehta | karan.m@student.edu | CS |

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login (returns JWT) |
| GET | /api/auth/me | Get current user |

### Projects
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/projects | Public | List with search/filter |
| GET | /api/projects/:id | Public | Project details |
| POST | /api/projects | Staff | Create project |
| PUT | /api/projects/:id | Staff | Update project |
| DELETE | /api/projects/:id | Staff | Delete project |
| POST | /api/projects/:id/request-role | Student | Request a role |
| GET | /api/projects/:id/requests | Staff | View requests |
| PUT | /api/projects/:pid/requests/:rid | Staff | Approve/reject |
| GET | /api/projects/my/requests | Student | My requests |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/users/staff | Public | Staff directory |
| GET | /api/users/staff/:id | Public | Staff profile |
| GET | /api/users/students | Staff | Student list |
| GET | /api/users/student/:id | Public | Student profile |
| PUT | /api/users/profile | Auth | Update profile |
| PUT | /api/users/availability | Staff | Set availability |

### Notifications
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/notifications | Auth | Get notifications |
| PUT | /api/notifications/:id/read | Auth | Mark as read |
| PUT | /api/notifications/read-all | Auth | Mark all read |

### Chat
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/chat/:projectId | Auth | Get messages |
| POST | /api/chat/:projectId | Auth | Post message |

### Documents
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/documents/upload | Student | Upload document |
| GET | /api/documents/my | Student | My documents |
| GET | /api/documents/pending | Staff | Pending reviews |
| PUT | /api/documents/:id/verify | Staff | Verify/reject |

## 🌐 Deployment

### Backend → Render
1. Create a new Web Service on Render
2. Set root directory to `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables from `.env.example`

### React Frontend → Vercel
1. Import repo to Vercel
2. Set root directory to `frontend/react-student`
3. Framework preset: Vite
4. Add env var: `VITE_API_URL=https://your-backend.onrender.com/api`

### Angular Frontend → Vercel
1. Import repo to Vercel
2. Set root directory to `frontend/angular-staff`
3. Build command: `ng build --configuration production`
4. Output directory: `dist/techtrack-staff/browser`
5. API calls proxy through Vercel rewrites

### MongoDB Atlas
1. Create free M0 cluster on MongoDB Atlas
2. Create database user
3. Whitelist IPs (or 0.0.0.0/0 for development)
4. Copy connection string to backend `.env`

## 🔒 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_REACT_URL=https://your-react.vercel.app
FRONTEND_ANGULAR_URL=https://your-angular.vercel.app
```

## ✨ Features

- ✅ JWT Authentication with RBAC (Student/Staff)
- ✅ Project CRUD with search, filter, and archive
- ✅ Role request & allocation workflow
- ✅ Staff availability indicator
- ✅ In-website notification system (bell icon)
- ✅ Per-project discussion threads
- ✅ Document upload & staff verification
- ✅ LinkedIn-style student profiles
- ✅ Staff directory with contact info
- ✅ Help/SRS module
- ✅ Premium dark-mode UI with glassmorphism
- ✅ Responsive design
