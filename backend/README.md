# E-commerce Backend API

Backend API for the e-commerce application with JWT authentication and MongoDB Atlas integration.

## Features

- JWT-based authentication
- User registration and login
- Password hashing with bcrypt
- MongoDB Atlas integration
- Protected routes with authentication middleware
- Express.js RESTful API

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend` directory with the following:
   ```
   MONGODB_URI=mongodb+srv://rushi:Rushi%403006@cluster1.rsmuwwv.mongodb.net/astra?retryWrites=true&w=majority&appName=Cluster1
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   PORT=5000
   ```

   **Important:** Change `JWT_SECRET` to a strong, random string in production!

3. **Start the Server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev

   # Production mode
   npm start
   ```

   The server will run on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### POST `/api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "user"
    }
  }
}
```

#### POST `/api/auth/login`
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "user"
    }
  }
}
```

#### GET `/api/auth/me`
Get current authenticated user (Protected route).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "user"
    }
  }
}
```

## Project Structure

```
backend/
├── models/
│   └── User.js          # User model/schema
├── routes/
│   └── authRoutes.js    # Authentication routes
├── middleware/
│   └── authMiddleware.js # JWT authentication middleware
├── utils/
│   └── generateToken.js # JWT token generation/verification
├── server.js            # Main server file
├── package.json
└── .env                 # Environment variables (not in git)
```

## Security Notes

- Passwords are hashed using bcrypt before storing
- JWT tokens are used for authentication
- Tokens expire after 7 days (configurable)
- Protected routes require valid JWT token in Authorization header

