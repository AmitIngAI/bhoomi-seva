<div align="center">

# 🌾 Bhoomi Seva (भूमि-सेवा)

### Smart Land Records Management & AI-Powered Price Prediction System

[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**[Live Demo](https://bhoomi-frontend-f5sw.onrender.com/)**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 Overview

**Bhoomi Seva** is an end-to-end digital land records management portal integrated with an **AI Machine Learning Model** for real-time land valuation. Built specifically for Maharashtra state revenue data, it digitizes land verification processes including **7/12 Satbara Utara, 8-A Extract, and Property Cards**, while giving citizens accurate valuation estimates based on geospatial and infrastructure parameters.

### 🎯 Problem Statement

Traditional revenue office visits for land records verification are slow, paper-intensive, and prone to price manipulation. Bhoomi Seva solves these challenges by providing:

- ✅ **Instant Access** to verified digital land extracts (7/12 Satbara, 8-A, Property Cards).
- ✅ **AI-Powered Valuation** using Random Forest / XGBoost models considering Ready Reckoner rates and proximity factors.
- ✅ **Transparent Land History** tracking and PDF downloads.
- ✅ **Admin Workflow** for automated document generation and user status enforcement.

---

## ✨ Key Features

### 👤 Citizen Portal

| Feature | Description |
|---------|-------------|
| 🔐 **Secure Authentication** | JWT token authentication with BCrypt hashing and Captcha protection |
| 🔍 **Smart Land Search** | Search by Survey Number, Village, Taluka, District, or Land Type |
| 📄 **Document Generation** | Auto-generate and view 7/12 Satbara, 8-A Extract & Property Cards |
| 🤖 **AI Price Prediction** | Predict market prices using ML based on area, highways, city distance, and infrastructure |
| 📥 **Download & History** | Track viewed lands, download history, and past valuation predictions |
| 🔔 **Notification Center** | Real-time alerts on newly added or updated land records |

### 🔧 Admin Panel

| Feature | Description |
|---------|-------------|
| 📊 **Analytics Dashboard** | Overview of total records, document count, active users, and messages |
| 🛠️ **Land Records CRUD** | Add, update, or remove land records with full geo-coordinates |
| 📜 **Document Issuance** | One-click official generation of Satbara, 8-A, and Property Cards |
| 👥 **User Control** | Block, unblock, or permanently remove users with automated session termination |
| 💬 **Contact Desk** | View, reply, and resolve citizen inquiries directly from the portal |

---

## 🛠️ Tech Stack

### Backend & Core Services
├── Java 17 (Open JDK)
├── Spring Boot 3.x
│   ├── Spring Security (Stateless JWT Authentication)
│   ├── Spring Data JPA & Hibernate
│   └── RestTemplate (Microservice Inter-communication)
└── Maven 3.8+

### Machine Learning Model
├── Python 3.10+
├── Flask & Flask-CORS
├── Scikit-Learn (Random Forest / Regression Ensembles)
├── Pandas, NumPy & Joblib
└── Gunicorn WSGI

### Frontend
├── React 18.x
├── Vite 5.x
├── Tailwind CSS 3.x
├── Axios (with Request/Response Interceptors)
└── Lucide React Icons

### Database & Cloud
├── MySQL 8.0 / TiDB Cloud (Serverless MySQL)
└── Render (Cloud Web Services & Static Site Hosting)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              React 18 + Vite (Frontend)               │  │
│  │     Citizen Dashboard  │  Admin Control Center        │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST API (JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │            Spring Boot 3.x Backend Service            │  │
│  │  • JWT Filter           • Security Config             │  │
│  │  • Admin Initializer    • REST Controllers            │  │
│  └───────────────┬───────────────────────┬───────────────┘  │
└──────────────────┼───────────────────────┼──────────────────┘
                   │ JDBC                  │ RestTemplate
                   ▼                       ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│         DATA LAYER           │ │        ML AI LAYER         │
│  ┌────────────────────────┐  │ │  ┌──────────────────────┐  │
│  │  MySQL / TiDB Cloud    │  │ │  │  Python Flask Engine │  │
│  │  (bhoomi_seva_db)      │  │ │  │  (Land Valuation)    │  │
│  └────────────────────────┘  │ │  └──────────────────────┘  │
└──────────────────────────────┘ └────────────────────────────┘
```
🔒 Security
This application implements production-grade security standards:

✅ JWT Authentication: Stateless, signed JWT tokens.
✅ Interceptor Security: Auto-logout on user block or account deletion.
✅ Password Safety: BCrypt password hashing (10 rounds).
✅ Protected Secrets: Environment variables for DB credentials, JWT secret keys, and admin passwords.

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

<div align="center">

## 👨‍💻 Amit Ingale  

📞 Contact  
Developer Information  

<br>

[![Gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:amitgingale@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/amitgingale07)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AmitIngAI)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://amitingale.vercel.app/)

<br><br>

⭐ **Show Your Support**  
If this project helped you, please consider giving it a ⭐!

</div>
