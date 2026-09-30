🌱 EcoCare — Smart Waste Management System

EcoCare is a full-stack MERN-based Waste Management System designed to make waste reporting, pickup requests, complaint tracking, and municipal administration easier and more transparent.

The platform provides separate experiences for citizens and administrators, allowing citizens to report waste-related problems and request waste pickups, while administrators can manage complaints, pickups, citizens, and system analytics from a centralized dashboard.

📌 Table of Contents
About the Project
Problem Statement
Our Solution
Key Features
Citizen Features
Admin Features
Waste Management
Complaint Management
Pickup Management
Dashboard & Analytics
Authentication & Security
Technology Stack
Project Structure
Application Workflow
REST API
Database
Installation
Environment Variables
Running the Project
API Testing
Responsive Design
Future Enhancements
Project Status
Git Workflow
Contributing
Developer
License
🌍 About the Project

Waste management is an important part of maintaining clean, healthy, and sustainable communities. Traditional complaint systems can be slow, difficult to track, and lack transparency.

EcoCare provides a centralized digital platform where citizens can:

Report waste-related problems
Track submitted complaints
Request waste pickups
View pickup details and status
Access waste-management awareness information

Administrators can:

Manage citizen complaints
Manage pickup requests
Update complaint and pickup statuses
View registered citizens
Monitor system statistics
Analyze waste-management activity
❗ Problem Statement

Many communities face challenges such as:

Uncollected garbage
Illegal waste dumping
Dirty public areas
Blocked drains
Difficulty requesting waste pickup
Lack of complaint tracking
Limited transparency between citizens and administrators
Difficulty monitoring waste-management activities

EcoCare aims to provide a structured digital solution for these problems.

💡 Our Solution

EcoCare connects citizens and administrators through a single web application.

Citizen Side

Citizens can register and log in to their accounts, report problems, request waste pickups, and track their activities.

Administration Side

Administrators receive centralized access to complaints, pickup requests, citizens, and analytics.

This creates a simple workflow:

Citizen → Report / Request → Admin → Process → Update Status → Citizen

🚀 Key Features
🔐 Secure user registration and login
👤 Citizen dashboard
🛡️ Admin authentication
📢 Waste complaint reporting
📋 Complaint tracking
🚛 Waste pickup requests
🆔 Automatic pickup booking ID
📊 Admin analytics
👥 Citizen management
🔄 Complaint status management
🔄 Pickup status management
📚 Waste-management awareness section
📱 Responsive user interface
🗄️ MongoDB database
🔑 JWT-based authentication
🔒 Role-based authorization
👨‍👩‍👧 Citizen Features
🔐 Registration & Login

Citizens can create an account using:

Name
Email
Phone number
Password

Registered users can securely log in to access their dashboard.

🏠 Citizen Dashboard

The dashboard provides citizens with an overview of their activities.

Users can view:

Complaint activity
Pickup requests
Pickup status
Account information
📢 Report Waste Issue

Citizens can report waste-related problems.

Supported complaint categories include:

Garbage Collection
Waste Dumping
Dirty Area
Blocked Drain
Other

Each complaint contains information such as:

Complaint title
Description
Location
Category
Status
Submission date
📋 My Complaints

Citizens can view complaints submitted through their account.

Complaint statuses include:

Pending
In Progress
Resolved
Rejected

This allows users to monitor the progress of their reported issues.

🚛 Waste Pickup System

Citizens can request waste collection directly through EcoCare.

Supported Waste Types
Organic Waste
Dry Recyclables
E-Waste
Bulk Waste
Pickup Information

Users can provide:

Waste type
Quantity
Pickup date
Pickup time
Full name
Phone number
Address type
Complete address
Additional instructions
🕐 Pickup Time Slots

EcoCare supports three pickup time slots:

🌅 Morning
☀️ Afternoon
🌆 Evening
🏠 Address Types

Users can select:

Home
Society / Apartment
Office / Commercial
🆔 Pickup Booking ID

Every successful pickup request receives a unique booking ID.

Example:

PK123456

This makes it easier to identify and track individual pickup requests.

🔄 Pickup Status

Administrators can update pickup requests through different stages:

Scheduled
In Progress
Completed
Cancelled

Citizens can view the latest pickup status from their dashboard.

