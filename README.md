
# 🚀 Nitrogen – Backend

Nitrogen Backend is a **scalable, production-ready REST API** powering the Nitrogen project & task management platform.

It handles **authentication-aware APIs**, **database operations**, and **business logic**, and is deployed using **AWS infrastructure** with a PostgreSQL database.

---

## 🌐 Live API Base URL



https://15kg1nxcp2.execute-api.ap-south-1.amazonaws.com/prod


---

## 🧠 Responsibilities of the Backend

- Manage Projects, Tasks, Users, Teams
- Secure API endpoints with Cognito JWTs
- Persist data using Prisma ORM
- Handle relational data (users ↔ tasks ↔ projects)
- Serve production traffic reliably

---

## 🏗️ Tech Stack

### Core
- **Node.js (ESM)**
- **Express.js**
- **TypeScript**
- **Prisma ORM**

### Database
- **PostgreSQL**
- Hosted on **AWS RDS**

### Authentication
- **AWS Cognito**
- JWT-based Authorization

### Infrastructure
- **AWS EC2 (PM2 managed)**
- **AWS API Gateway**
- **AWS Lambda (Cognito triggers)**
- **PM2 Process Manager**

---

## 🔁 Backend Architecture Flow



Frontend (Next.js)
↓
AWS API Gateway
↓
Express Server (EC2 / PM2)
↓
Prisma ORM
↓
PostgreSQL (RDS)


---

## 🔐 Authentication Flow

1. User signs up / logs in via AWS Cognito
2. Cognito issues JWT Access Token
3. Frontend sends token in `Authorization` header
4. Backend validates token
5. Authorized routes execute business logic

---

## 📂 Project Structure



nitrogen-backend/
│── src/
│ ├── controllers/ # Request handlers
│ ├── routes/ # API route definitions
│ ├── prisma.ts # Prisma client initialization
│ ├── index.ts # App entry point
│
│── prisma/
│ ├── schema.prisma # Database schema
│
│── build/ # Compiled output
│── ecosystem.config.cjs # PM2 config
│── package.json


---

## 📡 API Endpoints

### Projects


GET /projects
POST /projects


### Tasks


GET /tasks
GET /tasks?projectId=:id
POST /tasks
PATCH /tasks/:id/status


### Users


GET /users
POST /users
GET /users/:cognitoId


### Teams


GET /teams


---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=80
DATABASE_URL=postgresql://postgres:<password>@<rds-endpoint>:5432/nitrogendb?schema=public

```
⚠️ DATABASE_URL must be present in PM2 environment
```
🧬 Prisma Setup
Generate client
npx prisma generate

Run migrations
npx prisma migrate deploy

🧠 Important Production Fixes Implemented
✅ Prisma Sequence Fix (Critical)
```


▶️ Running Locally
```
npm install
npm run build
npm run start
```

▶️ Running in Production (PM2)
```
pm2 start ecosystem.config.cjs
pm2 save
pm2 logs
```

🚀 Deployment Summary

EC2 hosts Express server

PM2 manages uptime

API Gateway routes traffic

RDS stores relational data

Prisma handles DB access

🧑‍💻 Author

Harsh Jajaniya
Full-Stack • Cloud • System Architecture

📌 Notes

Backend is stateless

Frontend & backend are fully decoupled

Designed for scalability and reliability

⭐ Support

If you found this useful, give the repo a ⭐ and feel free to contribute!
