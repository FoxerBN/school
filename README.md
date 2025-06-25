
# 🏫 School Management API

Live demo: [https://school-production-5d53.up.railway.app](https://school-production-5d53.up.railway.app)

## 📌 Overview

This is a **RESTful API** built with **Express.js** and **PostgreSQL** for managing users and students in a school system. It includes:

* 🔐 User authentication (JWT + cookies)
* 👨‍🎓 CRUD operations for students
* 👤 User management (register, delete, get by ID)
* 📦 Clean architecture with services, controllers, and validation
* 🔒 API protected with middleware and input validation using Zod
* 🚀 Hosted on [Railway](https://railway.app)

---

## ⚙️ Tech Stack

* **Backend:** Node.js + Express.js
* **Database:** PostgreSQL
* **ORM-like:** `postgres.js` (lightweight SQL builder)
* **Auth:** JWT + cookie-based session
* **Validation:** Zod
* **Password Hashing:** bcrypt
* **Deploy:** Railway

---

## 🔐 Auth Flow

* Login using `/login` with email and password
* Receives JWT token in HTTP-only cookies
* Token used to authenticate protected routes

---

## 📚 API Features

### 🧑 Users

* `GET /users` – List all users
* `GET /users/:id` – Get user by ID
* `POST /users` – Create user (register)
* `DELETE /users/:id` – Delete user

### 👨‍🎓 Students

* `GET /students` – List all students
* `GET /students/:id` – Get student by ID
* `POST /students` – Create student (auth required)
* `PUT /students/:id` – Update student (validated fields)
* `DELETE /students/:id` – Delete student

---

## 🛡️ Validation & Security

* Input validation using **Zod**
* Email/password checks with detailed error handling
* Prevents unauthorized access with role-based middleware
* Token stored in secure, HTTP-only cookies

---

## 💽 Local Development

```bash
# Clone the repo
git clone https://github.com/yourusername/school-management-api.git

# Install dependencies
npm install

# Start PostgreSQL (or use Railway)
# Set environment variable in .env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres

# Run the app
npm run dev
```


---

## 🧠 Project Structure

```
src/
├── controllers/
├── service/
├── middlewares/
├── utils/
├── config/
├── interfaces/
```

---
## 🧪 API Tester Frontend

This project includes a custom HTML/CSS/JS frontend template for testing API endpoints.  
It supports full CRUD operations (GET, POST, PUT, DELETE), handles authentication, and displays formatted responses.  
The UI is responsive and built without any external frameworks.

You can find the template in the `index.html` file.

