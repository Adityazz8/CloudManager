# Google Drive Clone

A Google Drive clone backend built with Node.js, Express, MongoDB Atlas, and Cloudinary.

## Features
- User registration and login with JWT authentication
- File upload to Cloudinary storage
- File listing and deletion
- MongoDB for user and file metadata

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up MongoDB Atlas:
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a cluster and get your connection string.
4. Set up Cloudinary:
   - Create a free account at [Cloudinary](https://cloudinary.com)
   - Get your cloud name, API key, and API secret.
5. Create a `.env` file based on `.env.example` and fill in your credentials.
6. Run the app: `npm start`

## API Endpoints
- `GET /user/register` - Registration page
- `POST /user/register` - Register user
- `GET /user/login` - Login page
- `POST /user/login` - Login user
- `POST /user/logout` - Logout
- `GET /home` - Home page (authenticated)
- `POST /upload` - Upload file (authenticated)
- `GET /files` - Get user's files (authenticated)
- `DELETE /files/:id` - Delete file (authenticated)
