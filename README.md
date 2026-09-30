# 🌱 EcoCare — Smart Waste Management System

<p align="center">
  <strong>A full-stack MERN application for smarter waste reporting, pickup management, citizen engagement, and administrative monitoring.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/API-Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js">
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB">
  <img src="https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge" alt="JWT">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Completed-16A34A?style=flat-square" alt="Project Status">
  <img src="https://img.shields.io/badge/Responsive-Yes-2563EB?style=flat-square" alt="Responsive">
  <img src="https://img.shields.io/badge/License-MIT-111827?style=flat-square" alt="License">
</p>

---

## 📌 Table of Contents

- [About EcoCare](#-about-ecocare)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Objectives](#-objectives)
- [Key Features](#-key-features)
- [Citizen Module](#-citizen-module)
- [Complaint Management](#-complaint-management)
- [Waste Pickup Management](#-waste-pickup-management)
- [Admin Module](#-admin-module)
- [Analytics Dashboard](#-analytics-dashboard)
- [Authentication and Security](#-authentication-and-security)
- [Application Workflow](#-application-workflow)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Database Design](#-database-design)
- [REST API](#-rest-api)
- [API Testing](#-api-testing)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Responsive Design](#-responsive-design)
- [Awareness Module](#-awareness-module)
- [Future Enhancements](#-future-enhancements)
- [Project Status](#-project-status)
- [Git and GitHub Workflow](#-git-and-github-workflow)
- [Repository](#-repository)
- [Contributing](#-contributing)
- [Security Considerations](#-security-considerations)
- [Developer](#-developer)
- [License](#-license)

---

## 🌱 About EcoCare

**EcoCare** is a full-stack **Waste Management System** designed to make waste-related services more organized, transparent, and accessible.

The platform provides a digital bridge between **citizens** and **administrators**. Citizens can create accounts, report waste-related problems, request waste pickups, track their complaints and pickup requests, and learn about responsible waste management. Administrators can monitor citizens, manage complaints, manage pickup requests, update statuses, and view live system analytics.

EcoCare is built using the **MERN stack**:

> **MongoDB + Express.js + React + Node.js**

The project focuses on practical full-stack development concepts such as authentication, authorization, REST APIs, MongoDB data management, protected routes, responsive UI, dashboards, and role-based access control.

---

## 🚨 Problem Statement

Traditional waste management processes can face problems such as:

- Difficulty reporting waste-related issues.
- Limited visibility into complaint status.
- Unorganized waste pickup requests.
- Manual tracking of citizen requests.
- Lack of centralized administrative monitoring.
- Limited system-level analytics.
- Poor communication between citizens and waste-management authorities.

EcoCare addresses these challenges by providing a centralized digital platform.

---

## 💡 Solution

EcoCare provides separate experiences for **Citizens** and **Administrators**.

### 👤 Citizens can:

- Register and log in.
- Access their personal dashboard.
- Report waste-related complaints.
- Track complaint status.
- Request waste pickup.
- Track pickup booking status.
- View their complaint and pickup history.
- Access waste-management awareness content.

### 🛡️ Administrators can:

- Access a protected admin dashboard.
- View registered citizens.
- View and manage complaints.
- Update complaint status.
- View and manage pickup requests.
- Update pickup status.
- Search and filter records.
- Monitor live system analytics.

---

## 🎯 Objectives

The main objectives of EcoCare are:

1. Digitize waste-related complaint reporting.
2. Simplify waste pickup booking.
3. Provide transparent request tracking.
4. Provide administrators with centralized control.
5. Implement secure authentication and authorization.
6. Store application data using MongoDB.
7. Build reusable REST APIs.
8. Provide a responsive interface for desktop, tablet, and mobile users.
9. Demonstrate a complete real-world MERN application.

---

# ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Secure registration and login |
| 👤 Citizen Dashboard | Personal activity overview |
| 📢 Complaint Reporting | Report waste-related problems |
| 📋 Complaint Tracking | Track complaint status |
| 🚛 Pickup Booking | Schedule waste pickup |
| 🧾 Booking ID | Unique pickup booking reference |
| 📦 Pickup Tracking | Track pickup status |
| 🛡️ Admin Dashboard | Centralized administration |
| 👥 Citizen Management | View registered citizens |
| 📊 Analytics | Live complaint and pickup statistics |
| 🔎 Search & Filters | Find records quickly |
| 📚 Awareness | Waste-management awareness content |
| 📱 Responsive UI | Desktop, tablet, and mobile support |
| 🔑 Role-Based Access | Separate citizen and admin permissions |

---

# 👤 Citizen Module

The citizen module is designed for users who want to interact with waste-management services.

## Citizen Features

### 1. Registration

New users can create an account using:

- Name
- Email
- Phone number
- Password

Passwords are stored securely using hashing.

### 2. Login

Registered users can log in using their credentials.

After successful authentication, the backend returns a JWT token that is used to access protected APIs.

### 3. Dashboard

The citizen dashboard provides access to:

- Complaint activity
- Pickup requests
- Request status
- Personal information
- Quick actions

### 4. Report an Issue

Citizens can report problems such as:

- Garbage Collection
- Waste Dumping
- Dirty Area
- Blocked Drain
- Other

Each complaint contains information such as:

- Title
- Description
- Location
- Category
- Status
- Optional image field

### 5. Complaint Tracking

Citizens can view their own complaints and track statuses such as:

- Pending
- In Progress
- Resolved
- Rejected

### 6. Waste Pickup Request

Citizens can request pickup for:

- Organic Waste
- Dry Recyclables
- E-Waste
- Bulk Waste

They can provide:

- Quantity
- Pickup date
- Pickup time
- Address type
- Full name
- Phone
- Address
- Special instructions

A unique booking ID is generated for each pickup request.

### 7. Pickup Tracking

Citizens can view their pickup requests and track statuses:

- Scheduled
- In Progress
- Completed
- Cancelled

---

# 📢 Complaint Management

The complaint-management system allows citizens to report waste-related problems digitally.

## Complaint Lifecycle

```text
Citizen
   ↓
Create Complaint
   ↓
Pending
   ↓
Admin Reviews
   ↓
In Progress
   ↓
Resolved / Rejected
```

## Complaint Categories

- Garbage Collection
- Waste Dumping
- Dirty Area
- Blocked Drain
- Other

## Complaint Statuses

| Status | Meaning |
|---|---|
| Pending | Complaint has been submitted |
| In Progress | Complaint is being handled |
| Resolved | Complaint has been resolved |
| Rejected | Complaint has been rejected |

Administrators can update complaint status through the protected admin API.

---

# 🚛 Waste Pickup Management

EcoCare allows citizens to request scheduled waste collection.

## Supported Waste Types

- Organic Waste
- Dry Recyclables
- E-Waste
- Bulk Waste

## Pickup Status

| Status | Meaning |
|---|---|
| Scheduled | Pickup has been scheduled |
| In Progress | Pickup is currently being processed |
| Completed | Pickup has been completed |
| Cancelled | Pickup has been cancelled |

## Booking ID

Every pickup request receives a unique booking ID in the format:

```text
PK######
```

Example:

```text
PK482731
```

The booking ID makes it easier to identify and track a pickup request.

---

# 🛡️ Admin Module

The admin module provides centralized management of the EcoCare platform.

## Admin Dashboard

The dashboard provides an overview of:

- Total citizens
- Total complaints
- Complaint statuses
- Total pickups
- Pickup statuses
- Recent activity

## Admin Functions

### 👥 Citizen Management

Administrators can view registered citizens and related information such as:

- Name
- Email
- Phone
- Registration date
- Complaint count
- Pickup count

### 📢 Complaint Management

Administrators can:

- View all complaints.
- Search complaints.
- Filter complaints.
- View complaint details.
- Update complaint status.

### 🚛 Pickup Management

Administrators can:

- View all pickup requests.
- Search pickup requests.
- Filter pickup requests.
- View booking details.
- Update pickup status.

---

# 📊 Analytics Dashboard

EcoCare includes backend-driven analytics for administrative monitoring.

Analytics include:

### Citizens

```text
Total Registered Citizens
```

### Complaints

```text
Total Complaints
├── Pending
├── In Progress
├── Resolved
└── Rejected
```

### Pickups

```text
Total Pickups
├── Scheduled
├── In Progress
├── Completed
└── Cancelled
```

The analytics are calculated from MongoDB data rather than relying on hard-coded frontend numbers.

---

# 🔐 Authentication and Security

EcoCare uses **JWT-based authentication** and **role-based authorization**.

## Authentication Flow

```text
User
  ↓
Login
  ↓
Backend validates credentials
  ↓
JWT generated
  ↓
Frontend stores authenticated user information
  ↓
Protected API requests include:
Authorization: Bearer <token>
```

## Password Security

Passwords are hashed using:

```text
bcryptjs
```

Plain-text passwords are not stored in the database.

## Authorization

EcoCare supports two roles:

```text
user
admin
```

Protected backend routes verify the JWT token before allowing access.

Admin-only endpoints additionally verify the user's role.

---

# 🔄 Application Workflow

## Citizen Workflow

```text
Register
   ↓
Login
   ↓
Citizen Dashboard
   ├── Report Issue
   │      ↓
   │   Complaint Created
   │      ↓
   │   Track Status
   │
   └── Request Pickup
          ↓
       Booking Created
          ↓
       Track Status
```

## Admin Workflow

```text
Admin Login
   ↓
Admin Dashboard
   ├── View Citizens
   ├── Manage Complaints
   ├── Manage Pickups
   └── View Analytics
```

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │      EcoCare        │
                         │   React Frontend    │
                         └──────────┬──────────┘
                                    │
                                  HTTP
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Express.js API    │
                         │    Node.js Server   │
                         └──────────┬──────────┘
                                    │
                         ┌──────────┴──────────┐
                         │                     │
                         ▼                     ▼
                  ┌─────────────┐       ┌─────────────┐
                  │ JWT Auth &  │       │ REST API    │
                  │ Authorization│      │ Controllers │
                  └─────────────┘       └──────┬──────┘
                                               │
                                               ▼
                                      ┌─────────────────┐
                                      │     MongoDB     │
                                      │    Database     │
                                      └─────────────────┘
```

---

# 🧰 Technology Stack

## Frontend

| Technology | Purpose |
|---|---|
| React | User interface |
| React Router | Client-side routing |
| CSS | Responsive styling |
| JavaScript | Application logic |
| Fetch API | Backend API communication |

## Backend

| Technology | Purpose |
|---|---|
| Node.js | Server runtime |
| Express.js | REST API framework |
| Mongoose | MongoDB object modeling |
| JWT | Authentication |
| bcryptjs | Password hashing |
| CORS | Cross-origin communication |
| dotenv | Environment configuration |
| Multer | File-upload capability/package |

## Database

```text
MongoDB
```

## Development Tools

- Visual Studio Code
- Git
- GitHub
- Postman
- npm
- Nodemon

---

# 📁 Project Structure

```text
waste-management/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── ComplaintCard.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ReportIssue.jsx
│   │   ├── PickupRequest.jsx
│   │   ├── Complaints.jsx
│   │   ├── ComplaintDetails.jsx
│   │   ├── Awareness.jsx
│   │   └── AdminLogin.jsx
│   │
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminAnalytics.jsx
│   │   ├── AdminComplaints.jsx
│   │   ├── AdminPickups.jsx
│   │   └── AdminUsers.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── pickupController.js
│   │   ├── userController.js
│   │   └── analyticsController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── adminMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Complaint.js
│   │   └── Pickup.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── pickupRoutes.js
│   │   ├── userRoutes.js
│   │   └── analyticsRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md
```

> **Note:** `.env` files are excluded from GitHub using `.gitignore` and should be created locally.

---

# 🗄️ Database Design

EcoCare uses MongoDB with Mongoose models.

## 👤 User Model

Main fields:

```text
_id
name
email
phone
password
role
createdAt
updatedAt
```

### Role Values

```text
user
admin
```

---

## 📢 Complaint Model

Main fields:

```text
_id
user
title
description
location
category
status
image
createdAt
updatedAt
```

### Category Values

```text
Garbage Collection
Waste Dumping
Dirty Area
Blocked Drain
Other
```

### Status Values

```text
Pending
In Progress
Resolved
Rejected
```

---

## 🚛 Pickup Model

Main fields:

```text
_id
user
bookingId
wasteType
quantity
pickupDate
pickupTime
addressType
fullName
phone
address
instructions
status
createdAt
updatedAt
```

### Waste Type Values

```text
Organic Waste
Dry Recyclables
E-Waste
Bulk Waste
```

### Status Values

```text
Scheduled
In Progress
Completed
Cancelled
```

---

# 🔌 REST API

Base URL:

```text
https://ecocare-backend-zhgx.onrender.com/api
```

---

## 🔐 Authentication APIs

### Register

```http
POST /api/auth/register
```

Used to create a new citizen account.

### Login

```http
POST /api/auth/login
```

Used to authenticate a user and receive a JWT token.

---

## 📢 Complaint APIs

### Create Complaint

```http
POST /api/complaints
```

Authentication:

```text
Bearer Token Required
```

### Get My Complaints

```http
GET /api/complaints/my
```

Authentication:

```text
Bearer Token Required
```

### Get All Complaints

```http
GET /api/complaints
```

Access:

```text
Admin Only
```

### Update Complaint Status

```http
PATCH /api/complaints/:id/status
```

Access:

```text
Admin Only
```

---

## 🚛 Pickup APIs

### Create Pickup Request

```http
POST /api/pickups
```

Authentication:

```text
Bearer Token Required
```

### Get My Pickups

```http
GET /api/pickups/my
```

Authentication:

```text
Bearer Token Required
```

### Get All Pickups

```http
GET /api/pickups
```

Access:

```text
Admin Only
```

### Update Pickup Status

```http
PATCH /api/pickups/:id/status
```

Access:

```text
Admin Only
```

---

## 👥 Citizen API

### Get Citizens

```http
GET /api/users/citizens
```

Access:

```text
Admin Only
```

This endpoint returns citizen information along with complaint and pickup counts.

---

## 📊 Analytics API

### Get Analytics

```http
GET /api/analytics
```

Access:

```text
Admin Only
```

The endpoint returns citizen, complaint, and pickup statistics.

---

# 🧪 API Testing

The backend APIs can be tested using **Postman**.

Recommended testing order:

```text
1. Register
      ↓
2. Login
      ↓
3. Copy JWT Token
      ↓
4. Add Bearer Token in Authorization
      ↓
5. Create Complaint / Pickup
      ↓
6. Test Citizen APIs
      ↓
7. Login as Admin
      ↓
8. Test Admin APIs
```

For protected APIs, use:

```text
Authorization
→ Bearer Token
→ <JWT_TOKEN>
```

---

# ⚙️ Installation

## 1. Clone Repository

```bash
git clone https://github.com/Abhaypatel001/EcoCare.git
```

## 2. Open Project

```bash
cd EcoCare
```

## 3. Install Frontend Dependencies

```bash
npm install
```

## 4. Install Backend Dependencies

```bash
cd backend
npm install
```

---

# 🔑 Environment Variables

Create:

```text
backend/.env
```

Add:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecocare
JWT_SECRET=your_secure_jwt_secret
```

### Environment Variable Description

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used for JWT authentication |

> Never publish real passwords, database credentials, API keys, or JWT secrets to GitHub.

---

# ▶️ Running the Project

The frontend and backend should run in separate terminals.

## Terminal 1 — Backend

From the project root:

```bash
cd backend
npm run dev
```

Backend will run on:

```text
https://ecocare-backend-zhgx.onrender.com
```

You should see messages similar to:

```text
EcoCare backend running on https://ecocare-backend-zhgx.onrender.com
MongoDB Connected
```

---

## Terminal 2 — Frontend

From the project root:

```bash
npm run dev
```

Vite will provide the frontend URL, normally:

```text
http://localhost:5173
```

---

# 📱 Responsive Design

EcoCare is designed to work across:

- 💻 Desktop
- 💻 Laptop
- 📱 Mobile
- 📟 Tablet

The interface adapts navigation, cards, forms, tables, dashboards, and content sections according to screen size.

---

# 📚 Awareness Module

EcoCare also contains an awareness section designed to encourage responsible waste-management practices.

Topics can include:

- Waste segregation
- Recycling
- Responsible disposal
- E-waste awareness
- Clean surroundings
- Sustainable habits

The awareness module is intended to complement the application's operational features with educational content.

---

# 🚀 Future Enhancements

The following features can be added in future versions:

- 📍 Live GPS-based pickup tracking
- 🗺️ Interactive waste-location maps
- 🔔 Email and SMS notifications
- 📲 Push notifications
- 🤖 AI-based complaint categorization
- 🤖 AI-powered waste classification
- 📷 Image-based waste detection
- 📈 Advanced analytics and charts
- 🏆 Citizen reward and points system
- ♻️ Recycling partner integration
- 💳 Online payment support for applicable services
- 📱 Progressive Web App (PWA)
- ☁️ Cloud deployment
- 🐳 Docker support
- 🧪 Automated unit and integration testing
- 📁 Complete image/file upload workflow for complaints

---

# 📌 Project Status

```text
EcoCare
│
├── Citizen Authentication        ✅
├── Admin Authentication          ✅
├── Citizen Dashboard             ✅
├── Complaint Management          ✅
├── Complaint Status Tracking     ✅
├── Waste Pickup Management       ✅
├── Pickup Status Tracking        ✅
├── Citizen Management            ✅
├── Admin Dashboard               ✅
├── Analytics                     ✅
├── Search & Filtering            ✅
├── Awareness Module              ✅
├── Responsive UI                 ✅
├── REST APIs                     ✅
├── MongoDB Integration           ✅
├── JWT Authentication            ✅
├── Role-Based Authorization      ✅
└── GitHub Repository             ✅
```

---

# 🔄 Git and GitHub Workflow

After making changes:

```bash
git add .
git commit -m "Update EcoCare"
git push
```

Check repository status:

```bash
git status
```

View commit history:

```bash
git log --oneline
```

---

# 🌐 Repository

GitHub Repository:

**EcoCare**

```text
https://github.com/Abhaypatel001/EcoCare
```

---

# 🤝 Contributing

Contributions are welcome.

### Contribution Steps

1. Fork the repository.
2. Create a new branch.

```bash
git checkout -b feature/new-feature
```

3. Make your changes.
4. Test the application.
5. Commit your changes.

```bash
git add .
git commit -m "Add new feature"
```

6. Push your branch.

```bash
git push origin feature/new-feature
```

7. Create a Pull Request.

---

# 🔒 Security Considerations

EcoCare follows several basic security practices:

- Password hashing with bcryptjs.
- JWT-based authentication.
- Protected backend routes.
- Admin-only authorization.
- Environment variables for sensitive configuration.
- `.env` excluded from Git.
- MongoDB validation through Mongoose schemas.
- Role-based access control.

### Important

Never commit:

```text
.env
```

or any file containing:

```text
Database passwords
JWT secrets
API keys
Private credentials
```

---

# 👨‍💻 Developer

## Abhay Patel

**Full-Stack Developer | MERN Stack**

Project:

> **EcoCare — Smart Waste Management System**

Technologies used:

```text
React
Node.js
Express.js
MongoDB
Mongoose
JWT
bcryptjs
REST API
Git
GitHub
Postman
```

---

# 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute the project according to the terms of the license.

---

# 🌍 Vision

EcoCare aims to demonstrate how modern web technologies can be used to build practical digital solutions for cleaner communities and more organized waste-management services.

The long-term vision is to evolve EcoCare into a complete smart waste-management ecosystem connecting:

```text
Citizens
    ↕
EcoCare Platform
    ↕
Waste Management Teams
    ↕
Recycling & Collection Services
```

---

<p align="center">
  <strong>🌱 EcoCare — Building a Cleaner and Smarter Future</strong>
</p>

<p align="center">
  Made with ❤️ using the MERN Stack
</p>