📢 Complaint Management

Administrators can view all submitted complaints.

Admin functionality includes:

View complaints
Search complaints
Filter complaints
View complaint details
Update complaint status

Complaint workflow:

Pending → In Progress → Resolved

A complaint can also be marked as:

Rejected

👨‍💼 Admin Portal

EcoCare provides a dedicated administration system.

Administrators have access to:

Admin Dashboard
Complaint Management
Pickup Management
Citizen Management
Analytics

Admin access is protected using role-based authorization.

Only users with the admin role can access protected admin APIs.

📊 Dashboard & Analytics

The admin dashboard provides an overview of the system.

Analytics include:

Citizens
Total registered citizens
Complaints
Total complaints
Pending complaints
In Progress complaints
Resolved complaints
Rejected complaints
Pickups
Total pickup requests
Scheduled pickups
In Progress pickups
Completed pickups
Cancelled pickups

This gives administrators a centralized view of the current system activity.

👥 Citizen Management

Administrators can view registered citizens.

Citizen information includes:

Name
Email
Phone
Registration date
Number of complaints
Number of pickup requests

This helps administrators understand citizen activity within the system.

🔐 Authentication & Security

EcoCare uses authentication and authorization mechanisms to protect user data and admin functionality.

JWT Authentication

JSON Web Tokens are used for authenticated API requests.

Protected requests use:

Authorization: Bearer <token>

Password Security

Passwords are hashed using:

bcryptjs

Passwords are never stored as plain text.

Role-Based Authorization

EcoCare supports two roles:

user
admin

Admin-only operations require the authenticated user's role to be admin.

🛠️ Technology Stack
Frontend
React.js
React Router
JavaScript
HTML5
CSS3
Fetch API
Vite
Backend
Node.js
Express.js
REST API
JWT
bcryptjs
CORS
dotenv
Database
MongoDB
Mongoose
Development Tools
VS Code
Git
GitHub
Postman
Nodemon
🏗️ Project Structure
EcoCare/
│
├── backend/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── pickupController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Complaint.js
│   │   ├── Pickup.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── pickupRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── .env
│   ├── adminSeeder.js
│   ├── promoteAdmin.js
│   ├── package.json
│   └── server.js
│
├── src/
│   │
│   ├── admin/
│   │   ├── AdminAnalytics.jsx
│   │   ├── AdminComplaints.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminPickups.jsx
│   │   └── AdminUsers.jsx
│   │
│   ├── components/
│   │   ├── ComplaintCard.jsx
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   │
│   ├── pages/
│   │   ├── Awareness.jsx
│   │   ├── ComplaintDetails.jsx
│   │   ├── Complaints.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── PickupRequest.jsx
│   │   ├── Register.jsx
│   │   └── ReportIssue.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── .gitignore
├── package.json
└── README.md
🔄 Application Workflow
👤 Citizen Workflow
Register
   ↓
Login
   ↓
Citizen Dashboard
   ↓
 ┌──────────────────────┐
 │                      │
Report Issue       Request Pickup
 │                      │
 ↓                      ↓
Complaint Created   Booking Created
 │                      │
 ↓                      ↓
Admin Processing    Admin Processing
 │                      │
 ↓                      ↓
Status Updated      Status Updated
 │                      │
 └──────────┬───────────┘
            ↓
       Citizen Tracks
          Activity
👨‍💼 Admin Workflow
Admin Login
     ↓
Admin Dashboard
     ↓
 ┌───────────┬────────────┬─────────────┐
 │           │            │
Complaints  Pickups    Citizens
 │           │            │
 ↓           ↓            ↓
Manage      Manage       View
Status      Status       Activity
 │           │
 └──────┬────┘
        ↓
     Analytics
🌐 REST API

Base URL:

http://localhost:5000/api

🔐 Authentication
Register

POST /auth/register

Login

POST /auth/login

📢 Complaints
Create Complaint

POST /complaints

Get My Complaints

GET /complaints/my

Get All Complaints

GET /complaints

Admin only

Update Complaint Status

PATCH /complaints/:id/status

Admin only

🚛 Pickups
Create Pickup

POST /pickups

Get My Pickups

GET /pickups/my

Get All Pickups

GET /pickups

Admin only

Update Pickup Status

