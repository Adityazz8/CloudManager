# ☁️ CloudManager

<div align="center">

![CloudManager Banner](public/dashboard_preview_mockup_1768502310084.png)

**A modern, secure cloud storage solution with a beautiful dark-themed interface**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/cloud/atlas)

[Live Demo](#) • [Features](#-features) • [Installation](#-installation) • [Usage](#-usage)

</div>

---

## ✨ Features

### 🔐 **Secure Authentication**
- User registration and login with JWT tokens
- Password hashing with bcrypt
- Protected routes and session management

### 📁 **Folder Organization**
- Create nested folders for better file organization
- Breadcrumb navigation for easy folder traversal
- Hierarchical folder structure with parent-child relationships

### 📤 **File Management**
- **Drag & Drop Upload** - Simply drag files into the upload zone
- **Cloud Storage** - Files stored securely on Cloudinary
- **File Preview** - View file details, dates, and metadata
- **Quick Delete** - Remove files and folders with confirmation modal

### 🎨 **Modern UI/UX**
- Premium dark theme with glassmorphism effects
- Responsive design for all devices
- Smooth animations and transitions
- Custom confirmation modals
- Toast notifications for user feedback

### ⚡ **Performance**
- Fast file uploads with Cloudinary CDN
- Optimized database queries with MongoDB
- Efficient file handling with Multer

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT, bcrypt |
| **File Storage** | Cloudinary |
| **File Upload** | Multer |
| **Template Engine** | EJS |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Remix Icons |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn**
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/users/register/free)

---
## 📖 Usage

### Creating an Account

1. Navigate to `http://localhost:3000`
2. Click **"Get Started"** or **"Register"**
3. Fill in your details (username, email, password)
4. Click **"Create Account"**

### Uploading Files

**Method 1: Drag & Drop**
- Simply drag files from your computer into the upload zone
- Files will upload automatically

**Method 2: Click to Upload**
- Click the **"Upload File"** button
- Select a file from your computer
- Click **"Open"** to upload

### Managing Folders

**Create a Folder:**
1. Click the **"New Folder"** button
2. Enter a folder name
3. Click **"Create"**

**Navigate Folders:**
- Click on any folder to open it
- Use breadcrumb navigation to go back

**Delete a Folder:**
1. Hover over a folder
2. Click the red trash icon
3. Confirm deletion in the modal

### Deleting Files

1. Find the file you want to delete
2. Click the **"Delete"** button
3. Confirm in the custom modal
4. File will be removed from both database and Cloudinary

---

## 📁 Project Structure

```
CloudManager/
├── config/
│   ├── cloudinary.config.js    # Cloudinary configuration
│   └── db.js                    # MongoDB connection
├── models/
│   ├── file.model.js            # File schema
│   ├── folder.model.js          # Folder schema
│   └── user.model.js            # User schema
├── routes/
│   ├── index.routes.js          # Main routes (home, upload, delete)
│   └── user.routes.js           # Auth routes (login, register)
├── views/
│   ├── home.ejs                 # Dashboard page
│   ├── index.ejs                # Landing page
│   ├── login.ejs                # Login page
│   └── register.ejs             # Registration page
├── public/
│   └── dashboard_preview_mockup.png  # Assets
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── app.js                       # Express app setup
├── package.json                 # Dependencies
└── README.md                    # This file
```

---

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Middleware ensures only authenticated users can access files
- **File Ownership**: Users can only delete their own files and folders
- **Environment Variables**: Sensitive credentials stored in `.env` file

---

## 🎨 Screenshots

### Landing Page
![Landing Page](public/dashboard_preview_mockup_1768502310084.png)

### Dashboard
Beautiful dark-themed interface with drag-and-drop upload, folder navigation, and file management.

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

