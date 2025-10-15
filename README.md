# 🌿 ZeroWaste-CSSE

A full-stack **waste collection and resource management system** built using the **MERN stack**.  
It enables residents, collectors, and administrators to manage waste collection, scheduling, and resource allocation efficiently.

---

## 🧱 Tech Stack

### Frontend
- React.js (Vite)
- Axios for API requests
- TailwindCSS for styling
- React Router for navigation

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (optional for image uploads)
- Multer for file handling

---

## 👥 User Roles

| Role | Features |
|------|-----------|
| **Resident** | Create waste requests, view request history |
| **Collector** | View assigned collection schedules, update status |
| **Admin** | Manage centers, vehicles, collectors, schedules, and resource allocation |

---


## 🚀 Setup Instructions

### 1. Clone the repo
```bash
git clone <repo-url>
cd ZeroWaste-CSSE-main
```

### 2. Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Configure environment variables
Create a `.env` file inside the backend directory:

```
PORT=3050
MONGO_URI=Your_DB_Link
JWT_SECRET=your_secret_key
CLOUDINARY_URL=your_cloudinary_url   # optional
```

### 4. Run the application
#### Backend
```bash
cd backend
npm start
```
#### Frontend
```bash
cd frontend
npm run dev
```

---



## 🧠 Features Summary
- 🔐 **JWT Authentication** (Resident / Collector / Admin)
- 🗑️ **Waste Requests Management**
- 🚛 **Vehicle & Collector Scheduling**
- 🕒 **Automatic Resource Allocation**
- 📊 **Admin Dashboard** for monitoring waste requests, resources, and performance
- 📱 **Responsive Frontend** built with modern UI/UX

---

## 👨‍💻 Developer Setup (Postman Testing)
Use the following base URL:
```
http://localhost:3050/api
```


