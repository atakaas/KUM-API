# 🏡 KUM Villa Management – Backend API

KUM Villa Management Backend is a RESTful API built to support villa management operations under KUM.  
It handles authentication, role-based access control, villa and room management, booking operations, and staff daily operations, fully integrated with the **kum-crack** frontend application.

---

## 📖 Project Description

This backend acts as the core business logic and data layer for the KUM Villa Management system. It enables:

- **Admins** to manage villas, rooms, bookings, users, and a centralized booking calendar across all villas
- **Staff** to monitor assigned villas, booking schedules, operational tasks, and expenses
- Secure authentication using JWT and role-based authorization (RBAC)
- Integration readiness for direct booking and third-party booking platforms

The system is designed with a modular, scalable architecture and follows industry best practices, making it ready for production deployment.

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login (Admin & Staff)
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Protected routes using Guards and Decorators

### 🏡 Villa Management (Admin)
- Create, read, update, and delete villas
- Manage villa details (location, facilities, pricing, status)
- Assign staff to villas

### 🛏️ Room Management (Admin)
- Add and manage rooms per villa
- Configure room capacity and pricing

### 📅 Booking Management (Admin & Staff)
- Create direct bookings
- View booking schedules in calendar format
- Prevent double bookings (date overlap validation)
- Track booking and payment status

### 👷 Staff Operational Dashboard
- View assigned villas
- Monitor upcoming check-ins and check-outs
- Manage daily operational tasks

### 💰 Expense Tracking (Staff)
- Record operational expenses
- Upload invoice or receipt references
- Real-time financial tracking

### 📊 Dashboard
- Admin dashboard: overall villa and booking overview
- Staff dashboard: daily operational schedules and tasks

---

## 🧰 Tech Stack Used

### Backend
- **Node.js** v18+
- **NestJS** v10
- **TypeScript** v5
- **Prisma ORM** v6
- **PostgreSQL** v15+ (Supabase)
- **JWT** (Authentication)
- **Swagger (OpenAPI)** – API Documentation

### Supporting Libraries
- class-validator & class-transformer
- bcryptjs (password hashing)
- Passport.js
- dotenv

---

## ⚙️ Installation & Usage

### 1️⃣ Clone the Repository

git clone https://github.com/atakashf/kum-api.git
cd kum-api

### 2️⃣ Install Dependencies
npm install

### 3️⃣ Environment Configuration

Create a .env file in the root directory:

 NODE_ENV=development
 PORT=3000
 API_PREFIX=api/v1

DATABASE_URL="postgresql://postgres:CCLzDYlwtIIzoKtLNONPclrvtJOZqJTt@crossover.proxy.rlwy.net:24308/railway"

JWT
 JWT_SECRET=0a0984626232257964b7c00baa25b426
 JWT_ACCESS_EXPIRATION=15m
 JWT_REFRESH_EXPIRATION=7d

Security
 BCRYPT_SALT_ROUNDS=12
 THROTTLE_TTL=60000
 THROTTLE_LIMIT=100

CORS
 CORS_ORIGIN=http://localhost:3000/

### 4️⃣ Prisma Setup
npx prisma generate
npx prisma migrate dev

### 5️⃣ Run Development Server
npm run start:dev

### 6️⃣ API Documentation

Access Swagger UI at:

[(http://localhost:3000/api/v1/docs)]

---

## Frontend
[https://kummanagement.netlify.app/]

## Backend API
[https://kum-api.up.railway.app/]

---

## 🗂️ Backend Project Structure

<img width="568" height="475" alt="image" src="https://github.com/user-attachments/assets/cd257287-2fb3-4bab-bc53-f076a49ce317" />


---

## Preview
<img width="1919" height="889" alt="Screenshot 2026-01-19 212735" src="https://github.com/user-attachments/assets/326e9174-f296-4ec6-ab05-379e7fef6989" />

<img width="1919" height="890" alt="Screenshot 2026-01-19 212753" src="https://github.com/user-attachments/assets/8d52651e-51a3-444f-9796-4cb69a69322c" />

<img width="1919" height="890" alt="Screenshot 2026-01-19 212805" src="https://github.com/user-attachments/assets/c7acabb8-fd1e-4620-834c-d9c71ad68a9e" />

---

## ERD

<img width="450" height="275" alt="image" src="https://github.com/user-attachments/assets/ddc76c4f-1b78-414f-9803-6d06d960b512" />


---

🚀 Future Improvements

File upload service (Cloudinary / AWS S3)

Payment gateway integration

Notification system (Email / WhatsApp)

Advanced analytics and reporting dashboard

Third-party OTA (Online Travel Agent) integration
