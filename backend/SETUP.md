# Quick Setup Guide

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Create .env File

Create a file named `.env` in the `backend` directory with the following content:

```
MONGODB_URI=mongodb+srv://rushi:Rushi%403006@cluster1.rsmuwwv.mongodb.net/astra?retryWrites=true&w=majority&appName=Cluster1
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRE=7d
PORT=5000
```

**Important:** 
- The MongoDB URI is already configured
- Change `JWT_SECRET` to a strong random string for production
- The server will run on port 5000

## Step 3: Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

The server will start on `http://localhost:5000`

## Step 4: Configure Frontend

The frontend is already configured to connect to `http://localhost:5008/api` by default.

Create a `.env` file in the `frontend` directory:

```
VITE_API_BASE_URL=http://localhost:5008/api

# For "Continue with Google" - use the same Client ID as backend
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Google Sign-In (Optional)

To enable "Continue with Google" on login and signup:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID (Web application) for "Choice time"
3. Add **Authorized JavaScript origins**: `http://localhost:5173` (dev), `https://yourdomain.com` (prod)
4. Copy the **Client ID** and add to:
   - `backend/.env`: `GOOGLE_CLIENT_ID=...`
   - `frontend/.env`: `VITE_GOOGLE_CLIENT_ID=...`

## Testing the API

You can test the API endpoints using:
- Postman
- curl
- Or the frontend application

Example curl commands:

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","phone":"1234567890"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

