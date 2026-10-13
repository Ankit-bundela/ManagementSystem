# Employee Management System

A full-stack web application to manage employee records, departments, attendance, salaries, and employee addresses.
## Features

- **User Authentication** — Secure login and registration using JWT (JSON Web Tokens).
- **Employee Management** — Add, view, update, and manage employee records.
- **Department Management** — Manage departments and employee counts.
- **Attendance Management** — Track Present, Absent, and Leave statuses.
- **Attendance Summary** — View employee attendance summaries.
- **Salary Management** — Manage employee salary details.
- **Employee Address Management** — Maintain employee address records.
- **Inactive Users** — View employees marked as inactive.
- **Dashboard** — View employee statistics and department summaries.
- **REST API Integration** — Connect the React frontend with the Express backend and MySQL database.

## Technologies Used

### Frontend
- React.js
- React Router
- Material UI (MUI)
- JavaScript
- HTML and CSS

### Backend
- Node.js
- Express.js
- REST APIs
- JWT (JSON Web Tokens) Authentication

### Database
- MySQL
- mysql2

### Tools
- Git
- GitHub
- Postman

## Project Structure

```text
EmployeeManagementSystem/
├── client/
├── server/
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Ankit-bundela/ManagementSystem.git
cd ManagementSystem
```

### 2. Configure MySQL

- Start your MySQL server.
- Create the required database (`hr_db`).
- Create or import the required tables and triggers.
- Configure the database credentials securely in the backend.

*

### 3. Start the frontend

```bash
cd client
npm install
npm start

```

### 4. Start the backend

Open another terminal:

```bash
cd server
npm install
npm start
```

If `npm start` is not configured, run the backend entry file specified in `server/package.json`.

Make sure the frontend API URLs and backend port match your configuration.

## API Routes

The backend contains route groups for:

- `/employees`
- `/departments`
- `/attendance`
- `/dashboard`
- `/inactiveUsers