PATCH /pickups/:id/status

Admin only

👥 Citizens
Get Citizens

GET /users/citizens

Admin only

📊 Analytics
Get Analytics

GET /analytics

Admin only

🗄️ Database

EcoCare uses MongoDB with Mongoose.

Main collections/models include:

User

Stores:

Name
Email
Phone
Password
Role
Timestamps
Complaint

Stores:

User
Title
Description
Location
Category
Status
Image field
Timestamps
Pickup

Stores:

User
Booking ID
Waste type
Quantity
Pickup date
Pickup time
Address information
Phone
Instructions
Status
Timestamps
💻 Installation
1. Clone the Repository
git clone https://github.com/Abhaypatel001/EcoCare.git
2. Navigate to the Project
cd EcoCare
3. Install Frontend Dependencies
npm install
4. Install Backend Dependencies
cd backend
npm install
🍃 MongoDB Setup

EcoCare requires MongoDB.

For local MongoDB installation, make sure MongoDB is running on:

mongodb://127.0.0.1:27017

The project database is:

ecocare
🔑 Environment Variables

Create a .env file inside the backend folder.

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecocare
JWT_SECRET=your_secret_key
Important

Do not upload .env to GitHub.

The project .gitignore already excludes environment files.

▶️ Running the Project
Start Backend

Open a terminal:

cd backend
npm run dev

Backend will run on:

http://localhost:5000
Start Frontend

Open another terminal from the project root:

npm run dev

Frontend will normally run on:

http://localhost:5173
🧪 API Testing

The backend APIs can be tested using Postman.

Recommended testing order:

1. Register
POST /api/auth/register
2. Login
POST /api/auth/login

Copy the returned JWT token.

3. Add Authorization

For protected APIs use:

Authorization: Bearer <your_token>
4. Test Protected APIs

Examples:

GET /api/complaints/my
POST /api/complaints
GET /api/pickups/my

Admin users can additionally test:

GET /api/complaints
GET /api/pickups
GET /api/users/citizens
GET /api/analytics
📱 Responsive Design

EcoCare is designed to work across different screen sizes.

Supported layouts include:

💻 Desktop
💻 Laptop
📱 Tablet
📱 Mobile

The navigation system, dashboards, cards, forms, and management sections are designed with responsive CSS.

🔮 Future Enhancements

Possible future improvements include:

📍 GPS-based waste reporting
🗺️ Interactive waste-location maps
📸 Complete image upload support
🔔 Real-time notifications
📱 Progressive Web App support
📊 Advanced analytics and charts
🤖 AI-based waste classification
♻️ Smart waste segregation recommendations
💳 Online payment support for paid services
🚚 Real-time pickup tracking
📧 Email notifications
📲 SMS notifications
🌐 Multi-language support
☁️ Cloud deployment
🔎 Advanced complaint search and filtering
📌 Project Status
Module	Status
User Registration	✅ Completed
User Login	✅ Completed
JWT Authentication	✅ Completed
Role-Based Authorization	✅ Completed
Citizen Dashboard	✅ Completed
Complaint Reporting	✅ Completed
Complaint Tracking	✅ Completed
Admin Complaint Management	✅ Completed
Waste Pickup Request	✅ Completed
Pickup Status Management	✅ Completed
Citizen Management	✅ Completed
Admin Analytics	✅ Completed
Awareness Section	✅ Completed
Responsive UI	✅ Completed
REST API	✅ Completed
MongoDB Integration	✅ Completed
Postman API Testing	✅ Completed
🔄 Git Workflow

After making changes:

git add .

Commit your changes:

git commit -m "Update EcoCare"

Push to GitHub:

git push

Repository:

EcoCare

🤝 Contributing

Contributions are welcome.

To contribute:

Fork the repository
Create a new branch
Make your changes
Test the application
Commit your changes
Push the branch
Create a Pull Request
👨‍💻 Developer

Developed by Abhay Patel

GitHub:

https://github.com/Abhaypatel001

Project Repository:

https://github.com/Abhaypatel001/EcoCare

📄 License

This project is developed for educational and project-development purposes.

You may modify and extend the project according to your requirements.

🌱 EcoCare

Smart Waste Management for Cleaner Communities.

Report. Manage. Track. Clean. ♻️