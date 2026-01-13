# Google Drive Clone - Complete Setup Guide

## Prerequisites
- Node.js installed
- MongoDB Atlas account (free)
- Cloudinary account (free)

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click **"Sign Up"** and create a free account
3. Verify your email

### 1.2 Create a Cluster
1. After login, click **"Create"** to create a new project
2. Name your project (e.g., "google-drive-clone")
3. Click **"Create Project"**
4. Click **"Create a Deployment"**
5. Choose **"Free"** tier (M0 - Sandbox)
6. Select your preferred region (closest to you)
7. Click **"Create Deployment"**

### 1.3 Set Up Authentication
1. In the left sidebar, click **"Security" → "Database Access"**
2. Click **"Add New Database User"**
3. Enter:
   - **Username**: `mongouser` (or any username)
   - **Password**: Create a strong password (save it!)
4. Click **"Add User"**

### 1.4 Get Connection String
1. Go to **"Deployment" → "Databases"**
2. Click **"Connect"** on your cluster
3. Select **"Drivers"**
4. Choose **"Node.js"** and version **"4.1 or later"**
5. Copy the connection string

### 1.5 Create `.env` File
1. Open your project root folder
2. Create a file named `.env`
3. Add this line with your connection string:
   ```
   MONGO_URI=mongodb+srv://mongouser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/googledrivedb?retryWrites=true&w=majority
   ```
4. Replace:
   - `mongouser` with your username
   - `YOUR_PASSWORD` with your password
   - Keep the rest as is

---

## Step 2: Cloudinary Setup

### 2.1 Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up"** (free tier)
3. Verify your email

### 2.2 Get Your Credentials
1. After login, go to your **Dashboard**
2. You'll see your credentials at the top:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 2.3 Add to `.env` File
1. Open your `.env` file
2. Add these lines:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Replace with your actual credentials from the dashboard

---

## Step 3: JWT Secret

1. Open your `.env` file
2. Add a JWT secret (any random string):
   ```
   JWT_SECRET=your_super_secret_key_12345
   ```

---

## Complete `.env` File Example
```
MONGO_URI=mongodb+srv://mongouser:password123@cluster0.abc123.mongodb.net/googledrivedb?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_jwt_key_12345
CLOUDINARY_CLOUD_NAME=dh1a2b3c4
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcd1234efgh5678ijkl9012
```

---

## Step 4: Start the Application

1. Open terminal in your project folder
2. Run:
   ```bash
   npm start
   ```
3. Server runs on `http://localhost:3000`

---

## Step 5: Test the Application

### Register a New User
1. Go to `http://localhost:3000/user/register`
2. Enter username, email, password (min 6 chars)
3. Click register

### Login
1. Go to `http://localhost:3000/user/login`
2. Enter username and password
3. Click login → redirects to `/home`

### Upload a File
1. On the home page, select a file
2. Click **"Upload File"**
3. You should see a success message
4. File appears in "Your Files" list
5. Click the link to download or delete

---

## Troubleshooting

### "File upload failed" Error
**Solution**: Check terminal for error details. Common issues:
- **Cloudinary credentials invalid**: Verify API key and secret in dashboard
- **File too large**: Cloudinary free tier supports up to 100MB per file
- **Network issue**: Check your internet connection

### "MongoDB connection error"
**Solution**:
1. Check MONGO_URI in `.env` is correct
2. Ensure your IP is whitelisted in MongoDB Atlas:
   - Go to **"Security" → "Network Access"**
   - Click **"Add Current IP Address"**
   - Or add `0.0.0.0/0` to allow all IPs

### Files not showing
**Solution**:
1. Make sure you're logged in (check browser cookies)
2. Refresh the page
3. Check browser console for errors (F12)

---

## File Limits (Free Tier)

**MongoDB Atlas:**
- Storage: 512 MB
- Max collection size: 512 MB

**Cloudinary:**
- Storage: 25 GB
- Monthly bandwidth: 25 GB
- File upload limit: 100 MB per file

---

## Next Steps
- Add user profile functionality
- Add file sharing features
- Add search functionality
- Deploy to Heroku/Railway

---

**Need help?** Check the terminal output for specific error messages!